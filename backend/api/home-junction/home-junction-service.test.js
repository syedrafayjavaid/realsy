import {HomeJunctionService} from "api/home-junction/home-junction-service";
import {initializeStrapi, teardownStrapi} from "__tests__/helpers/strapi-helpers";
import {StrapiTokenStore} from "api/token-store/strapi-token-store";

/**
 * Integration tests for the Home Junction service
 * (sends real requests to the Home Junction API)
 *
 * @group integration
 * @group home-junction
 */
describe ('Home Junction Library', () => {
    let apiUrl = process.env.HOME_JUNCTION_TEST_API_URL;
    let licenseKey = process.env.HOME_JUNCTION_TEST_LICENSE;
    /** @type HomeJunctionService */ let homeJunctionService;

    beforeAll(async () => {
        if (!apiUrl || !licenseKey) {
            throw new Error('Home Junction test credentials not supplied in environment. Set HOME_JUNCTION_TEST_API_URL and HOME_JUNCTION_TEST_LICENSE to run tests.');
        }
        await initializeStrapi();
    });

    beforeEach(() => {
        homeJunctionService = new HomeJunctionService({
            licenseKey,
            apiUrl,
        });
    });

    afterAll(() => {
        teardownStrapi();
    });

    it ('gets a home valuation', async () => {
        const response = await homeJunctionService.getHomeValue('1007 S 37th St', 'Omaha', 'NE', '68105');
        expect(response.success).toBe(true);
        expect(response.result.address.deliveryLine).toEqual('1007 S 37th St');
        expect(response.result.valuations).toBeDefined();
    });

    it ('gets a home value with override attributes', async () => {
        const response = await homeJunctionService.getHomeValue('1007 S 37th St', 'Omaha', 'NE', '68105', {
            overrideBedroomCount: 8,
            overrideBathroomCount: 5,
            overrideSize: 4001,
        });
        expect(response.result.address.deliveryLine).toEqual('1007 S 37th St');
        expect(response.result.valuations).toBeDefined();
        expect(response.result.attributes.beds).toEqual(8);
        expect(response.result.attributes.baths).toEqual(5);
        expect(response.result.attributes.size).toEqual(4001);
    });

    it ('returns an error for an invalid address', async () => {
        const response = await homeJunctionService.getHomeValue('1234 Hickory St', 'Omaha', 'NE', '68105');
        expect(response.success).toBe(false);
        expect(response.error).toBeDefined();
    });

    describe ('token persistence', () => {
        it ('persists auth tokens in the token store', async () => {
            await homeJunctionService.authenticate();
            const existingTokens = await strapi.query('api-tokens', '').findOne();
            expect(existingTokens.homeJunctionToken).toBeDefined();
            expect(existingTokens.homeJunctionToken).not.toBeNull();
        });

        it ('reuses auth tokens persisted in the token store', async () => {
            const fakeToken = 'fake-token';
            const fakeExpiration = new Date();
            fakeExpiration.setDate(fakeExpiration.getDate() + 1);

            const tokenStore = new StrapiTokenStore('homeJunctionToken', 'homeJunctionExpiration');
            await tokenStore.setToken(fakeToken, fakeExpiration);

            const service = new HomeJunctionService({tokenStore});

            let caughtError;
            try {
                await service.getHomeValue('1234 Hickory St', 'Omaha', 'NE', '68105');
            }
            catch (e) {
                caughtError = e;
            }

            // should have invalid token error
            expect(caughtError).toBeDefined();
        });
    });
});
