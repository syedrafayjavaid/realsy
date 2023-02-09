/**
 * Stores a token in process memory
 */
export class MemoryTokenStore {
    constructor() {
        this.token = null;
        this.expiration = new Date();
    }

    /**
     * @param {string} newToken
     * @param {Date} expiration - the expiration timestamp in milliseconds
     */
    async setToken(newToken, expiration) {
        this.token = newToken;
        this.expiration = expiration;
    }

    /**
     * @returns {string | null}
     */
    async getToken() {
        if (await this.isTokenExpired()) {
            return null;
        }
        else {
            return this.token;
        }
    }

    /**
     * @param {number} expirationOffset - Consider token expired if expiring with the given number of seconds
     * @return {boolean}
     */
    async isTokenExpired(expirationOffset = 0) {
        const cutoffDate = new Date();
        cutoffDate.setSeconds(cutoffDate.getSeconds() + (expirationOffset));
        return this.expiration <= cutoffDate;
    }
}
