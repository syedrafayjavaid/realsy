import axios from 'axios';
import {
    HOME_JUNCTION_AUTH_ENDPOINT,
    HOME_JUNCTION_AUTH_HEADER_KEY,
} from "api/home-junction/constants";
import {StrapiTokenStore} from "api/token-store/strapi-token-store";

/**
 * Provides an interface to the Home Junction API
 */
export class HomeJunctionService {
    /**
     * @param {string} licenseKey
     * @param {string} apiUrl
     * @param tokenStore
     * @param httpClient
     */
    constructor({
        licenseKey = process.env.HOME_JUNCTION_TEST_LICENSE || process.env.HOME_JUNCTION_LICENSE,
        apiUrl = process.env.HOME_JUNCTION_TEST_API_URL || process.env.HOME_JUNCTION_API_URL,
        tokenStore = new StrapiTokenStore('homeJunctionToken', 'homeJunctionExpiration'),
        httpClient = axios.create(),
    } = {}) {
        this.licenseKey = licenseKey;
        this.tokenStore = tokenStore;
        this.httpClient = httpClient;
        this.httpClient.defaults.baseURL = apiUrl;
        this.httpClient.interceptors.request.use(this.requestAuthInterceptor.bind(this));
    }

    /**
     * Authenticates with the HomeJunction API prior to a request if not yet authenticated or token is expired
     * @param request
     * @return {Promise<void>}
     */
    async requestAuthInterceptor(request) {
        // skip adding auth if the request is for authenticating
        if (request.url === HOME_JUNCTION_AUTH_ENDPOINT) {
            return request;
        }

        let token = await this.tokenStore.getToken();
        if (!token) {
            token = await this.authenticate();
        }

        request.headers[HOME_JUNCTION_AUTH_HEADER_KEY] = token;

        return request;
    }

    /**
     * Authenticates with the Home Junction API
     * @returns {Promise<string>} the new token
     */
    async authenticate() {
        const response = await this.httpClient.get(HOME_JUNCTION_AUTH_ENDPOINT, {
            params: {license: this.licenseKey}
        });

        // need to start at epoch to set seconds relative to it
        const expiration = new Date(1970, 0, 1);
        expiration.setSeconds(response.data.result?.expires);

        await this.tokenStore.setToken(response.data.result?.token, expiration);
        this.httpClient.defaults.headers = {
            [HOME_JUNCTION_AUTH_HEADER_KEY]: response.data.result?.token
        };

        return response.data.result?.token;
    }

    /**
     * Gets a home value
     * @param deliveryLine
     * @param city
     * @param state
     * @param zipCode
     * @param overrideBedroomCount
     * @param overrideBathroomCount
     * @param overrideSize
     * @returns {Promise<HomeJunctionValuationResponse>}
     */
    async getHomeValue(
        deliveryLine,
        city,
        state,
        zipCode,
        {overrideBedroomCount, overrideBathroomCount, overrideSize} = {}
    ) {
        const response = await this.httpClient.get('/avm', {
            params: {
                deliveryLine,
                city,
                state,
                zip: zipCode,
                beds: overrideBedroomCount,
                baths: overrideBathroomCount,
                size: overrideSize,
            },
        });
        return response.data;
    }
}
