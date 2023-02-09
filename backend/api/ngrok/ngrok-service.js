import ngrok from "ngrok";

/**
 * Ngrok service
 *
 * Provides functions for tunneling the app to the Internet through Ngrok.
 * (see https://ngrok.com/ for more)
 */
export const NgrokService = {
    /**
     * Initiates an Ngrok tunnel
     * @param {number} port - the port to tunnel
     * @return {Promise<string>} the URL the app is hosted at
     */
    async initiateNgrokTunnel(port) {
        return await ngrok.connect(port);
    }
};
