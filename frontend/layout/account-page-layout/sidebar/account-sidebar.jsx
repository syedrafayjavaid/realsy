import React from 'react';
import Link from 'next/link';
import CalendarIcon from "components/icons/calendar";
import DashboardIcon from "components/icons/dashboard";
import HouseIcon from "components/icons/house";
import HeartIcon from "components/icons/heart";
import DocumentIcon from "components/icons/document";
import ClockIcon from "components/icons/clock";
import {useAuthContext} from "api/auth/auth-context";
import {useRouter} from 'next/router';
import {useAccountSidebarStyles} from 'layout/account-page-layout/sidebar/account-sidebar.styles';
import MessageIcon from "components/icons/message";
import Uploads from "api/uploads";
import {useNotificationsContext} from "contexts/notifications-context";
import {Fade} from "react-awesome-reveal";
import {AppRoute} from "pages/app-routes";

/**
 * The side bar for account pages
 */
const AccountSidebar = () => {
    const authContext = useAuthContext();
    const notificationsContext = useNotificationsContext();
    const router = useRouter();
    const styles = useAccountSidebarStyles();

    const listingsNotifications = notificationsContext.getNotificationsForSecondaryRelatedContent('listing');
    // we filter listing notifications to just offer notifications, as other "secondary related" notifications
    // are shown in the respective sidebar menu item
    const listingOfferNotifications = listingsNotifications.filter(notification => notification.contentType === 'offer');
    const chatNotifications = notificationsContext.getNotificationsForContentType('chat');
    const calendarNotifications = notificationsContext.getNotificationsForContentType('scheduled-event');

    return (
        <div className={styles.accountSidebar}>
            <div className='profile-snapshot'>
                <Link href={AppRoute.UserProfile}>
                    <a>
                        <div
                            className={styles.userPhoto}
                            style={{
                                backgroundImage: `url(${Uploads.getUserProfilePhotoUrl(authContext.currentUser?.id)}`
                            }}
                        />
                    </a>
                </Link>
                <h1>
                    <Link href={AppRoute.UserProfile}>
                        <a>{ authContext.currentUser?.name || 'My Profile' }</a>
                    </Link>
                </h1>
                <p>
                    <Link href={AppRoute.UserProfile}>
                        <a>Edit Profile</a>
                    </Link>
                </p>
            </div>

            <ul>
                <li className={router.pathname.indexOf('dashboard') !== -1 ? 'active' : ''}>
                    <Link href={AppRoute.UserDashboard}>
                        <a data-testid={'sidebar-link-dashboard'}>
                            <span style={{marginLeft: 3}}><DashboardIcon /></span> Dashboard
                        </a>
                    </Link>
                </li>
                <li className={router.pathname.indexOf('listings') !== -1 && router.pathname.indexOf('saved') === -1 ? 'active' : ''}>
                    <Link href={'/account/listings'}>
                        <a data-testid={'sidebar-link-listings'}>
                            <HouseIcon /> My Listings
                            {listingOfferNotifications.length > 0 &&
                                <Fade>
                                    <span className={styles.notification}>
                                        {listingOfferNotifications.length}
                                    </span>
                                </Fade>
                            }
                        </a>
                    </Link>
                </li>
                <li className={router.pathname.indexOf('saved-listings') !== -1 ? 'active' : ''}>
                    <Link href={'/account/saved-listings'}>
                        <a data-testid={'sidebar-link-saved-listings'}>
                            <HeartIcon /> Saved Listings
                        </a>
                    </Link>
                </li>
                <li className={router.pathname.indexOf('calendar') !== -1 ? 'active' : ''}>
                    <Link href={'/account/calendar'}>
                        <a data-testid={'sidebar-link-calendar'}>
                            <span style={{marginLeft: 3}}><CalendarIcon /></span> Calendar
                            {calendarNotifications.length > 0 &&
                                <Fade>
                                    <span className={styles.notification}>
                                        {calendarNotifications.length}
                                    </span>
                                </Fade>
                            }
                        </a>
                    </Link>
                </li>
                <li className={router.pathname.indexOf('documents') !== -1 ? 'active' : ''}>
                    <Link href={'/account/documents'}>
                        <a data-testid={'sidebar-link-documents'}>
                            <span style={{marginLeft: 4}}><DocumentIcon /></span> Documents
                        </a>
                    </Link>
                </li>
                <li className={router.pathname.indexOf('messages') !== -1 ? 'active' : ''}>
                    <Link href={'/account/messages'}>
                        <a data-testid={'sidebar-link-messages'}>
                            <span style={{marginLeft: 0, marginRight: 2}}><MessageIcon /></span> Messages
                            {chatNotifications.length > 0 &&
                                <Fade>
                                    <span className={styles.notification}>
                                        {chatNotifications.length}
                                    </span>
                                </Fade>
                            }
                        </a>
                    </Link>
                </li>
                <li className={router.pathname.indexOf('activity') !== -1 ? 'active' : ''}>
                    <Link href={'/account/activity'}>
                        <a data-testid={'sidebar-link-activity'}>
                            <span style={{marginLeft: -3, marginRight: 2}}><ClockIcon /></span> Account Activity
                        </a>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default AccountSidebar;
