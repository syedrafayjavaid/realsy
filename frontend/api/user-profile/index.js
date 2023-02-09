import Uploads from "api/uploads";
import {ApiClient} from "api/api-client";

/**
 * User Profile functions
 */
const UserProfile = {
    getProfile,
    updateProfile,
    updateProfilePhoto
};
export default UserProfile;

/**
 * Gets an authenticated user's profile
 * @returns {Promise<{success: boolean, profile: any}>}
 */
async function getProfile() {
    const apiResponse = await ApiClient.get('/user-profiles/me');
    const responseData = apiResponse.data;
    return {
        success: apiResponse.status === 200,
        profile: responseData
    };
}

/**
 * Updates an authenticated user's profile
 * @param apiToken
 * @param newData
 * @returns {Promise<{success: boolean, profile: any}>}
 */
async function updateProfile(apiToken, newData) {
    const response = await ApiClient.put('/user-profiles/me', newData);
    const responseData = response.data;
    return {
        success: response.status === 200,
        profile: responseData
    };
}

/**
 * Updates an authenticated user's profile photo
 * @param apiToken
 * @param photoFile
 * @returns {Promise<{upload: any, success: boolean}>}
 */
async function updateProfilePhoto(apiToken, photoFile) {
    const userProfileResult = await UserProfile.getProfile(apiToken);
    if (!userProfileResult.success) {
        return {success: false, upload: null};
    }

    return await Uploads.uploadFile(apiToken, photoFile, {
        relatedType: 'user',
        relatedSource: 'users-permissions',
        relatedId: userProfileResult.profile.id,
        relatedField: 'profilePhoto'
    });
}
