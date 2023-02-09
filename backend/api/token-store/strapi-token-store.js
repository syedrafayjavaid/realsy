/**
 * Persists a token in the Strapi database
 */
export class StrapiTokenStore {
    /**
     * @param {string} tokenFieldName
     * @param {string} tokenExpirationFieldName
     */
    constructor(tokenFieldName, tokenExpirationFieldName) {
        this.tokenFieldName = tokenFieldName;
        this.tokenExpirationFieldName = tokenExpirationFieldName;
    }

    /**
     * @param {string} newToken
     * @param {Date} expiration - the expiration timestamp in milliseconds
     */
    async setToken(newToken, expiration) {
        const existingTokens = await strapi.query('api-tokens', '').findOne();
        if (existingTokens) {
            await strapi.query('api-tokens', '').update({}, {
                [this.tokenFieldName]: newToken,
                [this.tokenExpirationFieldName]: expiration,
            });
        }
        else {
            await strapi.query('api-tokens', '').create({
                [this.tokenFieldName]: newToken,
                [this.tokenExpirationFieldName]: expiration,
            });
        }
    }

    /**
     * @returns {string | null}
     */
    async getToken() {
        if (await this.isTokenExpired()) {
            return null;
        }
        else {
            const tokens = await strapi.query('api-tokens', '').findOne();
            return tokens[this.tokenFieldName];
        }
    }

    /**
     * @param {number} expirationOffset - Consider token expired if expiring with the given number of seconds
     * @return {boolean}
     */
    async isTokenExpired(expirationOffset = 0) {
        const tokens = await strapi.query('api-tokens', '').findOne();
        if (!tokens) {
            return true;
        }

        const cutoffDate = new Date();
        cutoffDate.setSeconds(cutoffDate.getSeconds() + (expirationOffset));
        return new Date(tokens[this.tokenExpirationFieldName]) <= cutoffDate;
    }
}
