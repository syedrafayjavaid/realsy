import {describe, it} from "@jest/globals";
import {EmailService} from "api/email/email-service";
import {initializeStrapi, teardownStrapi} from "__tests__/helpers/strapi-helpers";
import faker from 'faker';

describe ('Email Service', () => {
    beforeAll(async () => {
        await initializeStrapi();
    });

    afterAll(() => {
        teardownStrapi();
    })

    it ('sends emails', async () => {
        const testEmail = process.env.TEST_EMAIL;
        const testSubject = 'Realsy Test';
        const testBody = 'Email from Realsy test suite';

        const result = await EmailService.send({
            to: testEmail,
            subject: testSubject,
            text: testBody,
        });

        expect(result.info.to).toEqual(testEmail);
        expect(result.info.subject).toEqual(testSubject);
        expect(result.info.text).toEqual(testBody);
        // email will be sent to env var TEST_EMAIL if DISABLE_EMAILS is not true
    });

    it ('sends to the email in TEST_EMAIL env var if set', async () => {
        const savedTestEmail = process.env.TEST_EMAIL;
        const savedDisableEmails = process.env.DISABLE_EMAILS;
        process.env.TEST_EMAIL = 'jonathan@plumbweb.io';
        process.env.DISABLE_EMAILS = 'true';

        const result = await EmailService.send({
            to: faker.internet.email(),
            subject: 'Realsy Test',
            text: 'test email',
        });

        process.env.TEST_EMAIL = savedTestEmail;
        process.env.DISABLE_EMAILS = savedDisableEmails;
    });

    it ('does not send emails if disabled by environment config', async () => {
        const savedValue = process.env.DISABLE_EMAILS;
        process.env.DISABLE_EMAILS = 'true';

        const result = await EmailService.send({
            to: process.env.TEST_EMAIL,
            subject: 'Realsy Test',
            text: 'test email',
        });

        expect(result.sent).toEqual(false);
        expect(result.code).toEqual('disabled-by-env');
        process.env.DISABLE_EMAILS = savedValue;
    });
});
