import ellipsize from 'ellipsize';
import {Logger} from "api/logging";
import {ConfigKey} from "config/config-keys";
import {AppEventTemplateVars} from "api/app-events/app-event-template-vars";
import {AppEventCodes} from "api/app-events/app-event-codes";
import {AppEventsService} from "api/app-events/app-events-service";
import {UserNotificationService} from "api/user-notifications/user-notification-service";

const logger = Logger('chat-event-subscriber');

export async function registerChatSubscribers() {
    AppEventsService.subscribe(AppEventCodes.NewChatMessage, async chat => {
        logger.trace({
            message: 'Handling new chat message event',
            chat,
        });

        const message = chat.messages[chat.messages.length - 1];
        const receivingUserIndex = chat.users[0].id === message.user.id ? 1 : 0;
        const receivingUser = chat.users[receivingUserIndex];
        const sendingUser = receivingUserIndex === 0 ? chat.users[1] : chat.users[0];
        const sendingUserName = sendingUser.name || sendingUser.email;

        let linkUrl = '';
        if (chat.listing) {
            linkUrl = receivingUser.id === chat.listing?.owner
                ? `/account/listings/${chat.listing?.id}?listingSection=messages&user=${sendingUser.id}`
                : `/account/dashboard?viewedListingId=${chat.listing?.id}&listingSection=messages`;
        }

        const notificationService = new UserNotificationService();
        await notificationService.createUserNotification({
            userId: receivingUser.id,
            heading: `Message from ${sendingUserName}`,
            subheading: `"${ellipsize(message.body, 50)}"`,
            relatedContentType: 'chat',
            relatedContentId: chat.key,
            secondaryRelatedContentType: 'listing',
            secondaryRelatedContentId: chat.listing?.id,
        });
        strapi.query('user-activity-record', '').create({
            user: receivingUser.id,
            title: `Message from ${sendingUserName}`,
            link: linkUrl,
            listing: chat.listing,
            body: ellipsize(message.body, 50),
            typeCode: 'chat',
            seen: false,
            extra: {
                senderId: sendingUser.id,
                senderName: sendingUserName,
                messageBody: message.body,
            },
        });

        await AppEventsService.sendEventNotifications(AppEventCodes.NewChatMessage, {
            [AppEventTemplateVars.RecipientEmail]: receivingUser?.contactEmail ? receivingUser.email : null,
            [AppEventTemplateVars.RecipientPhone]: receivingUser?.contactText ? receivingUser.phone : null,
            [AppEventTemplateVars.SenderName]: sendingUserName,
            [AppEventTemplateVars.ChatLink]: strapi.config.get('custom.' + ConfigKey.frontendUrl) + linkUrl,
            [AppEventTemplateVars.Message]: message.body,
            [AppEventTemplateVars.LengthConstrainedMessage]: ellipsize(message.body, 64),
        });
    });
}
