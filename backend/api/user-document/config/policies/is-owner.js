/**
 * Restricts access to resource based on user ownership
 */
module.exports = async (ctx, next) => {
    await next();

    if (ctx.response.body.owner.id !== ctx.state.user.id) {
        return ctx.forbidden("You are not allowed to perform this action.");
    }
};
