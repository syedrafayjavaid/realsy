import fs from 'fs';
import FileType from 'file-type';
import docusign from 'docusign-esign';
import {promisify} from 'util';
import {Logger} from 'api/logging';
import XmlParser from 'fast-xml-parser';
import tmp from "tmp-promise";
import Axios from "axios";
import {WebhookService} from "api/webhooks/webhook-service";
const readFile = promisify(fs.readFile);

const logger = Logger('docusign-service');

const CLIENT_ID = process.env.DOCUSIGN_CLIENT_ID;
const USER_ID = process.env.DOCUSIGN_USER_ID;
const ACCOUNT_ID = process.env.DOCUSIGN_ACCOUNT_ID;
const AUTH_URL = process.env.DOCUSIGN_AUTH_URL;
const BASE_URL = process.env.DOCUSIGN_BASE_URL;
const PRIVATE_KEY = process.env.DOCUSIGN_PRIVATE_KEY?.split("\\n").join("\n"); // need to translate "fake" newlines in env var to real newlines
const TOKEN_TIME_TO_LIVE = 60 * 60 * 3; // 3 hours

if (!CLIENT_ID || !USER_ID || !ACCOUNT_ID || !AUTH_URL || !BASE_URL || !PRIVATE_KEY) {
    logger.warn('Docusign config not present in environment. Docusign integration will not work properly.');
}

/**
 * Docusign service
 * Provides functions for interacting with the Docusign API
 */
export const DocusignService = {
    _getDefaultClient,
    createEnvelope,
    createEnvelopeViewRequest,
    getEnvelope,
    getEnvelopeDocuments,
    getEnvelopeIdFromWebhookPayload,
};

/**
 * Fetches the current token and expiration from persistent storage
 * @returns {Promise<{token: string, expiration: Date}>}
 */
async function getApiToken() {
    const tokens = await strapi.query('api-tokens', '').findOne();
    return {
        token: tokens?.docusignToken,
        expiration: new Date(tokens?.docusignExpiration),
    };
}

/**
 * Persists an API token and expiration
 * @param token
 * @param expiration
 * @returns {Promise<void>}
 */
async function storeApiToken(token, expiration) {
    const existingTokens = await strapi.query('api-tokens', '').findOne();
    if (existingTokens) {
        await strapi.query('api-tokens', '').update({}, {
            docusignToken: token,
            docusignExpiration: expiration,
        });
    }
    else {
        await strapi.query('api-tokens', '').create({
            docusignToken: token,
            docusignExpiration: expiration,
        });
    }
}

/**
 * Gets a Docusign API client with default config
 * @private
 */
async function _getDefaultClient() {
    const client = new docusign.ApiClient();
    client.setBasePath(BASE_URL);
    const existingToken = await getApiToken();
    if (existingToken?.token && existingToken?.expiration > new Date()) {
        client.addDefaultHeader('Authorization', 'Bearer ' + existingToken.token);
    }
    else {
        const authTokenResult = await _authenticate();
        if (authTokenResult.success) {
            await storeApiToken(authTokenResult.accessToken, new Date(authTokenResult.expiration));
            client.addDefaultHeader('Authorization', 'Bearer ' + authTokenResult.accessToken);
        }
    }
    return client;
}

/**
 * Authenticates with the Docusign API
 * @private
 */
async function _authenticate() {
    try {
        logger.trace('Docusign authenticating');

        const apiClient = new docusign.ApiClient();
        apiClient.setOAuthBasePath(AUTH_URL);
        const results = await apiClient.requestJWTUserToken(
            CLIENT_ID,
            USER_ID,
            ['signature', 'impersonation'],
            PRIVATE_KEY,
            TOKEN_TIME_TO_LIVE, // 3 hour expiration
        );

        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + parseInt(results.body.expires_in));

        logger.trace({
            message: 'Docusign authenticated successfully',
            response: results.body,
            expiration,
        });

        return {
            success: true,
            accessToken: results.body.access_token,
            expiration
        };
    }
    catch (error) {
        logger.logError('Docusign failed to authenticate', error);
        return {
            success: false,
            error,
        }
    }
}

/**
 * Creates a Docusign envelope
 * @param signers
 * @param documentName
 * @param filePath
 * @param templateId
 * @param accessCode
 * @returns {docusign.EnvelopeDefinition}|null
 */
