import NextCookies from "next-cookies";
import Cookie from "js-cookie";
import {NextPageContext} from "next";
import {TOKEN_COOKIE_NAME} from "api/auth/auth-config";
import jwtDecode from "jwt-decode";
import axios from "axios";
import {ApiRoutes} from "api/api-routes";

/**
 * Stores the client's API token
 * (we store the token in cookies to allow both server-side and client-side rendering)
 */
export function storeApiToken(token: string) {
    return Cookie.set(TOKEN_COOKIE_NAME, token);
}

/**
 * Gets the current API token for the authenticated user
 *
 * This will handle both server-side an client-side cases. If the context parameter is supplied,
 * the token will be pulled from the server context cookies. Otherwise the client-side token will
 * be used.
 *
 * @param context
 * @returns string | undefined
 */
export function getCurrentApiToken(context?: NextPageContext): string | undefined {
    return context
        ? NextCookies(context)[TOKEN_COOKIE_NAME]
        : Cookie.get(TOKEN_COOKIE_NAME);
}

/**
 * Gets the ID of the currently authenticated user
 * @param context
 * @returns number | undefined
 */
export function getCurrentUserId(context?: NextPageContext): number | undefined {
    const token = getCurrentApiToken(context);
    return token
        ? (jwtDecode(token) as any).id
        : undefined;
}

/**
 * Authenticates a user against the API
 * @param email
 * @param password
 * @returns {Promise<{success: boolean}>}
 */
export async function authenticateUser(email: string, password: string) {
    const authResponse = await axios.post(ApiRoutes.BaseUrl + ApiRoutes.UserAuthenticate, {
        identifier: email,
        password,
    });

    const authResult = authResponse.data;

    if (!authResult.jwt) {
        return {
            success: false,
            authResult
        };
    } else {
        return {
            success: true,
            jwt: authResult.jwt,
            user: authResult.user
        }
    }
}
