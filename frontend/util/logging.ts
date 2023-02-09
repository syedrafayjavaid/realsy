import loglevel, {LogLevelDesc} from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

const rootLogger = loglevel;
const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevelDesc;
rootLogger.setLevel(logLevel ?? 'warn');

prefix.reg(loglevel);
prefix.apply(rootLogger);
prefix.apply(rootLogger, {
    format(level, name, timestamp) {
        return `${timestamp} [${name} - ${level}]: `;
    },
});

/**
 * A logger with a distinguishing tag
 * @param {string} tag
 */
export function Logger(tag: string) {
    return rootLogger.getLogger(tag);
}
