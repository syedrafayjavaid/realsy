/**
 * `setDefaultStatus` policy.
 * Sets the listing's status to the default set in the environment config (or pending_realsy by default)
 */
import {ConfigKey} from "config/config-keys";

module.exports = async (ctx, next) => {
    const { body } = ctx.request;
    if (!ctx.state.user.canListExternal) {
        // force pending status for regular users
        body.status = process.env[ConfigKey.defaultListingStatus] ?? 'pending_realsy';
    }
    await next();
};
