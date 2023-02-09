import axios from "axios";
import axiosBetterStacktrace from "axios-better-stacktrace";

/**
 * HTTP client for the headless CMS
 *
 * Currently, the CMS and API are provided by the same backend service
 * but because they are distinct concepts and have unique requirements (eg. token handling for the API client)
 * they are split into separate modules
 */
export const CmsClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_CMS_URL,
});

// axios errors hide the original call stack, this plugin makes them visible
axiosBetterStacktrace(CmsClient);
