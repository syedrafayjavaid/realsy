/**
 * Restricts access to resource based on user involvement
 */
module.exports = async (ctx, next) => {
    await next();

    const userIsInvolved = ctx.response.body.owner.id === ctx.state.user.id
        || ctx.response.body.usersInvolved.some(user => user.id === ctx.state.user.id);

    if (!userIsInvolved) {
        return ctx.forbidden("You are not allowed to perform this action.");
    }
};
