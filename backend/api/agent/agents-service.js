/**
 * Agents service
 * Provides functions related to agents
 */
export const AgentsService = {
    /**
     * Gets the default agent to assign to new listings
     * @returns {Promise<Object>}
     */
    async getDefaultAgent() {
        const appSettings = await strapi.query('app-settings', '').findOne(
            {},
            ['defaultAgent', 'defaultAgent.photo']
        );
        return appSettings.defaultAgent;
    },

    /**
     * Gets a given agent's main photo URL
     * @param agentId
     * @param format
     * @returns {Promise<string>}
     */
    async getAgentMainPhotoUrl(agentId, {format} = {format: 'thumbnail'}) {
        let agent = await strapi.query('agent', '').findOne({id: agentId});
        if (!agent) {
            agent = await AgentsService.getDefault();
        }
        return agent.photo?.formats?.[format]?.url || agent.photo?.url;
    },
};
