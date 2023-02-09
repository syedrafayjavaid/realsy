import {UserNotificationService} from "api/user-notifications/user-notification-service";

/**
 * User Notifications controller
 * Provides additional actions related to user notifications
 */
module.exports = {
    /**
     * Deletes multiple of the authenticated user's notifications, optionally related to given content type and content
     * @param ctx
     * @return {Promise<UserNotification[]|*>}
     */
    async deleteMany(ctx) {
        const userId = ctx.state.user.id;
        const {relatedContentType, relatedContentId} = ctx.query;
        const service = new UserNotificationService();
        return await service.deleteNotificationsForUser({
            userId,
            relatedContentType,
            relatedContentId,
        });
    }
};
