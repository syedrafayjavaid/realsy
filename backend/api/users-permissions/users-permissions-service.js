/**
 * Provides functions to interact with the Strapi users-permissions system
 * (eg. to create an admin account programmatically)
 */
export const UsersPermissionsService = {
    /**
     * Creates a new admin user
     *
     * @param {string} email
     * @param {string} password
     * @return {Promise<AdminUser>} The new admin user
     */
    async createAdminUser(email, password) {
        // at first init (after first database creation), strapi roles aren't created yet, so create them if needed
        await strapi.admin.services.role.createRolesIfNoneExist();

        const adminRole = await strapi.admin.services.role.getSuperAdmin();
        const passwordHash = await strapi.admin.services.auth.hashPassword(password);
        return await strapi.query('user', 'admin').create({
            email,
            password: passwordHash,
            roles: [adminRole],
            isActive: true,
            blocked: false,
        });
    },

    /**
     * Gets a Strapi role by name
     * @param {string} name
     * @return {Promise<UserRole>}
     */
    async getRoleByName(name) {
        return await strapi.query('role', 'users-permissions').findOne({name}, []);
    },

    /**
     * Enables a permission by role, plugin, controller and action
     * @param {number} roleId
     * @param {string} controller
     * @param {string} action
     * @param {string} type - Either a plugin name (eg. "upload") or "application" for non-plugin permissions
     * @return {Promise<StrapiPermission>}
     */
    async enablePermissions(roleId, controller, action, type = 'application') {
        return await strapi.query('permission', 'users-permissions').update(
            {
                role: roleId,
                type,
                controller,
                action,
            },
            {enabled: true}
        );
    },
};
