import faker from 'faker';

/**
 * Creates a user for use in tests (eg. to set as the owner of a listing)
 *
 * Email and password can be set manually, or left null for random values.
 * A role can be provided, or the default role will be assigned.
 *
 * @param givenEmail
 * @param givenPassword
 * @param role
 * @return {Promise<*>}
 */
export async function createTestUser(givenEmail = null, givenPassword = null, role = null) {
    const email = givenEmail ?? faker.internet.email();
    const defaultRole = await strapi.query('role', 'users-permissions').findOne({}, []);

    return await strapi.plugins['users-permissions'].services.user.add({
        email,
        username: email,
        password: givenPassword ?? faker.internet.password(),
        provider: 'local',
        role: defaultRole?.id,
        confirmed: true,
        blocked: null,
    });
}

/**
 * Creates an admin user for testing
 * @param givenEmail
 * @param givenPassword
 * @return {Promise<*>}
 */
export async function createTestAdmin(givenEmail = null, givenPassword = null) {
    return await strapi.query('user', 'admin').create({
        email: givenEmail ?? faker.internet.email(),
        password: await strapi.admin.services.auth.hashPassword(givenPassword ?? faker.internet.password()),
        roles: [await strapi.admin.services.role.getSuperAdmin()._id]
    });
}

/**
 * Generates an auth token for a given user ID
 * @param userId
 */
export async function getTokenForUserId(userId) {
    return strapi.plugins['users-permissions'].services.jwt.issue({id: userId});
}
