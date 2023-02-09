import {existsSync, unlinkSync} from "fs";
const http = require('http');

let instance;

/**
 * Initiates a Strapi instance for testing
 *
 * @param {string} envPath - path of env file to load
 * @param {boolean} clearDatabase - starts with cleared database if true
 * @return {Promise<*>}
 */
export async function initializeStrapi({
    envPath = __dirname + '/../.env.test',
    clearDatabase = false,
} = {}) {
    if (clearDatabase) {
        deleteTestDatabase();
    }

    // strapi reads env config from the file at ENV_PATH
    // we set that path here to allow setting environments before strapi loads
    process.env.ENV_PATH = envPath;
    const Strapi = require('strapi');

    if (!instance) {
        await Strapi({}).load();
        instance = strapi;
        await instance.app
            .use(instance.router.routes())
            .use(instance.router.allowedMethods());
        instance.server = http.createServer(instance.app.callback());
    }
    return instance;
}

/**
 * Tears down strapi test instance and deletes test database
 * @param {boolean} clearDatabase - if true, deletes database after teardown
 */
export function teardownStrapi({clearDatabase = true} = {}) {
    if (clearDatabase) {
        deleteTestDatabase();
    }
}

/**
 * Deletes the sqlite database used for testing
 */
export function deleteTestDatabase() {
    const path = '.tmp/test.db';
    if (existsSync(path)) {
        unlinkSync(path);
    }
}
