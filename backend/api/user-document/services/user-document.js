import {Logger} from "api/logging";
import {DocusignService} from "api/docusign/docusign-service";

const logger = Logger('user-documents-service');

/**
 * User Documents service
 * Provides functions related to user documents
 */
module.exports = {
    /**
     * Generates a Docusign view request for a given user document
     * @param documentId
     * @param signingUserId
     * @param returnUrl
     */
    async generateDocusignViewRequest({documentId, signingUserId, returnUrl}) {
        const document = await strapi.query('user-document', '').findOne(
            {id: documentId},
            ['owner', 'usersInvolved'],
        );
        const user = await strapi.query('user', 'users-permissions').findOne({id: signingUserId});

        logger.trace({
            message: 'Generating Docusign view request',
            documentId,
            signingUserId,
            returnUrl,
        });

        if (!document || !user) {
            logger.warn({
                message: 'Attempted generating Docusign view request for non-existent document',
                documentId,
            });
            return {errorMessage: 'Document does not exist'};
        }
        if (!user) {
            logger.warn({
                message: 'Attempted generating Docusign view request for non-existent user',
                userId,
            });
            return {errorMessage: 'User does not exist'};
        }
        if (document.owner?.id !== signingUserId && !document.usersInvolved?.some(user => user.id === signingUserId)) {
            logger.warn({
                message: 'Attempted generating Docusign view request for unauthorized user',
                documentId,
                signingUserId,
            });
            throw new Error('unauthorized');
        }

        logger.trace({
            message: 'Generating Docusign view request',
            document,
            signingUserId,
            returnUrl,
        });

        try {
            const viewRequestResult = await DocusignService.createEnvelopeViewRequest({
                envelopeId: document.docusignEnvelope?.envelopeId,
                signerName: user.email,
                signerEmail: user.email,
                returnUrl,
                accessCode: document.docusignEnvelope?.accessCode,
            });
            logger.trace({
                message: 'Generated Docusign view request',
                viewRequestResult,
            });
            return viewRequestResult;
        }
        catch (e) {
            logger.logError('Error getting user document signing URL', e);
            return null;
        }
    },
};
