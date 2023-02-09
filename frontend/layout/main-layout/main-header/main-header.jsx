import React, {useEffect, useRef, useState} from 'react';
import Link from "next/link";
import PropTypes from 'prop-types';
import {useRouter} from 'next/router';
import DashboardIcon from "components/icons/dashboard";
import CalendarIcon from "components/icons/calendar";
import ClockIcon from "components/icons/clock";
import HouseIcon from "components/icons/house";
import HeartIcon from "components/icons/heart";
import DocumentIcon from "components/icons/document";
import SignOutIcon from "components/icons/sign-out";
import GearIcon from "components/icons/gear";
import RealsyLogo from "components/icons/realsy-logo";
import {useMainHeaderStyles} from 'layout/main-layout/main-header/main-header.styles';
import {useAuthContext} from "api/auth/auth-context";
import MessageIcon from "components/icons/message";
import Uploads from "api/uploads";
import HamburgerMenu from 'react-hamburger-menu';
import Colors from "styles/colors";
import {disableMainBodyScroll, enableMainBodyScroll} from "util/disable-main-body-scroll";
import {useNotificationsContext} from "contexts/notifications-context";

/**
 * The main site header
 */
const MainHeader = (props) => {
    const styles = useMainHeaderStyles();
    const router = useRouter();
    const authContext = useAuthContext();
    const notificationsContext = useNotificationsContext();
    const mainMenuRef = useRef();
    const accountMenuRef = useRef();
    const [isMobileMode, setIsMobileMode] = useState(false);
    const [mainMenuShown, setMainMenuShown] = useState(false);
    const [accountMenuShown, setAccountMenuShown] = useState(false);

    useEffect(function onMount() {
        const setUpForWindowBounds = () => {
            setIsMobileMode(document.body.clientWidth < props.menuBreakPoint);
            setMainMenuShown(false);
            setAccountMenuShown(false);
        };

        const onRouteChange = () => {
            setMainMenuShown(false);
            setAccountMenuShown(false);
        };

        setUpForWindowBounds();
        window.addEventListener('resize', setUpForWindowBounds);
        router.events.on('routeChangeStart', onRouteChange);

        return function onUnmount() {
            window.removeEventListener('resize', setUpForWindowBounds);
            router.events.off('routeChangeStart', onRouteChange)
        }
    }, []);

    useEffect(() => {
        if (mainMenuShown) {
            setAccountMenuShown(false);
            disableMainBodyScroll();
        }
        else {
            mainMenuRef.current?.scrollTo(0, 0);
        }
    }, [mainMenuShown]);

    useEffect(() => {
        if (accountMenuShown) {
            setMainMenuShown(false);
        }
        else {
            accountMenuRef.current?.scrollTo(0, 0);
        }
    }, [accountMenuShown]);

    useEffect(() => {
        if (mainMenuShown || accountMenuShown) {
            disableMainBodyScroll();
        }
        else {
            enableMainBodyScroll();
        }
    }, [mainMenuShown, accountMenuShown]);

    return (
        <div className={styles.headerContainer}>
            <header className={styles.mainHeader}>
                {router.pathname !== '/' &&
                    <Link href='/'>
                        <a className={styles.mainLogo}>
                            <RealsyLogo/>
                        </a>
                    </Link>
                }
                {router.pathname === '/' &&
                    <a className={`${styles.mainLogo} nolink`}>
                        <RealsyLogo/>
                    </a>
                }

                {isMobileMode &&
                    <a
                        href='#main-menu'
                        className={styles.mainMenuButton}
                        onClick={(e) => {
                            e.preventDefault();
                            setMainMenuShown(!mainMenuShown);
                        }}
                    >
                        <HamburgerMenu
                            menuClicked={() => {}}
                            isOpen={mainMenuShown}
                            width={22}
                            height={15}
                            color={Colors.darkBlue}
                        />
                    </a>
                }

                {isMobileMode && authContext.isSignedIn &&
                    <a
                        href='#account-menu'
                        className={styles.accountMenuMobileButton}
                        onClick={(e) => {
                            e.preventDefault();
                            setAccountMenuShown(!accountMenuShown);
                        }}
                    >
                        <img src='/icon-profile.svg'/>
                    </a>
                }

                <ul id='main-menu'
                    ref={mainMenuRef}
                    className={`${styles.mainMenu} ${styles.menu} ${(mainMenuShown || accountMenuShown) ? 'shown' : ''}`}
                    data-testid={'main-menu'}
                >
                    {(!isMobileMode || mainMenuShown) && props.menuItems && props.menuItems.map((menuItem, i) => {
                        if (menuItem.url === router.pathname || (menuItem.urlTemplate === router.pathname && menuItem.url === router.asPath)) {
                            return <li key={i}><a className={styles.activeMenuItem}>{menuItem.text}</a></li>
                        }
                        else if (!menuItem.urlTemplate) {
                            return <li key={i}>
                                <Link href={menuItem.url}><a>{menuItem.text}</a></Link>
                            </li>
                        } else {
                            return <li key={i}>
                                <Link href={menuItem.urlTemplate} as={menuItem.url}><a>{menuItem.text}</a></Link>
                            </li>
                        }
                    })}

                    {(!isMobileMode || mainMenuShown) && !authContext.isSignedIn &&
                        <li key='login' className={styles.accountMenuItem}>
                            <a
                                data-testid={'account-menu-button'}
                                className={'account-menu-link'}
                                onClick={(e) => {
                                    e.preventDefault();
                                    authContext.showSignIn();
                                }}
                                children={props.signInButtonText}
                            />
                        </li>
                    }

                    {authContext.isSignedIn &&
                        <li
                            key='account-button'
                            className={styles.accountMenuItem}
                            onMouseOver={() => setAccountMenuShown(true)}
                            onMouseOut={() => setAccountMenuShown(false)}
                        >
                            {!isMobileMode &&
                                <Link href={'/account/profile'}>
                                    <a
                                        className={`account-menu-link ${notificationsContext.hasNotifications ? 'with-notification' : ''}`}
                                        data-testid={'account-menu-button'}
                                    >
                                        <div
                                            className={`${styles.userPhoto} user-photo`}
                                            style={{backgroundImage: `url('${Uploads.getUserProfilePhotoUrl(authContext.currentUser?.id)}')`}}
                                        />
                                        My Profile
                                    </a>
                                </Link>
                            }
                            {authContext.isSignedIn &&
                                <ul id='account-menu'
                                    ref={accountMenuRef}
                                    data-testid={'account-menu'}
                                    className={`${styles.menu} ${styles.accountMenu} ${accountMenuShown ? 'shown' : ''}`}
                                >
                                    {isMobileMode &&
                                    <li key='edit-profile'><Link href={'/account/profile'}><a>
                                        <GearIcon/> Edit Profile
                                    </a></Link></li>
                                    }
                                    <li key='dashboard'><Link href={'/account/dashboard'}><a>
                                        <DashboardIcon/> Dashboard
                                    </a></Link></li>
                                    <li key='listings'><Link href={'/account/listings'}><a>
                                        <span style={{marginLeft: -3}}><HouseIcon/></span> My Listings
                                    </a></Link></li>
                                    <li key='calendar'><Link href={'/account/calendar'}><a>
                                        <span style={{marginLeft: 2, marginRight: -2}}><CalendarIcon/></span> Calendar
                                    </a></Link></li>
                                    <li key='saved-homes'><Link href={'/account/saved-listings'}><a>
                                        <span style={{marginLeft: -2}}><HeartIcon className={'heart-icon'}/></span> Saved Homes
                                    </a></Link></li>
                                    <li key='messages'><Link href={'/account/messages'}><a>
                                        <span style={{marginLeft: 0}}><MessageIcon style={{marginTop: 5}} /></span> Messages
                                    </a></Link></li>
                                    <li key='activity'><Link href={'/account/activity'}><a>
                                        <span style={{marginLeft: -5}}><ClockIcon/></span> Account Activity
                                    </a></Link></li>
                                    <li key='documents'><Link href={'/account/documents'}><a>
                                        <span style={{marginLeft: 2}}><DocumentIcon/></span> Documents
                                    </a></Link></li>
                                    <li key='sign-out'><Link href={'/api/logout'}>
                                        <a
                                            data-testid={'sign-out-button'}
                                            onClick={e => {
                                                e.preventDefault();
                                                authContext.signOut();
                                            }}
                                        >
                                            <span style={{marginLeft: 2}}><SignOutIcon/></span> Sign Out
                                        </a>
                                    </Link></li>

                                    {notificationsContext.notifications[0] &&
                                        <li
                                            key='notification'
                                            onClick={async () => {
                                                notificationsContext.openNotificationContent(notificationsContext.notifications[0]);
                                            }}
                                            className={styles.notification}
                                        >
                                            <span>
                                                <img
                                                    src={'/icon-house-white.svg'}
                                                    style={{marginRight: 5}}
                                                />
                                                {notificationsContext.notifications[0].heading}
                                            </span>
                                            <br/>
                                            <span className={styles.notificationSubhead}>
                                                {notificationsContext.notifications[0].subheading}
                                            </span>
                                        </li>
                                    }
                                </ul>
                            }
                        </li>
                    }
                </ul>
            </header>
        </div>
    );
};

MainHeader.propTypes = {
    logoUrl: PropTypes.string,
    menuItems: PropTypes.array.isRequired,
    signInButtonText: PropTypes.string,
    userNotification: PropTypes.object,
    menuBreakPoint: PropTypes.number,
};

MainHeader.defaultProps = {
    logoUrl: '/realsy-logo.svg',
    signInButtonText: 'Sign In / Join',
    menuBreakPoint: 718,
};

export default MainHeader;
