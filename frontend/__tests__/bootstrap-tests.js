import {loadEnvConfig} from '@next/env';

/**
 * Sets up test environment before tests are run
 */
export default async () => {
    // load test environment variables
    loadEnvConfig(__dirname);
}
