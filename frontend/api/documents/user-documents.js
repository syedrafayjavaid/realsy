import Uploads from "api/uploads";
import {ApiClient} from "api/api-client";

/**
 * Users Documents functions
 */
const Documents = {
    createDocument,
    getOwnedDocuments,
    getSigningUrl
};
export default Documents;

/**
 * Creates a new document owned by the authenticated user
 * @param apiToken
 * @param listingId
 * @param document
 */
async function createDocument(apiToken, {file, name, listingId}) {
    // create the user document entity
    let bodyData = {name};
    if (listingId) { bodyData.listing = listingId; }
    const createDocumentResponse = await ApiClient.post('/user-documents', bodyData);
    if (createDocumentResponse.status !== 200) { return {success: false}; }
    const document = createDocumentResponse.data;

    // upload the associated file
    const fileUploadResult = await Uploads.uploadFile(apiToken, file, {
        relatedType: 'user-document',
        relatedId: document.id,
        relatedField: 'original'
    });
    document.original = fileUploadResult.upload;

    return {
        success: createDocumentResponse.status === 200 && fileUploadResult.success,
        document
    };
}

/**
 * Gets documents owned by the authenticated user
 * @param apiToken
 * @returns {Promise<{documents: any, success: boolean}>}
 */
async function getOwnedDocuments(apiToken) {
    const response = await ApiClient.get(`/user-documents`);
    const data = response.data;
    return {
        success: response.status === 200,
        documents: data,
    };
}

/**
 * Gets a signing URL for a given document
 * @param apiToken
 * @param documentId
 * @param returnUrl
 * @returns {Promise<{success: boolean, viewResult: any}>}
 */
async function getSigningUrl(apiToken, documentId, returnUrl = process.env.NEXT_PUBLIC_BASE_URL) {
    const response = await ApiClient.get(`/user-documents/${documentId}/signing-url`, {
        params: {
            returnUrl
        },
    });
    const data = response.data;
    return {
        success: response.status === 200,
        viewResult: data,
    };
}
