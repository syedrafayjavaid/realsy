import {Logger} from "api/logging";
import * as Sentry from '@sentry/node';
import {UsersPermissionsService} from "api/users-permissions/users-permissions-service";
import {AUTHENTICATED_ROLE_NAME, PUBLIC_ROLE_NAME, routePermissions} from "config/route-permissions";
import {defaultContentPages} from "api/content-page/default-content-pages";
import {defaultListingSellingSteps} from "api/app-settings/default-listing-selling-steps";
import {defaultListingClosingSteps} from "api/app-settings/default-listing-closing-steps";
import {defaultCreateOfferForm} from "api/form/default-create-offer-form";
import {defaultAppEvents} from "api/app-events/default-app-events";
import {registerChatSubscribers} from "api/app-events/subscribers/chat-events";
import {registerListingSubscribers} from "api/app-events/subscribers/listing-events";
import {registerOfferEvents} from "api/app-events/subscribers/offer-events";
import {registerScheduledEventSubscribers} from "api/app-events/subscribers/scheduled-event-events";
import {NgrokService} from "api/ngrok/ngrok-service";
import {registerUserEvents} from "api/app-events/subscribers/user-events";

const logger = Logger('bootstrap');

/**
 * Bootstrap - Runs during API startup
 * Used to configure the environment, setup content permissions, etc
 */
async function apiBootstrap() {
    try {
        logger.trace('Bootstrapping API');

        // overwrite default strapi logger with our own
        // our Logger module _must_ provide the same interface as the default Strapi logger which uses pino
        strapi.log = Logger('strapi');

        if (process.env.DISABLE_SENTRY !== 'true') {
            logger.trace('Initializing Sentry error catcher');
            Sentry.init({
                dsn: process.env.SENTRY_DSN,
                environment: process.env.NODE_ENV,
            });
        }
        else {
            logger.trace('Sentry disabled by environment, not initializing');
        }

        await Promise.all([
            initializeNgrokTunnelIfEnabled(),
            seedAdminUserIfNoneExist(),
            setConfiguredPermissions(),
            seedDefaultAgentsIfNoneExist(),
            seedDefaultContentPagesIfNoneExist(),
            seedDefaultContentPagesIfNoneExist(),
            seedDefaultAppSettingsIfNoneExist(),
            seedDefaultFormsIfNoneExist(),
            seedDefaultMicroContentSetsIfNoneExist(),
            seedDefaultGlobalContentIfNoneExists(),
            seedDefaultAppEventsIfNoneExist(),
            registerAppEventSubscribers(),
        ]);

        logger.trace('API bootstrap complete');
    }
    catch (error) {
        logger.logError('Failed to bootstrap API', error);
        Sentry.captureException(error);
        throw error;
    }
}

/**
 * Seeds the first admin account if no admins exist.
 * will use credentials from environment variables:
 * - SEED_ADMIN_EMAIL
 * - SEED_ADMIN_PASSWORD
 *
 * @return {Promise<void>}
 */
async function seedAdminUserIfNoneExist() {
    const seedEmail = process.env.SEED_ADMIN_EMAIL;
    const seedPassword = process.env.SEED_ADMIN_PASSWORD;
    const existingAdminCount = (await strapi.query('user', 'admin').find()).length;

    if (seedEmail && seedPassword && existingAdminCount < 1) {
        const seededAdmin = await UsersPermissionsService.createAdminUser(seedEmail, seedPassword);
        logger.info({
            message: 'Seeded admin account',
            email: seededAdmin.email,
            password: seedPassword,
        });
    }
}

/**
 * Sets up route/controller permissions according to config at /config/route-permissions.js
 * @return {Promise<void>}
 */
async function setConfiguredPermissions() {
    logger.info('Setting configured route permissions');

    const publicRole = await UsersPermissionsService.getRoleByName(PUBLIC_ROLE_NAME);
    const authenticatedRole = await UsersPermissionsService.getRoleByName(AUTHENTICATED_ROLE_NAME);

    for (let i = 0; i < routePermissions.length; ++i) {
        const permission = routePermissions[i];
        for (let j = 0; j < permission.allowedRoles.length; ++j) {
            let role = null;
            if (permission.allowedRoles[j] === PUBLIC_ROLE_NAME) {
                role = publicRole;
            }
            else if (permission.allowedRoles[j] === AUTHENTICATED_ROLE_NAME) {
                role = authenticatedRole;
            }

            if (!role) {
                logger.warn({
                    message: 'Skipping permission for invalid role',
                    role: permission.allowedRoles[j],
                });
                continue;
            }

            await UsersPermissionsService.enablePermissions(
                role?.id,
                permission.controller,
                permission.action,
                permission.plugin ?? 'application',
            );
        }
    }
}

/**
 * Initializes an Ngrok tunnel if configured in environment
 * @return {Promise<void>}
 */
async function initializeNgrokTunnelIfEnabled() {
    if (process.env.ENABLE_NGROK === 'true') {
        const ngrokUrl = await NgrokService.initiateNgrokTunnel(strapi.config.get('server.port'));
        logger.info(`Tunneling through Ngrok at ${ngrokUrl}`);
        strapi.config.set('webhookBaseUrl', ngrokUrl);
    }
    else {
        strapi.config.set('webhookBaseUrl', strapi.config.get('server.url'));
    }
}

