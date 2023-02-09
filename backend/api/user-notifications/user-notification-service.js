/**
 * Provides functions related to user notifications
 */
export class UserNotificationService {
    /**
     * @param crudRepository - the base strapi repository, or a mock
     */
    constructor({
        crudRepository = null,
    } = {}) {
        this.crudRepository = crudRepository ?? strapi.query('user-notifications', '');
    }

    /**
     * Gets notifications for the given user
     * @param {number} userId
     * @param relatedContentType
     * @param relatedContentId
     * @param secondaryRelatedContentType
     * @param secondaryRelatedContentId
     * @return {Promise<UserNotification[]>}
     */
    async getUserNotifications({
        userId,
        relatedContentType = undefined,
        relatedContentId = undefined,
        secondaryRelatedContentType = undefined,
        secondaryRelatedContentId = undefined,
    }) {
        return await this.crudRepository.find({
            user: userId,
            relatedContentType,
            relatedContentId,
            secondaryRelatedContentType,
            secondaryRelatedContentId,
        });
    }

    /**
     * Creates a new user notification
     * @param userId
     * @param heading
     * @param subheading
     * @param body
     * @param relatedContentType
     * @param relatedContentId
     * @param secondaryRelatedContentType
     * @param secondaryRelatedContentId
     * @param link
     * @return {Promise<UserNotification>}
     */
    async createUserNotification({
        userId,
        heading,
        subheading,
        body,
        relatedContentType = null,
        relatedContentId = null,
        secondaryRelatedContentType = null,
        secondaryRelatedContentId = null,
        link = null,
    }) {
        return await this.crudRepository.create({
            user: userId,
            heading,
            subheading,
            body,
            relatedContentType,
            relatedContentId,
            secondaryRelatedContentId,
            secondaryRelatedContentType,
            link,
        });
    }

    /**
     * Clears notifications for a given user and related content
     * @param userId
     * @param relatedContentType
     * @param relatedContentId
     * @return {Promise<UserNotification[]>}
     */
    async deleteNotificationsForUser({userId, relatedContentType, relatedContentId = undefined}) {
        const deleteParams = {
            user: userId,
            relatedContentType,
        };
        if (relatedContentId) {
            deleteParams.relatedContentId = relatedContentId;
        }
        return await this.crudRepository.delete(deleteParams);
    }
}
