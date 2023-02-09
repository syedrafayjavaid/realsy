/**
 * `setOwner` policy.
 * Sets the resources owner, to then be used by an 'isOwner' policy for access rights
 */
module.exports = async (ctx, next) => {
    const { body } = ctx.request;
    if (!ctx.request.body.externalId && !ctx.state.user.canListExternal) {
        body.owner = ctx.state.user.id;
    }
    await next();
};