/**
 * Seeds the default Realsy agents if there are currently none
 * @returns {Promise<void>}
 */
async function seedDefaultAgentsIfNoneExist() {
    if ((await strapi.query('agent', '').find()).length === 0) {
        const agent = await strapi.query('agent', '').create({
            name: 'Dylan Hajek',
            about: ''
        });
        logger.info({
            message: 'Seeded default agents',
            agents: [agent],
        });
    }
}

/**
 * Seeds the main content pages if no pages exist
 * @returns {Promise<void>}
 */
async function seedDefaultContentPagesIfNoneExist() {
    const existingPagesCount = await strapi.query('content-page', '').count();
    if (existingPagesCount < 1) {
        for (let i = 0; i < defaultContentPages.length; ++i) {
            await strapi.query('content-page', '').create(defaultContentPages[i]);
        }

        logger.info('Seeded default content pages');
    }
}

/**
 * Seeds the default app settings if none exist
 * @return {Promise<void>}
 */
async function seedDefaultAppSettingsIfNoneExist() {
    if ((await strapi.query('app-settings', '').find()).length === 0) {
        await strapi.query('app-settings', '').create({
            listingSteps: defaultListingSellingSteps.map(step => { return {
                title: step.name,
                microSteps: step.microSteps.map(microStep => { return {
                    name: microStep,
                    complete: false
                }})
            }}),
            closingSteps: defaultListingClosingSteps.map(step => { return {
                title: step.name,
                microSteps: step.microSteps.map(microStep => { return {
                    name: microStep,
                    complete: false
                }})
            }}),
            defaultAgent: 1
        });
        logger.info('Seeded default app settings');
    }
}

/**
 * Seeds the default forms if no forms exist
 * @returns {Promise<void>}
 */
async function seedDefaultFormsIfNoneExist() {
    if (await strapi.query('form', '').count() < 1) {
        await strapi.query('form', '').create(defaultCreateOfferForm);
        logger.info('Seeded default forms');
    }
}

/**
 * Seeds the default micro content sets if they don't already exist
 * @returns {Promise<void>}
 */
async function seedDefaultMicroContentSetsIfNoneExist() {
    const existingSetCount = await strapi.query('micro-content-set', '').count();
    if (existingSetCount < 1) {
        await strapi.query('micro-content-set', '').create({
            "name": "Create Offer",
            "code": "create-offer",
            "microContent": [
                {
                    "__component": "content.micro-content-rich",
                    "id": 1,
                    "code": "user-guide-1",
                    "content": "<h4><strong>The Realsy Offer Tool</strong></h4><p>Copy Explaining How the offer tool works. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"
                },
                {
                    "__component": "content.micro-content-rich",
                    "id": 2,
                    "code": "user-guide-2",
                    "content": "<h4><strong>The Realsy Offer Tool</strong></h4><p>Copy Explaining How the offer tool works. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"
                },
                {
                    "__component": "content.micro-content-rich",
                    "id": 3,
                    "code": "user-guide-3",
                    "content": "<h4><strong>The Realsy Offer Tool</strong></h4><p>Copy Explaining How the offer tool works. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"
                },
                {
                    "__component": "content.micro-content-rich",
                    "id": 4,
                    "code": "user-guide-4",
                    "content": "<h4><strong>The Realsy Offer Tool</strong></h4><p>Copy Explaining How the offer tool works. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"
                }
            ]
        });

        await strapi.query('micro-content-set', '').create({
            "id": 2,
            "name": "User Sign In",
            "code": "user-sign-in",
            "created_at": "2020-05-27T11:48:29.875Z",
            "updated_at": "2020-05-27T11:48:29.875Z",
            "microContent": [
                {
                    "__component": "content.micro-content-rich",
                    "id": 5,
                    "code": "sign-up-blurb",
                    "content": "<p>This is managed in the admin: Micro Content Sets -&gt; \"User Sign In\"</p>"
                }
            ]
        });

        logger.info('Seeded default micro content');
    }
}

/**
 * Seeds the default global content if none exists
 * @returns {Promise<void>}
 */
async function seedDefaultGlobalContentIfNoneExists() {
    const orm = strapi.query('global-content', '');
    const contentCount = await strapi.query('global-content', '').count();
    if (contentCount < 1) {
        await orm.create({
            chatButtonText: 'Chat with us!'
        });
        logger.info('Seeded default global content');
    }
}

/**
 * Seeds the default app events if none exist
 * @returns {Promise<void>}
 */
async function seedDefaultAppEventsIfNoneExist() {
    if (await strapi.query('app-events', '').count() < 1) {
        for (let i=0; i < defaultAppEvents.length; ++i) {
            await strapi.query('app-events', '').create(defaultAppEvents[i]);
        }
        logger.info('seeded default app events');
    }
}

/**
 * Registers app event subscribers
 * @return {Promise<void>}
 */
async function registerAppEventSubscribers() {
    await Promise.all([
        registerChatSubscribers(),
        registerListingSubscribers(),
        registerOfferEvents(),
        registerScheduledEventSubscribers(),
        registerUserEvents(),
    ]);
}

module.exports = apiBootstrap;
