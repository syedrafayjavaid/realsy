/**
 * `isOwner` policy.
 * Restricts access to resource based on user ownership
 */
module.exports = async (ctx, next) => {
    const { role, id } = ctx.state.user;
    const fieldId = ctx.params.id;

    if (typeof fieldId !== "undefined") {
        const listing = await strapi.query('listing').findOne({id: fieldId});
        if (role.type !== 'programmatic_access' && listing.owner?.id !== id) {
            return ctx.unauthorized("You are not allowed to perform this action.");
        }
    }

    await next();
};
