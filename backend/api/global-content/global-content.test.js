import request from 'supertest';
import {initializeStrapi, teardownStrapi} from "__tests__/helpers/strapi-helpers";

/**
 * @group integration
 */
describe ('Global Content Feature Tests', () => {
    beforeAll(async () => {
        await initializeStrapi();
    });

    afterAll(() => {
        teardownStrapi();
    });

    it ('provides the global content as configured in the database', async () => {
        const testChatButtonText = 'Fake text!';

        await strapi.query('global-content', '').update({}, {
            chatButtonText: testChatButtonText,
        });

        const response = await request(strapi.server)
            .get('/global-content')
            .expect(200);

        expect(response.body.chatButtonText).toEqual(testChatButtonText);
    });
});
