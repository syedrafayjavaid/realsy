import {Logger} from "api/logging";

const logger = Logger('email-service');

/**
 * Wraps the strapi email plugin to add logging, error handling, and environment configuration
 */
export const EmailService = {
    /**
     * Sends an email
     * @param to
     * @param from
     * @param cc
     * @param bcc
     * @param replyTo
     * @param subject
     * @param text
     * @param html
     */
    async send({to, from = null, cc = null, bcc = null, replyTo = null, subject, text, html}) {
        const sendTo = process.env.TEST_EMAIL ?? to;

        if (process.env.DISABLE_EMAILS === 'true') {
            logger.info({
                message: 'Skipped sending email due to environment config',
                to: sendTo, from, cc, bcc, replyTo, subject, text, html
            });
            return {
                sent: false,
                code: 'disabled-by-env',
                info: {to: sendTo, from, cc, bcc, replyTo, subject, text, html}
            };
        }

        await strapi.plugins['email'].services.email.send({
            to: sendTo, from, cc, bcc, replyTo, subject, text, html
        });

        logger.trace({
            message: 'Sent email',
            to: sendTo, from, cc, bcc, replyTo, subject, text, html
        });

        return {
            sent: true,
            info: {to: sendTo, from, cc, bcc, replyTo, subject, text, html},
        };
    }
}
