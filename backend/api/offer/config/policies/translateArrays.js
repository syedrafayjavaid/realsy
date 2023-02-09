/**
 * `translateArrays` policy.
 * Translates plain-text arrays into the strapi-component format
 *
 * Strapi stores "arrays" as repeatable components, which must be formatted as:
 * [{body: 'text'}, {body: 'text'}, ...]
 *
 * To simplify the client, we allow plain arrays to be passed in and translate them here
 */

module.exports = async (ctx, next) => {
    const body = ctx.request.body;

    const itemsIncluded = body.itemsIncluded?.splice(0) ?? [];
    const includedInspections = body.includedInspections?.splice(0) ?? [];
    const preferredCompanies = body.preferredCompanies?.splice(0) ?? [];
    body.itemsIncluded = itemsIncluded.map(item => {return {body: item}});
    body.includedInspections = includedInspections.map(item => {return {body: item}});
    body.preferredCompanies = preferredCompanies.map(item => {return {body: item}});

    ctx.request.body = body;
    await next();
};
