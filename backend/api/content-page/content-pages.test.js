import {initializeStrapi, teardownStrapi} from "__tests__/helpers/strapi-helpers";
import request from 'supertest';

/**
 * @group integration
 */
describe ('Content Pages Feature Tests', () => {
    beforeAll(async () => {
        await initializeStrapi();
    });

    afterAll(() => {
        teardownStrapi();
    });

    it ('provides single content pages by slug', async () => {
        const testPage = await strapi.query('content-page', '').create({
            slug: 'test-page',
        });

        const response = await request(strapi.server)
            .get('/content-page/test-page')
            .expect(200);

        expect(response.body.id).toEqual(testPage.id);
    });

    it ('responds with 404 if a non-existent content page slug is requested', async () => {
        await request(strapi.server)
            .get('/content-page/this-page-does-not-exist-12341234987134')
            .expect(404);
    });
});
