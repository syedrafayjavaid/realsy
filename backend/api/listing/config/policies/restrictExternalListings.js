/**
 * restrictExternalListings policy.
 * Restricts posting external listings if user is not flagged to have rights to do so.
 */
module.exports = async (ctx, next) => {
    if (ctx.request.body.externalId && !ctx.state.user.canListExternal) {
        return ctx.unauthorized('This user is not allowed to post external listings');
    }
    await next();
};
