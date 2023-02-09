import {describe, it} from "@jest/globals";
import {TextMessagingService} from "api/text-messaging/text-messaging-service";

/**
 * Integration tests for the Text Messaging service
 * @group integrated
 * @group text-messaging/integrated
 */
describe('Text Messaging Service', () => {
    it ('sends text messages', async () => {
        const testBody = 'Test text';
        const result = await TextMessagingService.sendText(process.env.TEST_PHONE_NUMBER, testBody);
        expect(result.to).toEqual('1' + process.env.TEST_PHONE_NUMBER);
        expect(result.body).toEqual(testBody);
        // text will be received at env var TEST_PHONE_NUMBER and DISABLE_TEXTS is not set
    });

    it ('strips non-numeric characters from phone numbers', async () => {
        const testBody = 'Test text';
        const result = await TextMessagingService.sendText(process.env.TEST_PHONE_NUMBER + '-', testBody);
        expect(result.to).toEqual('1' + process.env.TEST_PHONE_NUMBER);
        expect(result.body).toEqual(testBody);
        // text will be received at env var TEST_PHONE_NUMBER if DISABLE_TEXTS is not set
    });

    it ('overrides phone numbers to number set in env var TEST_PHONE_NUMBER if set', async () => {
        const savedPhoneNumber = process.env.TEST_PHONE_NUMBER;
        const savedDisableTexts = process.env.DISABLE_TEXTS;

        const testNumber = '1231231234';
        process.env.TEST_PHONE_NUMBER = testNumber;
        process.env.DISABLE_TEXTS = 'true';

        const result = await TextMessagingService.sendText('9879879876', 'Test text');
        expect(result.to).toEqual('1' + testNumber);

        process.env.TEST_PHONE_NUMBER = savedPhoneNumber;
        process.env.DISABLE_TEXTS = savedDisableTexts;
    });

    it ('does not override phone number if TEST_PHONE_NUMBER env var is not set', async () => {
        const savedPhoneNumber = process.env.TEST_PHONE_NUMBER;
        const savedDisableTexts = process.env.DISABLE_TEXTS;

        const testNumber = '4022165644';
        delete process.env.TEST_PHONE_NUMBER;
        process.env.DISABLE_TEXTS = 'true';

        const result = await TextMessagingService.sendText(testNumber, 'Test text');
        expect(result.to).toEqual('1' + testNumber);

        process.env.TEST_PHONE_NUMBER = savedPhoneNumber;
        process.env.DISABLE_TEXTS = savedDisableTexts;
    });
});
