import Nexmo from 'nexmo';
import {Logger} from "api/logging";
import {ConfigKey} from "config/config-keys";

const logger = Logger('text-message-lib');

export const TextMessagingService = {
    sendText
};

/**
 * Sends a text message through the Nexmo API
 * @param toNumber
 * @param body
 */
async function sendText(toNumber, body) {
    const from = process.env.NEXMO_FROM_NUMBER;
    const configuredToNumber = process.env.TEST_PHONE_NUMBER ?? toNumber;
    const sendTo = `1${configuredToNumber.replace(/\D/g, '')}` // with "1" country code in front of "to" number

    if (process.env[ConfigKey.disableTexts] === 'true') {
        logger.info({
            message: 'Skipped sending text message due to environment config',
            to: sendTo,
            body,
        });
        return {
            to: sendTo,
            body,
        };
    }

    try {
        const result = await promisedSend(from, sendTo, body);

        logger.trace({
            message: 'Text message sent',
            to: result.messages[0].to,
            body,
        });

        return {
            to: result.messages[0].to,
            body,
        };
    }
    catch (e) {
        logger.logError('Error sending text message', e);
    }
}

/**
 * Wraps the nexmo API call in a promise
 * @param from
 * @param sendTo
 * @param body
 */
function promisedSend(from, sendTo, body) {
    const nexmo = new Nexmo({
        apiKey: process.env.NEXMO_API_KEY,
        apiSecret: process.env.NEXMO_API_SECRET
    });

    return new Promise((resolve) => {
        nexmo.message.sendSms(from, sendTo, body, {}, (err, responseData) => {
            if (err) {
                throw err;
            }
            return resolve(responseData);
        });
    });
}
