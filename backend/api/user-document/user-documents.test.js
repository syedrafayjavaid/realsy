import {afterAll, beforeAll, describe, it} from "@jest/globals";
import {createTestUser, getTokenForUserId} from "__tests__/helpers/auth-helpers";
import {createTestFileUpload} from "__tests__/helpers/create-test-file-upload";
import {initializeStrapi, teardownStrapi} from "__tests__/helpers/strapi-helpers";

const request = require('supertest');

async function createTestUserDocument(apiToken, data) {
    return await request(strapi.server)
        .post('/user-documents')
        .set('Authorization', 'Bearer ' + apiToken)
        .type('form')
        .field('data', JSON.stringify(data))
        .attach('files.original', __dirname + '/mocks/dummy.pdf')
        .expect(200);
}

/**
 * @group e2e
 * @group user-documents
 */
describe ('User Documents (end-to-end)', () => {
    beforeAll(async () => {
        await initializeStrapi();
    });

    afterAll(() => {
        teardownStrapi();
    });

    it ('Denies creation of user documents for unauthenticated users', async () => {
        await request(strapi.server)
            .post('/user-documents')
            .expect(403);
    });

    it ('Allows creation of user documents for authenticated users', async () => {
        const user = await createTestUser()
        const token = await getTokenForUserId(user.id);
        const testDocumentName = 'Test Document';

        const response = await createTestUserDocument(token, {name: testDocumentName});

        expect(response.body.id).toBeDefined();
        expect(response.body.name).toEqual(testDocumentName);
        expect(response.body.owner.id).toEqual(user.id);
        expect(response.body.original.id).toBeDefined();
    });

    it ('Fetches a document the requesting user is involved in', async () => {
        const user = await createTestUser();
        const token = await getTokenForUserId(user.id);
        const otherUser = await createTestUser();
        const otherToken = await getTokenForUserId(otherUser.id);
        const ownedDocumentResponse = await createTestUserDocument(token, {});
        const involvedDocumentResponse = await createTestUserDocument(otherToken, {
            usersInvolved: [user.id],
        });

        const ownedFetchResponse = await request(strapi.server)
            .get('/user-documents/' + ownedDocumentResponse.body.id)
            .set('Authorization', 'Bearer ' + token)
            .expect(200);
        expect(ownedFetchResponse.body.id).toEqual(ownedDocumentResponse.body.id);

        const involvedFetchResponse = await request(strapi.server)
            .get('/user-documents/' + involvedDocumentResponse.body.id)
            .set('Authorization', 'Bearer ' + token)
            .expect(200);
        expect(involvedFetchResponse.body.id).toEqual(involvedDocumentResponse.body.id);
    });

    it ('Denies fetch for a document the requesting user is not involved in', async () => {
        const user = await createTestUser();
        const token = await getTokenForUserId(user.id);
        const otherUser = await createTestUser();
        const otherToken = await getTokenForUserId(otherUser.id);
        const documentResponse = await createTestUserDocument(otherToken, {});

        await request(strapi.server)
            .get('/user-documents/' + documentResponse.body.id)
            .expect(403);

        await request(strapi.server)
            .get('/user-documents/' + documentResponse.body.id)
            .set('Authorization', 'Bearer ' + token)
            .expect(403);
    });

    it ('Fetches all documents which an authenticated user is involved in (owner or other signer)', async () => {
        const user = await createTestUser()
        const token = await getTokenForUserId(user.id);
        const otherUser = await createTestUser();
        const otherToken = await getTokenForUserId(otherUser.id);

        const ownedDocumentResponse = await createTestUserDocument(token, {});
        const involvedDocumentResponse = await createTestUserDocument(otherToken, {
            usersInvolved: [user.id],
        });
        const nonInvolvedDocumentResponse = await createTestUserDocument(otherToken, {});

        const fetchResponse = await request(strapi.server)
            .get('/user-documents')
            .set('Authorization', 'Bearer ' + token)
            .expect(200);

        expect(fetchResponse.body.length).toEqual(2);
        expect(fetchResponse.body.filter(document => document.id === ownedDocumentResponse.body.id).length).toEqual(1);
        expect(fetchResponse.body.filter(document => document.id === involvedDocumentResponse.body.id).length).toEqual(1);
        expect(fetchResponse.body.filter(document => document.id === nonInvolvedDocumentResponse.body.id).length).toEqual(0);
    }, 15000);

    it ('Deletes documents owned by the requesting user', async () => {
        const testUser = await createTestUser();
        const apiToken = await getTokenForUserId(testUser.id);
        const documentResponse = await createTestUserDocument(apiToken, {});

        await request(strapi.server)
            .delete('/user-documents/' + documentResponse.body.id)
            .set('Authorization', 'Bearer ' + apiToken)
            .expect(200);
    });

    it ('Rejects deletes on documents not owned by requesting user', async () => {
        const testUser = await createTestUser();
        const apiToken = await getTokenForUserId(testUser.id);
        const otherUser = await createTestUser();
        const otherApiToken = await getTokenForUserId(otherUser.id);

        const documentResponse = await createTestUserDocument(otherApiToken, {});
        await request(strapi.server)
            .delete('/user-documents/' + documentResponse.body.id)
            .set('Authorization', 'Bearer ' + apiToken)
            .expect(403);
    });

    it ('Generates a Docusign envelope when created with envelope config', async () => {
        const testUser = await createTestUser();
        const apiToken = await getTokenForUserId(testUser.id);
        const upload = await createTestFileUpload();

        const document = await strapi.query('user-document', '').create({
            original: upload,
            docusignEnvelope: {
                signers: [
                    {email: testUser.email, role: 'signer'},
                ],
            },
        });

        expect(document.docusignEnvelope.envelopeId).not.toBeNull();
    });

    it ('Generates a Docusign envelope when updated with envelope config', async () => {
        const testUser = await createTestUser();
        const apiToken = await getTokenForUserId(testUser.id);

        const documentResponse = await createTestUserDocument(apiToken, {});
        await strapi.query('user-document', '').update(
            {id: documentResponse.body.id},
            {
                docusignEnvelope: {
                    signers: [
                        {email: testUser.email, role: 'signer'},
                    ],
                },
            }
        );

        const updatedResponse = await request(strapi.server)
            .get('/user-documents/' + documentResponse.body.id)
            .set('Authorization', 'Bearer ' + apiToken)
            .expect(200);

        expect(updatedResponse.body.docusignEnvelope.envelopeId).not.toBeNull();
    }, 20000);

    it ('Generates a signing URL for documents the requesting user owns', async () => {
        const testUser = await createTestUser();
        const apiToken = await getTokenForUserId(testUser.id);

        const ownedDocumentResponse = await createTestUserDocument(apiToken, {});

        await strapi.query('user-document', '').update(
            {id: ownedDocumentResponse.body.id},
            {
                docusignEnvelope: {
                    signers: [
                        {email: testUser.email, role: 'signer'},
                    ],
                },
            }
        );

        const ownedSigningResponse = await request(strapi.server)
            .get(`/user-documents/${ownedDocumentResponse.body.id}/signing-url`)
            .set('Authorization', 'Bearer ' + apiToken)
            .expect(200);

        expect(ownedSigningResponse.body.url).toBeDefined();
        expect(ownedSigningResponse.body.url).not.toBeNull();
    });

    it ('Generates a signing URL for documents the requesting user is involved in', async () => {
        const testUser = await createTestUser();
        const apiToken = await getTokenForUserId(testUser.id);
        const otherUser = await createTestUser();
        const otherApiToken = await getTokenForUserId(otherUser.id);

        const documentResponse = await createTestUserDocument(otherApiToken, {
            usersInvolved: [testUser.id],
        });

        await strapi.query('user-document', '').update(
            {id: documentResponse.body.id},
            {
                docusignEnvelope: {
                    signers: [
                        {email: testUser.email, role: 'signer'},
                    ],
                },
            }
        );

        const signingResponse = await request(strapi.server)
            .get(`/user-documents/${documentResponse.body.id}/signing-url`)
            .set('Authorization', 'Bearer ' + apiToken)
            .expect(200);

        expect(signingResponse.body.url).toBeDefined();
        expect(signingResponse.body.url).not.toBeNull();
    })

    it ('denies view requests for users not involved in a document', async () => {
        const testUser = await createTestUser();
        const apiToken = await getTokenForUserId(testUser.id);
        const otherUser = await createTestUser();
        const otherApiToken = await getTokenForUserId(otherUser.id);

        const documentResponse = await createTestUserDocument(otherApiToken, {});

        await strapi.query('user-document', '').update(
            {id: documentResponse.body.id},
            {
                docusignEnvelope: {
                    signers: [
                        {email: testUser.email, role: 'signer'},
                    ],
                },
            }
        );

        await request(strapi.server)
            .get(`/user-documents/${documentResponse.body.id}/signing-url`)
            .set('Authorization', 'Bearer ' + apiToken)
            .expect(403);
    });
});
