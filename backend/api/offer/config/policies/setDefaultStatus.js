/**
 * `setDefaultStatus` policy.
 * Sets the status to the default for the environment configuration
 */
module.exports = async (ctx, next) => {
    const body = ctx.request.body;

    body.status = process.env.DEFAULT_OFFER_STATUS ?? 'pending_realsy';

    ctx.request.body = body;
    await next();
};
