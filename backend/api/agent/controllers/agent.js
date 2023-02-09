import {AgentsService} from "api/agent/agents-service";

/**
 * Agents controller
 * Provides extra actions related to agents
 */
module.exports = {
    /**
     * Gets the default agent to assign to new listings
     */
    async getDefault(ctx) {
        return ctx.send(await AgentsService.getDefaultAgent());
    },

    /**
     * Redirects to the URL of an agent's main photo
     *
     * This is distinct from returning the URL (as a string), as as image src attribute can be set
     * to this endpoint, and will redirect to the actual image data
     *
     * @param ctx
     * @returns {Promise<void>}
     */
    async getMainPhoto(ctx) {
        const agentId = ctx.params.id;
        const format = ctx.request.query.format || 'thumbnail';
        const photoUrl = await AgentsService.getAgentMainPhotoUrl(agentId, {format});
        return ctx.redirect(photoUrl);
    }
};
