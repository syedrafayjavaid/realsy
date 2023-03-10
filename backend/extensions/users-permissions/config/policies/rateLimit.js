const lazyRateLimit = {
    get RateLimit() {
        return require('koa2-ratelimit').RateLimit;
    },
};

module.exports = async (ctx, next) => {
    // enable disabling rate limit by this config variable (used for test env)
    if (process.env.DISABLE_RATE_LIMITING === 'true') {
        return next();
    }


    const message = [
        {
            messages: [
                {
                    id: 'Auth.form.error.ratelimit',
                    message: 'Too many attempts, please try again in a minute.',
                },
            ],
        },
    ];
    return lazyRateLimit.RateLimit.middleware(
        Object.assign(
            {},
            {
                interval: 1 * 60 * 1000,
                max: 5,
                prefixKey: `${ctx.request.url}:${ctx.request.ip}`,
                message,
            },
            strapi.plugins['users-permissions'].config.ratelimit
        )
    )(ctx, next);
};
