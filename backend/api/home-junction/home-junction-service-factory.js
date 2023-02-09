import {HomeJunctionService} from "api/home-junction/home-junction-service";
import {MockHomeJunctionService} from "api/home-junction/mock-home-junction-service";

export const MOCK_HOME_JUNCTION_CONFIG_KEY = 'MOCK_HOME_JUNCTION_API';

/**
 * Creates Home Junction services, with option to mock the service for testing
 */
export class HomeJunctionServiceFactory {
    /**
     * Gets either a Home Junction Service or a mock of that service depending on environment config
     * @param {string} licenseKey
     * @param {string} [apiUrl]
     * @param tokenStore
     * @param httpClient
     * @return {HomeJunctionService|MockHomeJunctionService}
     */
    getServiceForEnv({
        licenseKey = undefined,
        apiUrl = undefined,
        tokenStore = undefined,
        httpClient = undefined,
    } = {}) {
        if (process.env[MOCK_HOME_JUNCTION_CONFIG_KEY] === 'true') {
            return new MockHomeJunctionService();
        }
        else {
            return new HomeJunctionService({
                licenseKey,
                apiUrl,
                tokenStore,
                httpClient,
            });
        }
    }
}
