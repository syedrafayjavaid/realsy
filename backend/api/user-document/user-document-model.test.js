import {afterAll, beforeAll, describe, it} from "@jest/globals";
import {createTestUser} from "__tests__/helpers/auth-helpers";
import {createTestListing} from "__tests__/helpers/create-test-listing";
import {createTestFileUpload} from "__tests__/helpers/create-test-file-upload";
import {initializeStrapi, teardownStrapi} from "__tests__/helpers/strapi-helpers";

/**
 * Integration tests for the User Document model
 * @group integration
 */
describe ('User Document Model', () => {
    beforeAll(async () => {
        await initializeStrapi();
    });

    afterAll(() => {
        teardownStrapi();
    });

    it ('saves successfully', async () => {
        const owner = await createTestUser();
        const listing = await createTestListing();
        const document = await strapi.query('user-document', '').create({
            name: 'Test Document',
            owner: owner.id,
            listing: listing.id,
        });
        expect(document).toBeDefined();
        expect(document.owner.id).toEqual(owner.id);
        expect(document.listing.id).toEqual(listing.id);
    });

    it ('updates successfully', async () => {
        const document = await strapi.query('user-document', '').create({});
        const updatedName = 'Test Updated Name';
        const updateResult = await strapi.query('user-document', '').update(
            {id: document.id},
            {name: updatedName},
        );
        expect(updateResult.name).toEqual(updatedName);
    });

    it ('deletes successfully', async () => {
        const document = await strapi.query('user-document', '').create({});
        await strapi.query('user-document', '').delete({id: document.id});
        const secondFind = await strapi.query('user-document', '').findOne({id: document.id});
        expect(secondFind).toBeNull();
    });

    it ('throws an error if created or updated with envelope config but no upload attached', async () => {
        await expect(async () => {
            await strapi.query('user-document', '').create({
                docusignEnvelope: {
                    manualSigners: [
                        {role: 'signer', email: 'fake@realsyhomes.com'},
                    ],
                },
            });
        }).rejects.toThrowError();

        await expect(async () => {
            const userDocument = await strapi.query('user-document', '').create({});
            await strapi.query('user-document', '').update(
                {id: userDocument.id},
                {
                    docusignEnvelope: {
                        manualSigners: [
                            {role: 'signer', email: 'fake@realsyhomes.com'},
                        ],
                    },
                },
            );
        }).rejects.toThrowError();
    });

    it ('creates a Docusign envelope if created or updated with envelope config and attached original upload', async () => {
        const fileUpload = await createTestFileUpload();
        const userDocument = await strapi.query('user-document', '').create({
            title: 'Test Document',
            original: fileUpload,
            docusignEnvelope: {
                signers: [
                    {role: 'signer', email: 'fake@realsyhomes.com', name: 'Fake User'},
                ],
            },
        });
        expect(userDocument.docusignEnvelope.envelopeId).toBeDefined();

        const secondDocument = await strapi.query('user-document', '').create({});
        const updatedDocument = await strapi.query('user-document', '').update(
            {id: secondDocument.id},
            {
                original: fileUpload,
                docusignEnvelope: {
                    signers: [
                        {role: 'signer', email: 'fake@realsyhomes.com', name: 'Fake User'},
                    ],
                },
            },
        );
        expect(updatedDocument.docusignEnvelope.envelopeId).toBeDefined();
    });
});
