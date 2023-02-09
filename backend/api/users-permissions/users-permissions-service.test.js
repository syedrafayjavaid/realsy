import {initializeStrapi, teardownStrapi} from "__tests__/helpers/strapi-helpers";
import {UsersPermissionsService} from "api/users-permissions/users-permissions-service";
import faker from 'faker';

/**
 * @group integration
 */
describe ('Users-Permissions Service', () => {
    beforeAll(async () => {
        await initializeStrapi();
    })

    afterAll(() => {
        teardownStrapi();
    });

    it ('creates an admin account', async () => {
        const testEmail = faker.internet.email();
        const testPassword = faker.internet.password();

        const createdAdmin = await UsersPermissionsService.createAdminUser(testEmail, testPassword);

        expect(createdAdmin.email).toEqual(testEmail);
        expect(createdAdmin.roles[0].id).toEqual((await strapi.admin.services.role.getSuperAdmin()).id);
    });

    it ('gets a role by name', async () => {
        const testRoleName = 'Authenticated';
        const result = await UsersPermissionsService.getRoleByName(testRoleName);
        expect(result.id).toBeDefined();
        expect(result.name).toEqual(testRoleName);
    });

    it ('enables a permission for a role', async () => {
        const testPermission = await strapi.query('permission', 'users-permissions').findOne({enabled: false});
        const updateResult = await UsersPermissionsService.enablePermissions(
            1,
            testPermission.controller,
            testPermission.action,
            testPermission.type
        );
        expect(updateResult.id).toEqual(testPermission.id);
        expect(updateResult.enabled).toEqual(true);
    });
});
