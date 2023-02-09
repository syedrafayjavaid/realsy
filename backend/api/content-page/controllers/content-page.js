/**
 * Content Pages controller
 * provides additional actions related to content pages
 */
module.exports = {
    /**
     * Responds with a single content page with the slug given in the "slug" route param
     * @param {import("koa").Context} ctx
     * @return {Promise<*>}
     */
    async findBySlug(ctx) {
        return await strapi.query('content-page', '').findOne({
            slug: ctx.params.slug,
        });
    },
};
