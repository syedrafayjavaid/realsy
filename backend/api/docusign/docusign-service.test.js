import {DocusignService} from "api/docusign/docusign-service";
import {initializeStrapi, teardownStrapi} from "__tests__/helpers/strapi-helpers";

/**
 * Integrated tests for the Docusign service
 * Sends real requests to Docusign
 * @group integration
 * @group docusign
 */
describe('Docusign Service', () => {
    beforeAll(async () => {
        await initializeStrapi();
    });

    afterAll(() => {
        teardownStrapi();
    });

    it ('creates docusign envelopes', async () => {
        const result = await DocusignService.createEnvelope({
            signers: [{
                role: 'signer',
                email: 'test@realsyhomes.com',
                name: 'Test Signer',
            }],
            documentName: 'Test Document',
            filePath: __dirname + '/mocks/dummy.pdf',
        });
        expect(result.envelopeId).toBeDefined();
    });

    it('creates recipient view requests for envelopes', async () => {
        const createResult = await DocusignService.createEnvelope({
            signers: [{
                role: 'signer',
                email: 'test@realsyhomes.com',
                name: 'Test Signer',
            }],
            documentName: 'Test Document',
            filePath: __dirname + '/mocks/dummy.pdf',
        });
        const viewRequestResult = await DocusignService.createEnvelopeViewRequest({
            envelopeId: createResult.envelopeId,
            signerEmail: 'test@realsyhomes.com',
            signerName: 'Test Signer',
            returnUrl: 'https://realsyhomes.com',
        });
        expect(viewRequestResult.url).toBeDefined();
    });

    it("gets an envelope status", async () => {
        const createResult = await DocusignService.createEnvelope({
            signers: [{
                role: 'signer',
                email: 'test@realsyhomes.com',
                name: 'Test Signer',
            }],
            documentName: 'Test Document',
            filePath: __dirname + '/mocks/dummy.pdf'
        });
        const statusResult = await DocusignService.getEnvelope(createResult.envelopeId);
        expect(statusResult.envelopeId).toBeDefined();
    });

    it("gets an envelope's documents", async () => {
        const createResult = await DocusignService.createEnvelope({
            signers: [{
                role: 'signer',
                email: 'test@realsyhomes.com',
                name: 'Test Signer',
            }],
            documentName: 'Test Document',
            filePath: __dirname + '/mocks/dummy.pdf'
        });
        const documentsResult = await DocusignService.getEnvelopeDocuments(createResult.envelopeId);
        expect(documentsResult.success).toBe(true);
        expect(documentsResult.document).toBeDefined();
    });

    describe ('token persistence', () => {
        it('persists access tokens in the database', async () => {
            await DocusignService._getDefaultClient();
            const storedApiTokens = await strapi.query('api-tokens', '').findOne();
            expect(storedApiTokens?.docusignToken).toBeDefined();
            expect(storedApiTokens?.docusignToken).not.toBeNull();
            expect(storedApiTokens?.docusignExpiration).toBeDefined();
            expect(storedApiTokens?.docusignExpiration).not.toBeNull();
        });

        it('reuses tokens persisted in the database', async () => {
            const fakeToken = 'fake-token';
            const fakeExpiration = new Date();
            fakeExpiration.setDate(fakeExpiration.getDate() + 1);
            const existingTokens = await strapi.query('api-tokens', '').findOne();
            if (existingTokens) {
                await strapi.query('api-tokens', '').update({}, {
                    docusignToken: fakeToken,
                    docusignExpiration: fakeExpiration,
                });
            }
            else {
                await strapi.query('api-tokens', '').create({
                    docusignToken: fakeToken,
                    docusignExpiration: fakeExpiration,
                });
            }

            const client = await DocusignService._getDefaultClient();

            expect(client.defaultHeaders.Authorization).toEqual('Bearer ' + fakeToken);
        });
    });
});