async function createEnvelope({signers, documentName, filePath, templateId, accessCode}){
    logger.trace({
        message: 'Creating docusign envelope',
        signers,
        documentName,
        templateId,
    });

    if (!signers || signers?.length < 1) {
        logger.info({
            message: 'No signers provided for Docusign envelope; skipping creation',
        });
        return null;
    }

    const apiClient = await _getDefaultClient();
    docusign.Configuration.default.setDefaultApiClient(apiClient);
    const envelopesApi = new docusign.EnvelopesApi();

    // create a tmp file in case we need to download from external hosting
    // we do this here so we can call cleanup at the end of the function
    const tmpFile = await tmp.file();
    let uploadDoc = null
    if (filePath) {
        let documentPath;
        const documentIsLocal = filePath.substring(0, 4) !== 'http'
        if (!documentIsLocal) {
            // download document from remote host
            const response = await Axios({
                url: filePath,
                method: 'GET',
                responseType: 'stream',
            });

            const tmpFileStream = fs.createWriteStream(null, {fd: tmpFile.fd});
            response.data.pipe(tmpFileStream);
            await new Promise((resolve, reject) => {
                tmpFileStream.on('finish', resolve);
                tmpFileStream.on('error', reject);
            });

            documentPath = tmpFile.path;
        } else {
            documentPath = filePath;
        }
        const fileBuffer = await readFile(documentPath);
        const fileExtension = (await FileType.fromBuffer(fileBuffer)).ext;

        // create the envelope definition
        uploadDoc = new docusign.Document.constructFromObject({
            documentBase64: fileBuffer.toString('base64'),
            name: documentName ?? 'Realsy Document',
            documentId: 1,
            fileExtension
        });

    }

    let envelope = new docusign.EnvelopeDefinition();
    envelope.emailSubject = 'Realsy Homes: Document signature requested';

    if (templateId) {
        envelope.templateId = templateId;
        envelope.templateRoles = signers.map(signer => ({
            email: signer.email,
            name: signer.name,
            roleName: signer.role,
            userId: signer.email,
            clientUserId: signer.email,
        }));
    }
    else {
        envelope.recipients = docusign.Recipients.constructFromObject({signers: signers.map((signer, i) => ({
            email: signer.email,
            name: signer.name,
            clientUserId: signer.email,
            userId: signer.email,
            recipientId: i + 1,
        }))});
    }

    if (uploadDoc) {
        envelope.documents = [uploadDoc];
    }
    envelope.status = 'sent';

    envelope.eventNotification = docusign.EventNotification.constructFromObject({
        envelopeEvents: [
            docusign.EnvelopeEvent.constructFromObject({
                envelopeEventStatusCode: 'completed',
            }),
        ],
        url: WebhookService.generateWebhookUrl('/user-documents/webhooks/envelope-complete'),
        loggingEnabled: true,
    });

    // send the envelope to Docusign
    const createEnvelopePromise = promisify(envelopesApi.createEnvelope).bind(envelopesApi);
    try {
        const response = await createEnvelopePromise(ACCOUNT_ID, {envelopeDefinition: envelope});
        logger.info({
            message: 'Created docusign envelope',
            result: response
        });
        return response;
    }
    catch (error) {
        logger.error({
            message: 'Failed to create docusign envelope',
            response: error.response.text,
        });
    }
    finally {
        await tmpFile.cleanup();
    }
}

/**
 * Creates view request for a given envelope
 * This is used to get links for users to sign documents
 * @param envelopeId
 * @param signerName
 * @param signerEmail
 * @param returnUrl where the user is redirected after the Docusign session
 * @param accessCode
 * @param role
 * @returns {Promise<void>}
 */
async function createEnvelopeViewRequest({envelopeId, signerName, signerEmail, returnUrl = 'http://realsyhomes.com', accessCode, role}) {
    logger.info({
        message: 'Creating docusign envelope view request',
        envelopeId,
        signerName,
        signerEmail,
        returnUrl,
        role,
    });

    const apiClient = await _getDefaultClient();
    docusign.Configuration.default.setDefaultApiClient(apiClient);
    const envelopesApi = new docusign.EnvelopesApi();
    const createRecipientViewPromise = promisify(envelopesApi.createRecipientView).bind(envelopesApi);
    try {
        const result = await createRecipientViewPromise(ACCOUNT_ID, envelopeId, {
            recipientViewRequest: docusign.RecipientViewRequest.constructFromObject({
                userName: signerName,
                email: signerEmail,
                clientUserId: signerEmail,
                returnUrl,
                authenticationMethod: 'email',
            })
        });
        logger.info({
            message: 'Created docusign envelope view request',
            result,
        });
        return result;
    }
    catch (error) {
        logger.error({
            message: 'Failed to create docusign signing URL',
            error: error.toString(),
        });
    }
}

/**
 * Gets a given envelope
 * @param envelopeId
 * @returns {Promise<void>}
 */
async function getEnvelope(envelopeId) {
    const apiClient = await _getDefaultClient();
    docusign.Configuration.default.setDefaultApiClient(apiClient);
    const envelopesApi = new docusign.EnvelopesApi();
    const getEnvelope = promisify(envelopesApi.getEnvelope).bind(envelopesApi);
    try {
        return await getEnvelope(ACCOUNT_ID, envelopeId);
    }
    catch (error) {
        logger.error({
            message: 'Failed to fetch docusign envelope',
            errorMessage: error.message,
            stack: error.stack,
        });
    }
}

/**
 * Gets a given envelope's documents
 * @param envelopeId
 * @returns {Promise<*>}
 */
async function getEnvelopeDocuments(envelopeId) {
    const apiClient = await _getDefaultClient();
    docusign.Configuration.default.setDefaultApiClient(apiClient);
    const envelopesApi = new docusign.EnvelopesApi();
    const getDocument = promisify(envelopesApi.getDocument).bind(envelopesApi);
    try {
        const document = await getDocument(ACCOUNT_ID, envelopeId, 'combined', {encoding: 'base64'});
        return {
            success: true,
            document: document
        };
    }
    catch (error) {
        logger.error({
            message: 'Failed to fetch docusign envelope documents',
            errorMessage: error.message,
            stack: error.stack,
        });
        return {
            success: false,
        }
    }
}

/**
 * Gets the envelope ID from an XML webhook payload passed by Docusign
 * @param payloadXmlString
 * @returns {*}
 */
function getEnvelopeIdFromWebhookPayload(payloadXmlString) {
    const payload = XmlParser.parse(payloadXmlString);
    return payload?.DocuSignEnvelopeInformation?.EnvelopeStatus?.EnvelopeID;
}
