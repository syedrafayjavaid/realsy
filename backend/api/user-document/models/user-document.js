import {Logger} from "api/logging";
import {DocusignService} from "api/docusign/docusign-service";

const logger = Logger('user-document-model');

/**
 * User Document model
 * Add lifecycle hooks to user documents
 */
module.exports = {
    lifecycles: {
        /**
         * Runs before user document creation
         * @param data
         * @return {Promise<void>}
         */
        async beforeCreate(data) {
            logger.trace({
                message: 'Creating user document',
                data,
            });

            if (data.docusignEnvelope && !data.docusignEnvelope.templateId && !data.original) {
                throw new Error('Document or template required to create Docusign envelope');
            }

            // create docusign envelope if configured
            if (data.docusignEnvelope && (data.original || data.docusignEnvelope.templateId)) {
                const envelopeCreateResult = await DocusignService.createEnvelope({
                    signers: data.docusignEnvelope.signers.map(signer => ({
                        name: signer.email,
                        email: signer.email,
                        role: signer.role,
                    })),
                    filePath: data.original ? data.original?.url : undefined,
                    templateId: data.docusignEnvelope.templateId,
                });
                data.docusignEnvelope.envelopeId = envelopeCreateResult?.envelopeId;
            }
        },

        /**
         * Runs before user document update
         * @param params
         * @param data
         * @return {Promise<void>}
         */
        async beforeUpdate(params, data) {
            logger.trace({
                message: 'User document updating',
                documentId: params.id,
            });

            const existingUserDocument = await strapi.query('user-document', '').findOne({id: params.id});

            // create docusign envelope if configured in user document
            if (data.docusignEnvelope && !existingUserDocument.docusignEnvelope?.envelopeId) {
                const signers = data.docusignEnvelope?.signers ?? existingUserDocument.docusignEnvelope?.signers;
                const envelopeCreateResult = await DocusignService.createEnvelope({
                    signers: signers.map(signer => ({
                        name: signer.email,
                        email: signer.email,
                        role: signer.role,
                    })),
                    documentName: data.name ?? existingUserDocument.name,
                    filePath: (data.original || existingUserDocument.original)
                        ? data.original?.url ?? existingUserDocument.original?.url
                        : undefined,
                    templateId: data.docusignEnvelope?.templateId ?? existingUserDocument.docusignEnvelope?.templateId
                });
                data.docusignEnvelope.envelopeId = envelopeCreateResult?.envelopeId;
            }
        },
    },
};
