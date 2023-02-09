/**
 * Restricts access to resource based on user ownership
 */
module.exports = async (ctx, next) => {
    const notification = await strapi.query('user-notifications', '').findOne({
        id: ctx.params.id,
    });

    if (ctx.state.user.id !== notification.user.id) {
        return ctx.forbidden("You are not allowed to perform this action.");
    }

    await next();
};
