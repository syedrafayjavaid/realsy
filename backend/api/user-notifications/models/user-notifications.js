/**
 * User Notification model
 * Adds lifecycle hooks
 */
module.exports = {
    lifecycles: {
        async afterCreate(result) {
            // we don't want multiple notifications on the same content
            // (eg. two notifications for new messages on the same chat)
            // so we delete them here
            if (result.relatedContentType && result.relatedContentId) {
                await strapi.query('user-notifications', '').delete({
                    id_ne: result.id,
                    user: result.user.id,
                    relatedContentType: result.relatedContentType,
                    relatedContentId: result.relatedContentId,
                });
            }
        },
    },
};
