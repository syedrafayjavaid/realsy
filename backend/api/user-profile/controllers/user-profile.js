import _ from 'lodash'
import { sanitizeEntity } from 'strapi-utils';
import {ConfigKey} from "config/config-keys";

/**
 * User Profile controller
 * Adds extra actions related to user profiles
 */
module.exports = {
    /**
     * Redirects to a given user's profile photo
     * This is distinct from returning the URL (as a string), as an image src attribute can be set to this
     * endpoint and will redirect to the image data
     */
    async userPhoto(ctx) {
        const format = ctx.request.query.format || 'medium';
        let user = null
        const userId = parseInt(ctx.request.query.id);
        if (userId) {
            user = await strapi.query('user', 'users-permissions').findOne(
                {id: userId},
                ['profilePhoto']
            );
        }

        if (!user?.profilePhoto) {
            // user does not have a photo set, try default photo configured in admin
            const defaultUserPhoto = (await strapi.query('global-content', '').find())?.defaultUserPhoto;
            if (defaultUserPhoto) {
                return ctx.redirect(defaultUserPhoto?.formats?.[format]?.url || defaultUserPhoto?.url);
            }
            else {
                // no default photo configured in admin, use static file
                return ctx.redirect('/default-user-image.svg');
            }
        }
        return ctx.redirect(user?.profilePhoto?.profilePhoto?.formats?.[format]?.url || user?.profilePhoto?.url);
    },

    /**
     * Get the authenticated user's profile
     */
    async me(ctx) {
        const userId = ctx.state.user.id;
        const user = await strapi.query('user', 'users-permissions').findOne(
            {id: userId},
            ['profilePhoto', 'savedListings']
        );
        ctx.send(user);
    },

    /**
     * Updates the authenticated user's profile
     */
    async updateMe(ctx) {
        const userId = ctx.state.user.id;
        const body = ctx.request.body;

        // convert "null" strings to actual nulls
        for (const prop in body) {
            if (body[prop] === 'null') {
                body[prop] = null;
            }
        }

        const result = await strapi.query('user', 'users-permissions').update(
            {id: userId},
            {...body}
        );
        const newProfile = await strapi.query('user', 'users-permissions').findOne(
            {id: userId},
            ['profilePhoto'] // only fetch the profile photo relation, exclude others (chats, notifications, etc)
        );

        ctx.send(newProfile);
    },

    /**
     * Handles creating new user after successful oauth (google/fb/etc) sign in
     */
    async oauthCallback(ctx) {
        const provider = ctx.params.provider || 'local';

        const store = await strapi.store({
            environment: '',
            type: 'plugin',
            name: 'users-permissions',
        });

        if (!_.get(await store.get({ key: 'grant' }), [provider, 'enabled'])) {
            // a disabled provider was attempted by the user
            // this should never happen, so just redirect to homepage
            ctx.redirect(process.env[ConfigKey.frontendUrl]);
        }

        // Connect the user with the third-party provider.
        var user, error;
        try {
            [user, error] = await strapi.plugins['users-permissions'].services.providers.connect(provider, ctx.query);
        } catch ([user, error]) {
            let message = '';
            if (error.message && error.message.length > 0 && error.message[0].messages[0].id === 'Auth.form.error.email.taken') {
                message = 'Email+already+registered'
            }
            return ctx.redirect(process.env[ConfigKey.frontendUrl] + '?failedSignUp=true&message=' + message);
        }

        if (error) {
            // sign in failed with known error
            let message = '';
            if (error[0].messages && error[0].messages.length > 0 && error[0].messages[0].id === 'Auth.form.error.email.taken') {
                // email is already registered with different provider
                message = 'Email+already+registered'
            }
            return ctx.redirect(process.env[ConfigKey.frontendUrl] + '?failedSignUp=true&message=' + message);
        }

        if (!user) {
            // sign in failed for unknown reason
            return ctx.redirect(process.env[ConfigKey.frontendUrl] + '?failedSignUp=true');
        }

        const userData = {
            jwt: strapi.plugins['users-permissions'].services.jwt.issue({
                id: user.id,
            }),
            user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
                model: strapi.query('user', 'users-permissions').model,
            })
        };

        const signUpDate = new Date(userData.user.created_at);
        const currentDate = new Date();
        let newSignUp = false;
        if ((currentDate - signUpDate) < (10 * 60 * 1000)) {
            // if user was created less than 10 minutes ago, flag as new sign up
            newSignUp = true;
        }

        return ctx.redirect(strapi.config.get('custom.' + ConfigKey.frontendUrl) + `/api/oauth-connect?` +
            `jwt=${userData.jwt}` +
            `&userId=${userData.user.id}` +
            `&newSignUp=${newSignUp}`
        );
    }
};
