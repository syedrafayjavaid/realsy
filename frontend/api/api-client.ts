import axios from "axios";
import axiosBetterStacktrace from "axios-better-stacktrace";
import {ApiRoutes} from "api/api-routes";
import {getCurrentApiToken} from "api/auth/auth-functions";

/**
 * Gets an HTTP client configured for the API, authorized with the given API token
 * @param apiToken
 */
export const getApiClient = (apiToken?: string) => {
    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: apiToken && apiToken.trim() !== ''
            ? {Authorization: 'Bearer ' + apiToken}
            : {},
    });
};

/**
 * HTTP client for the API, with automatic token insertion
 */
export const ApiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// axios errors hide the original call stack, this plugin makes them visible
axiosBetterStacktrace(ApiClient);

// because each request can be made in a server-side or client-side context,
// we need to maintain the context state to know how to pull the auth token
// from it for each request
let currentContext: any = null;

/**
 * Updates the context which the API client will locate auth tokens in
 *
 * This is needed as NextJS is server-side rendered, and the current auth token can not simply be
 * pulled from browser cookies. We have to handle both SSR and CSR.
 *
 * @param newContext
 */
export function setApiClientContext(newContext: any) {
    currentContext = newContext;
}

/**
 * Registers an interceptor to add the current auth token header to all API requests
 */
ApiClient.interceptors.request.use(request => {
    // don't add auth header for auth requests
    const disableAuth = request.url === ApiRoutes.UserRegister || request.url === ApiRoutes.UserAuthenticate;

    const apiToken = getCurrentApiToken(currentContext);
    if (!disableAuth && apiToken && apiToken.trim() !== '') {
        request.headers.Authorization = 'Bearer ' + apiToken;
    }

    return request;
});
