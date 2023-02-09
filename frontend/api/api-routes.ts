/**
 * Enum of routes provided by the API
 * @type {{UserDocuments: string, Uploads: string, CurrentUserProfile: string, Listings: string, ScheduledEvents: string, Offers: string, Chats: string}}
 */
export const ApiRoutes = {
    BaseUrl: process.env.NEXT_PUBLIC_API_URL,

    UserRegister: '/auth/local/register',
    UserAuthenticate: '/auth/local',
    InitOauthFacebook: '/connect/facebook',
    InitOauthGoogle: '/connect/google',
    UserResetPassword: '/auth/reset-password',
    UserForgotPassword: '/auth/forgot-password',

    Listings: '/listings',
    ListingMainPhoto: `/listings/:listingId/main-photo`,
    Offers: '/offers',
    ScheduledEvents: '/scheduled-events',
    Chats: '/chats',
    Uploads: '/uploads',
    UserDocuments: '/user-documents',
    CurrentUserActivityRecords: '/user-activity-records/mine',
    CurrentUserProfile: '/user-profiles/me',
    UserPhoto: '/user-profiles/user-photo',

    /**
     * Builds the URL for a listing's main photo, with optional format for sizing
     * @param {number} listingId
     * @param {string} format
     * @return {string}
     */
    listingMainPhotoUrl: (listingId: number, {format} = {format: 'medium'}) => (
        ApiRoutes.BaseUrl
        + ApiRoutes.ListingMainPhoto
            .replace(':listingId', listingId?.toString())
            + `?format=${format}`
    ),

    /**
     * Gets the URL for a given user ID's profile photo
     * @param userId
     * @param format
     * @returns {string}
     */
    getUserProfilePhotoUrl(userId: number, {format} = {format: 'small'}) {
        return ApiRoutes.BaseUrl
            + ApiRoutes.UserPhoto
            + `?id=${userId}&format=${format}`;
    },
};
