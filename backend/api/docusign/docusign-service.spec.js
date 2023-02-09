import {describe, it} from "@jest/globals";
import {readFile} from "fs";
import {promisify} from "util";
import {DocusignService} from 'api/docusign/docusign-service';

const readFileAsync = promisify(readFile);

/**
 * Docusign Service unit tests
 * @group unit
 * @group docusign
 */
describe ('Docusign Service', () => {
    it ('gets the envelope ID of an envelope webhook payload', async () => {
        const webhookPayload = await readFileAsync(__dirname + '/mocks/webhook-complete-payload.xml', {encoding: 'utf-8'});
        const returnedId = DocusignService.getEnvelopeIdFromWebhookPayload(webhookPayload);
        expect(returnedId).toEqual('dummy-envelope-id');
    });
});
