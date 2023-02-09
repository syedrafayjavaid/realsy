/**
 * Activity records controller
 * Provides extra actions related to user activity records
 */
module.exports = {
    /**
     * Gets all of the authenticated user's activity records
     */
    async mine(ctx) {
        const records = await strapi.query('user-activity-record', '').find({
            user: ctx.state.user.id,
            _sort: 'created_at:desc',
            _limit: 10
        });
        return ctx.send(records);
    },

    /**
     * Gets the authenticated user's recent activity records
     */
    async findMine(ctx) {
        const records = await strapi.query('user-activity-record', '').find({
            user: ctx.state.user.id,
            created_at_gte: new Date().getUTCDate(),
        });
        return ctx.send(records);
    },

    /**
     * Checks if the authenticated user has unseen records
     */
    async checkNew(ctx) {
        const records = await strapi.query('user-activity-record', '').find({
            user: ctx.state.user.id,
            seen: false,
        });
        return ctx.send(records);
    },

    /**
     * Marks a record seen by user
     */
    async markSeen(ctx) {
        const result = await strapi.query('user-activity-record', '').update({
            user: ctx.state.user.id,
            id: ctx.request.body.recordId,
        },{
            seenAt: new Date(),
            seen: true
        });
        return ctx.send(result);
    }
};
