/**
 * Sets the resources owner, to then be used by an 'isOwner' policy for access rights
 */
module.exports = async (ctx, next) => {
    const {body} = ctx.request;
    if (body.data) {
        const data = JSON.parse(body.data);
        data.owner = ctx.state.user.id;
        body.data = JSON.stringify(data);
    } else {
        body.owner = ctx.state.user.id;
    }
    await next();
};
