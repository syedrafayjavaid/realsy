import {ConfigKey} from "config/config-keys";
import {AppEventTemplateVars} from "api/app-events/app-event-template-vars";
import {AppEventCodes} from "api/app-events/app-event-codes";
import {AppEventsService} from "api/app-events/app-events-service";
import {UserNotificationService} from "api/user-notifications/user-notification-service";

export async function registerScheduledEventSubscribers() {
    /**
     * Listing visit requested
     * triggers when a new visit request is created
     */
    AppEventsService.subscribe(
        AppEventCodes.ListingVisitRequested,
        async (scheduledEvent) => {
            const listingOwner = await strapi.query('user', 'users-permissions').findOne(
                {id: scheduledEvent.listing?.owner}
            );
            await AppEventsService.sendEventNotifications(AppEventCodes.ListingVisitRequested, {
                [AppEventTemplateVars.ListerEmail]: listingOwner?.contactEmail ? listingOwner?.email : null,
                [AppEventTemplateVars.ListerPhone]: listingOwner?.contactText ? listingOwner?.phone : null,
                [AppEventTemplateVars.ListingShortAddress]: scheduledEvent.listing?.address,
                [AppEventTemplateVars.AdminLink]: `${process.env[ConfigKey.baseUrl]}/admin/plugins/content-manager/collectionType/application::scheduled-event.scheduled-event/${scheduledEvent.id}`,
            });
        }
    );

    /**
     * Scheduled event scheduled
     * triggers when a requested event (eg. visit request) is scheduled by Realsy admins
     */
    AppEventsService.subscribe(
        AppEventCodes.EventScheduled,
        async (scheduledEvent) => {
            const notificationsService = new UserNotificationService();
            await notificationsService.createUserNotification({
                userId: scheduledEvent.user?.id,
                heading: 'Your visit request has been scheduled!',
                subheading: `${scheduledEvent.listing.address} ${scheduledEvent.listing.city}`,
                relatedContentType: 'scheduled-event',
                relatedContentId: scheduledEvent.id,
            });

            const scheduledDate = new Date(scheduledEvent.datetime);
            strapi.query('user-activity-record', '').create({
                user: scheduledEvent.user,
                listing: scheduledEvent.listing,
                typeCode: 'scheduled-event-scheduled',
                title: 'Your visit request has been scheduled!',
                subheading: `${scheduledEvent.listing.address} ${scheduledEvent.listing.city}`,
                body: `You're scheduled to view this listing on ${scheduledDate.toLocaleDateString()} at ${scheduledDate.toLocaleTimeString()}`,
                iconUrl: '/icon-house-white.svg',
                link: `/account/calendar`,
                seen: false
            });

            await AppEventsService.sendEventNotifications(AppEventCodes.EventScheduled, {
                [AppEventTemplateVars.OwnerEmail]: scheduledEvent.user?.contactEmail ? scheduledEvent.user.email : null,
                [AppEventTemplateVars.OwnerPhone]: scheduledEvent.user?.contactText ? scheduledEvent.user.phone : null,
                [AppEventTemplateVars.CalendarLink]: `${strapi.config.get('custom.' + ConfigKey.frontendUrl)}/account/calendar`,
            });
        }
    );
}
