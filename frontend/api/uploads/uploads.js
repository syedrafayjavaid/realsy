import {ApiClient} from "api/api-client";

const UPLOADS_URL = process.env.NEXT_PUBLIC_UPLOADS_URL;

/**
 * User Uploads library
 */
const Uploads = {
    UPLOADS_URL,
    uploadFile,
    getUserProfilePhotoUrl,
    getUploadFullUrl
};
export default Uploads;

/**
 * Uploads a file
 * @param apiToken
 * @param file - the files as a File object
 * @param relatedType - the type of the entity to relate the upload to (if any)
 * @param relatedId - the id of the entity to relate the upload to (if any)
 * @param relatedField - the name of the relationship field in the entity (if any)
 * @param relatedSource - the source (plugin) of the entity to relate the upload to (if any)
 * @returns {Promise<{upload: any, success: boolean}>}
 */
async function uploadFile(apiToken, file, {relatedType, relatedId, relatedField, relatedSource} = {}) {
    // construct form from provided data
    const formData = new FormData();
    formData.append('files', file);
    // related entity is optional -- providing it in the form data automatically associates it in the API
    if (relatedType && relatedId && relatedField) {
        formData.append('ref', relatedType);
        formData.append('refId', relatedId);
        formData.append('field', relatedField);
        if (relatedSource) { formData.append('source', relatedSource); }
    }

    const response = await ApiClient.post('/upload', formData);

    return {
        success: response.status === 200,
        upload: response.data[0],
    };
}

/**
 * Gets the URL for a given user ID's profile photo
 * @param userId
 * @param format
 * @returns {string}
 */
function getUserProfilePhotoUrl(userId, {format} = {format: 'small'}) {
    return ApiClient.defaults.baseURL + `/user-profiles/user-photo?id=${userId}&format=${format}`;
}

/**
 * Returns the full URL for an upload's path
 * @returns {string}
 * @param path
 */
function getUploadFullUrl(path) {
    return UPLOADS_URL + path;
}
