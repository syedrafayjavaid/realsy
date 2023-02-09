/**
 * Filters returned user documents to only those involving the requesting user
 */
module.exports = async (ctx, next) => {
    await next();

    ctx.response.body = !ctx.response.body.filter
        ? ctx.response.body
        : ctx.response.body.filter(document => {
            return document.owner?.id === ctx.state.user.id
                || document.usersInvolved.some(user => user.id === ctx.state.user.id)
        });
};
