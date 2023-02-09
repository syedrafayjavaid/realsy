/**
 * Requires a listing in a new offer
 * @param ctx
 * @param next
 * @return {Promise<void>}
 */
module.exports = async (ctx, next) => {
    if (!ctx.request.body.listing) {
        return ctx.badRequest('an offer must have an associated listing');
    }

    await next();
};
