import {initializeStrapi, teardownStrapi} from "__tests__/helpers/strapi-helpers";
import faker from 'faker';

/**
 * @group integration
 * @group startup
 */
describe ('API startup', () => {
    const testEmail = faker.internet.email();

    beforeAll(async () => {
        process.env.SEED_ADMIN_EMAIL = testEmail;
        await initializeStrapi({
            clearDatabase: true,
        });
    });

    afterAll(() => {
        teardownStrapi();
    });

    it ('seeds admin account if none exist and one is configured in the environment', async () => {
        const admins = await strapi.query('user', 'admin').find();
        expect(admins.length).toEqual(1);
        expect(admins[0].email).toEqual(testEmail);
        expect(admins[0].isActive).toEqual(true);
        expect(admins[0].blocked).toEqual(false);
        teardownStrapi();
    }, 20000);
});
