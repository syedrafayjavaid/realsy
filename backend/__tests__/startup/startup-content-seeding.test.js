import {initializeStrapi, teardownStrapi} from "__tests__/helpers/strapi-helpers";

/**
 * @group integration
 * @group startup
 */
describe ('API startup', () => {
    beforeAll(async () => {
        await initializeStrapi({
            clearDatabase: true,
        });
    });

    afterAll(() => {
        teardownStrapi();
    });

    it('seeds default content on bootstrap with empty database', async () => {
        expect(await strapi.query('content-page', '').count()).toBeGreaterThan(0);
        expect(await strapi.query('app-events', '').count()).toBeGreaterThan(0);
        expect(await strapi.query('app-settings', '').count()).toBeGreaterThan(0);
        expect(await strapi.query('global-content', '').count()).toBeGreaterThan(0);
        expect(await strapi.query('micro-content-set', '').count()).toBeGreaterThan(0);
    });
});
