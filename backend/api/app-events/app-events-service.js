import {Logger} from "api/logging";
import {AppEventNotificationTypes} from "api/app-events/app-event-notification-types";
import * as emailValidator from "email-validator";
import {v4 as uuid} from 'uuid';
import {EmailService} from "api/email/email-service";
import {TextMessagingService} from "api/text-messaging/text-messaging-service";
import {AppEventCodes} from "api/app-events/app-event-codes";

const logger = Logger('app-events-service');

let _activeSubscribers = [];

/**
 * App Events service
 * Provides functions related to app events
 */
export const AppEventsService = {
    /**
     * Fires an event
     * @param {string} eventCode
     * @param data
     */
    async fire(eventCode, data) {
        logger.trace({
            message: `Firing event`,
            eventCode,
            data
        });
        const subscribers = _activeSubscribers.filter(subscriber => subscriber.eventCode === eventCode);
        for (let i = 0; i < subscribers.length; ++i) {
            await subscribers[i].callback(data);
        }
    },

    /**
     * Registers a callback to fire on event
     * @param {string} eventCode
     * @param callback
     * @return {string} the handle of the subscription
     */
    subscribe(eventCode, callback) {
        const handle = uuid();
        _activeSubscribers.push({handle, eventCode, callback});
        return handle;
    },

    /**
     * Unregisters an event callback
     * @param {string} handle
     */
    unsubscribe(handle) {
        _activeSubscribers = _activeSubscribers.filter(subscriber => (subscriber.handle !== handle));
    },

    /**
     * Sends out notifications according to the app events configured in the admin
     * @param eventCode
     * @param passedVariables
     * @return {Promise<void>}
     */
    async sendEventNotifications(eventCode, passedVariables) {
        function replaceVars(template) {
            const vars = template.match(/{{.*}}/g);
            let result = template;
            vars?.forEach(variable => {
                const variableKey = variable.replace(/{/g, '').replace(/}/g, '');
                result = result.replace(variable, passedVariables[variableKey]);
            });
            return result;
        }

        const eventConfig = await strapi.query('app-events', '').findOne({eventCode});
        for (let i = 0; i < eventConfig?.notifications?.length; ++i) {
            const notification = eventConfig.notifications[i];
            if (notification.__component === AppEventNotificationTypes.ExternalNotification) {
                const recipientEmail = notification.recipientEmail ? replaceVars(notification.recipientEmail) : undefined;
                const recipientPhone = notification.recipientPhone ? replaceVars(notification.recipientPhone) : undefined;
                const emailSubject = notification.emailSubject ? replaceVars(notification.emailSubject) : '';
                const body = replaceVars(notification.template);
                const phoneBody = notification.phoneTemplate ? replaceVars(notification.phoneTemplate) : body;

                if (emailValidator.validate(recipientEmail)) {
                    try {
                        const email = {
                            to: recipientEmail,
                            subject: emailSubject,
                        }

                        if (eventCode === AppEventCodes.NewUser) {
                            email.html = body;
                        }
                        else {
                            email.text = body;
                        }

                        await EmailService.send(email);
                    }
                    catch (e) {
                        logger.logError('Error sending email', e);
                    }
                }
                if (recipientPhone) {
                    await TextMessagingService.sendText(recipientPhone, phoneBody);
                }
            }
        }
    },
};
