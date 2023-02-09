import {PinoLoggly} from "pino-loggly";
import pino from 'pino';
import {ConfigKey} from "config/config-keys";

const DEFAULT_LOG_LEVEL = 'warn';

/**
 * Logger library
 * Provides logging locally or to Loggly with tags
 */
export const Logger = (tag = null) => {
    const log = (level, entry) => {
        const logglyCustomerToken = process.env[ConfigKey.logglyCustomerToken];
        const logger = logglyCustomerToken
            ? pino(
                (new PinoLoggly({
                    token: logglyCustomerToken,
                    tags: ['api'].concat(tag ? [tag] : []),
                    returnStream: true,
                    level: process.env[ConfigKey.logLevel] ?? DEFAULT_LOG_LEVEL,
                })).init()
            )
            : pino({
                level: process.env[ConfigKey.logLevel] ?? DEFAULT_LOG_LEVEL,
                prettyPrint: true,
            });
        logger[level](entry);
    };

    return {
        tag,

        info(entry) {log('info', entry)},
        warn(entry) {log('warn', entry)},
        error(entry) {log('error', entry)},
        debug(entry) {log('debug', entry)},
        trace(entry) {log('trace', entry)},
        fatal(entry) {log('fatal', entry)},

        logError(message, error) {
            log('error', {
                message,
                errorMessage: error.message,
                stack: error.stack,
            });
        }
    };
};
