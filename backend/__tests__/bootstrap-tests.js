import {existsSync, copyFileSync} from 'fs';

/**
 * Sets up environment and global vars for tests to run
 */
const bootstrapTests = async () => {
    if (!existsSync(__dirname + '/.env.test')) {
        copyFileSync(__dirname + '/.env.test.example', __dirname + '/.env.test');
    }

    require('dotenv').config({
        path: __dirname + '/.env.test',
    });
};

module.exports = bootstrapTests;
