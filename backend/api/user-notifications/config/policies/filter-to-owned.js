/**
 * Filters a get request to notifications for the authenticated user
 */
module.exports = async (ctx, next) => {
    ctx.query.user = ctx.state.user.id;
    await next();
}
