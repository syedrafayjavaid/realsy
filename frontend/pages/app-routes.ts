/**
 * The routes available in the frontend app
 *
 * NOTE: These MUST match the page files under /pages
 * as NextJS uses the filesystem structure to determine routes
 */
export enum AppRoute {
    Home = '/',
    Buy = '/buy',
    ResetPassword = '/reset-password',
    SignOut = '/sign-out',
    UserAccountActivity = '/account/activity',
    UserCalendar = '/account/calendar',
    UserDashboard = '/account/dashboard',
    UserDocuments = '/account/documents',
    UserMessages = '/account/messages',
    UserProfile = '/account/profile',
    UserSavedListings = '/account/saved-listings',
    UserListings = '/account/listings',
}
