/**
 * Generates webhook URLs relative to server base URL, accounting for Ngrok tunnel if in use
 */
export const WebhookService = {
    generateWebhookUrl: (route) => {
        return typeof strapi !== "undefined"
            ? strapi.config.get('webhookBaseUrl') ?? strapi.config.get('server.url')
            : process.env.BASE_URL + route;
    }
};
