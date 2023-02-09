/**
 * `setOfferor` policy.
 * Sets the offeror of a new offer to the authenticated user
 */

module.exports = async (ctx, next) => {
    const body = ctx.request.body;
    body.offeror = ctx.state.user.id;
    ctx.request.body = body;
    await next();
};
