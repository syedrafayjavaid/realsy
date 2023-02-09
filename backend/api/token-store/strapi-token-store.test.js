import {initializeStrapi, teardownStrapi} from "__tests__/helpers/strapi-helpers";
import {StrapiTokenStore} from "api/token-store/strapi-token-store";

/**
 * @group integration
 */
describe ('Strapi Token Store', () => {
    beforeAll(async () => {
        await initializeStrapi();
    });

    afterAll(() => {
        teardownStrapi();
    });

    it ('persists a token in the strapi database', async () => {
        const tokenFieldName = 'homeJunctionToken';
        const expirationFieldName = 'homeJunctionExpiration';
        const store = new StrapiTokenStore(tokenFieldName, expirationFieldName);
        const fakeExpiration = new Date();
        fakeExpiration.setDate(fakeExpiration.getDate() + 1);

        await store.setToken('fake-token', fakeExpiration);

        const existingTokens = await strapi.query('api-tokens', '').findOne();
        expect(existingTokens[tokenFieldName]).toEqual('fake-token');
    });

    it ('gets the persisted token', async () => {
        const fakeToken = 'fake-token';
        const fakeExpiration = new Date();
        fakeExpiration.setDate(fakeExpiration.getDate() + 1);
        const tokenFieldName = 'homeJunctionToken';
        const expirationFieldName = 'homeJunctionExpiration';

        const existingTokens = await strapi.query('api-tokens', '').findOne();
        if (existingTokens) {
            await strapi.query('api-tokens', '').update({}, {
                [tokenFieldName]: fakeToken,
                [expirationFieldName]: fakeExpiration,
            });
        }
        else {
            await strapi.query('api-tokens', '').create({
                [tokenFieldName]: fakeToken,
                [expirationFieldName]: fakeExpiration,
            });
        }

        const store = new StrapiTokenStore(tokenFieldName, expirationFieldName);
        const result = await store.getToken();

        expect(result).toEqual(fakeToken);
    });

    it ('determines token expiration with a given offset', async () => {
        const expiration = new Date();
        expiration.setHours(expiration.getHours() - 1);

        const store = new StrapiTokenStore('homeJunctionToken', 'homeJunctionExpiration');
        await store.setToken('test-token', expiration);

        expect(await store.isTokenExpired(60*60)).toBe(true);
    });

    it ('returns null if the persisted token is expired', async () => {
        const fakeToken = 'fake-token';
        const fakeExpiration = new Date();
        fakeExpiration.setDate(fakeExpiration.getDate() - 1);
        const tokenFieldName = 'homeJunctionToken';
        const expirationFieldName = 'homeJunctionExpiration';

        const existingTokens = await strapi.query('api-tokens', '').findOne();
        if (existingTokens) {
            await strapi.query('api-tokens', '').update({}, {
                [tokenFieldName]: fakeToken,
                [expirationFieldName]: fakeExpiration,
            });
        }
        else {
            await strapi.query('api-tokens', '').create({
                [tokenFieldName]: fakeToken,
                [expirationFieldName]: fakeExpiration,
            });
        }

        const store = new StrapiTokenStore(tokenFieldName, expirationFieldName);
        const result = await store.getToken();

        expect(result).toBeNull();
    });
});
