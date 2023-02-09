import faker from 'faker';
import axios from "axios";
import {ApiClient} from "api/api-client";

/**
 * Helper functions for creating/accessing users during tests
 */

/**
 * Registers a new user
 * @param email
 * @param password
 * @returns {Promise<{success: boolean}>}
 */
export async function registerUser(email, password) {
    try {
        const registerResponse = await axios.post(ApiClient.defaults.baseURL + '/auth/local/register', {
            username: email,
            email,
            password,
        });

        const registerResult = registerResponse.data;

        if (registerResult.jwt) {
            return {
                success: true,
                jwt: registerResult.jwt,
                user: registerResult.user,
                registerResult
            }
        }
    }
    catch (e) {
        const registerResult = e.response.data;
        return {
            success: false,
            userExists: registerResult?.message?.length && registerResult.message[0]?.messages?.length && registerResult.message[0]?.messages[0]?.id === 'Auth.form.error.email.taken',
            registerResult,
        };
    }
}

/**
 * Gets an API token for testing authenticated requests
 * Creates user if needed, authenticates otherwise
 * @returns {Promise<string>}
 */
export async function getApiToken(givenUsername = null, givenPassword = null) {
    const username = givenUsername ?? faker.internet.email();
    const password = givenPassword ?? faker.internet.password();
    const registerResult = await registerUser(username, password);
    return registerResult.jwt;
}

/**
 * Gets the user authenticated with the given API token
 * @param apiToken
 * @returns {Promise<any>}
 */
export async function getAuthenticatedUser(apiToken) {
    return await getAuthenticatedUser(apiToken);
}
