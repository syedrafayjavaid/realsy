import {Logger} from 'api/logging';
import fs from "fs";
import uuid from 'uuid/v4';
import unparsed from 'koa-body/unparsed';
import {DocusignService} from "api/docusign/docusign-service";

const logger = Logger('user-documents-controller');

/**
 * User Documents controller
 * Provides extra actions related to user documents
 */
module.exports = {
    /**
     * Gets the URL for the user to view/sign a document on Docusign
     * These must be generated on demand because Docusign URLs expire shortly after generation
     * @param ctx
     * @returns {Promise<void>}
     */
    async getSigningUrl(ctx) {
        try {
            const document = await strapi.query('user-document', '').findOne({id: ctx.params.id});
            if (document.owner.id !== ctx.state.user.id && !document.usersInvolved.some(user => user.id === ctx.state.user.id)) {
                return ctx.forbidden('You do not have access to this document');
            }

            const viewRequestResult = await strapi.services['user-document'].generateDocusignViewRequest({
                documentId: ctx.params.id,
                signingUserId: ctx.state.user.id,
                returnUrl: ctx.query.returnUrl,
            });
            return ctx.send(viewRequestResult);
        }
        catch (e) {
            logger.logError('Failed to get Docusign signing URL', e);
            return ctx.send({});
        }
    },

    /**
     * Handles a Docusign envelope complete webhook push
     */
    async webhookEnvelopeComplete(ctx) {
        logger.trace({
            message: 'Docusign completed envelope webhook hit',
            request: ctx.request,
        });

        // get the new documents for the completed envelope
        const payload = ctx.request.body[unparsed];
        const envelopeId = DocusignService.getEnvelopeIdFromWebhookPayload(payload);
        const documentsResult = await DocusignService.getEnvelopeDocuments(envelopeId);
        const userDocument = await strapi.query('user-document', '').findOne({docusignEnvelopeId: envelopeId});

        // add completed document to user document record
        let base64doc = documentsResult.document.split(';base64,').pop();
        let tmpFileName = `/tmp/${uuid()}.pdf`;
        fs.writeFile(tmpFileName, base64doc, {encoding: 'base64'}, async (err, file) => {
            fs.stat(tmpFileName, (err, stats) => {
                if (err) {
                    logger.logError('Failed to save completed Docusign document', err);
                    return;
                }

                logger.trace({
                    message: 'Saving completed user document',
                    documentId: userDocument.id,
                });

                strapi.entityService.uploadFiles(
                    userDocument,
                    {
                        signed: {
                            path: tmpFileName,
                            name: 'signed-document.pdf',
                            type: 'application/pdf',
                            size: stats.size,
                        },
                    },
                    {
                        model: strapi.models['user-document'].modelName
                    }
                );
            });
        });

        ctx.send('ok');
    }
};
