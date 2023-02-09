/**
 * A role-based permission for a Strapi controller/action combo
 *
 * @typedef {Object} StrapiPermission
 *
 * @property {number} id
 * @property {string} type - 'application' for app permissions, or plugin name for plugin permissions
 * @property {string} controller - name of the controller the permission applies to
 * @property {string} action - the name of the method in the controller (LOWERCASED, eg. findAll becomes findall)
 * @property {boolean} enabled
 * @property {UserRole} role
 */
