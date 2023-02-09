import React, {FC, useContext, useEffect, useState} from 'react';
import {useAuthContext} from "api/auth/auth-context";
import {useRouter} from "next/router";
import {NotificationManager} from "react-notifications";
import {ApiClient} from "api/api-client";
import {Logger} from "util/logging";
import {UserNotificationDto} from "api/notifications/user-notification.dto";

const logger = Logger('notifications-context');

/**
 * Provides context for user notifications
 */

export interface NotificationsContextInterface {
    notifications: UserNotificationDto[],
    hasNotifications: boolean,
    mostRecentNotification?: UserNotificationDto,
    fetchNotifications: () => any,
    dismissNotification: (notificationId: number) => any,
    openNotificationContent: (notification: UserNotificationDto) => any,
    clearNotificationsForContent: (contentType: string, contentId?: number | string) => any,
    getNotificationsForContentType: (contentType: string) => any,
    getNotificationsForSecondaryRelatedContent: (contentType: string, contentId?: number) => any,
}

export const NotificationsContext = React.createContext<NotificationsContextInterface>({
    notifications: [],
    hasNotifications: false,
    fetchNotifications: () => {},
    dismissNotification: () => {},
    openNotificationContent: () => {},
    clearNotificationsForContent: () => {},
    getNotificationsForContentType: () => {},
    getNotificationsForSecondaryRelatedContent: () => {},
});

export const NotificationsContextProvider: FC = (props) => {
    const authContext = useAuthContext();
    const router = useRouter();
    const [notifications, setNotifications] = useState<UserNotificationDto[]>([]);

    /**
     * Sets up timed, continuous notification refresh
     */
    useEffect(() => {
        const recurringFetchHandle = setInterval(fetchNotifications, 10000);

        return () => clearInterval(recurringFetchHandle);
    }, []);

    /**
     * Fetches notifications for the current user
     * @return {Promise<void>}
     */
    async function fetchNotifications() {
        if (authContext.isSignedIn) {
            try {
                const response = await ApiClient.get('/user-notifications');
                setNotifications(response.data ?? []);
            }
            catch (e) {
                logger.error('Error fetching notifications', e);
            }
        }
    }

    /**
     * Dismisses a notification
     * @param {number} notificationId
     * @return {Promise<void>}
     */
    async function dismissNotification(notificationId: number) {
        if (authContext.isSignedIn) {
            const response = await ApiClient.delete(`/user-notifications/${notificationId}`);
            logger.debug('Deleted notification', response.data);
            setNotifications(response.data);
        }
    }

    /**
     * Opens the relevant page for a given notification
     * @param notification
     * @return {Promise<void>}
     */
    async function openNotificationContent(notification: UserNotificationDto) {
        try {
            if (notification.link && notification.link.trim().length > 0) {
                let link = notification.link;
                if (link.indexOf('//') > -1) {
                    link = '/' + link.split('//')[1].split(/\/(.+)/)[1];
                    await router.push(link);
                } else {
                    await router.push(link);
                }
            } else if (notification.relatedContentType && notification.relatedContentId) {
                if (notification.relatedContentType === 'listing') {
                    await router.push('/account/listings/' + notification.relatedContentId);
                }
                else if (notification.relatedContentType === 'chat') {
                    await router.push('/account/messages?activeChat=' + notification.relatedContentId);
                }
                else if (notification.relatedContentType === 'scheduled-event') {
                    await router.push('/account/calendar');
                }
                else if (notification.relatedContentType === 'offer') {
                    await router.push(`/account/listings/${notification.secondaryRelatedContentId}?listingSection=offers`);
                }
            }
            else {
                await dismissNotification(notification.id);
            }
        }
        catch (e) {
            NotificationManager.error('Error opening notification');
        }
    }

    /**
     * Clears notifications for a given piece of content
     * (eg. clear notifications for a given chat when that chat is viewed)
     * @param {string} contentType
     * @param {number | string} contentId
     * @return {Promise<void>}
     */
    async function clearNotificationsForContent(contentType: string, contentId?: number | string) {
        if (authContext.isSignedIn) {
            await ApiClient.delete('/user-notifications', {
                params: {
                    relatedContentType: contentType,
                    relatedContentId: contentId,
                },
            });
            fetchNotifications();
        }
    }

    /**
     * Gets notifications related to a given content type
     * @param {string} contentType
     */
    function getNotificationsForContentType(contentType: string) {
        return notifications.filter(notification => notification.relatedContentType === contentType);
    }

    /**
     * Gets notifications secondarily related to given content
     * (eg. offer notifications secondarily related to a listing)
     * @param {string} contentType
     * @param {string | null} contentId
     */
    function getNotificationsForSecondaryRelatedContent(contentType: string, contentId?: number) {
        return notifications.filter(notification =>
            notification.secondaryRelatedContentType === contentType
            && (contentId === undefined || notification.secondaryRelatedContentId === contentId)
        );
    }

    /**
     * Render
     */
    return (
        <NotificationsContext.Provider
            value={{
                notifications,
                hasNotifications: notifications.length > 0,
                mostRecentNotification: notifications[0],
                fetchNotifications,
                dismissNotification,
                openNotificationContent,
                clearNotificationsForContent,
                getNotificationsForContentType,
                getNotificationsForSecondaryRelatedContent,
            }}
        >
            {props.children}
        </NotificationsContext.Provider>
    );
};

export const useNotificationsContext = () => useContext(NotificationsContext);
