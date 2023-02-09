import React, {FC, useContext, useEffect, useState} from 'react';
import UserProfile from "api/user-profile";
import jsCookie from 'js-cookie';
import {useRouter} from 'next/router';
import Listings from "api/listings";
import {pushSoftQueryParams} from "util/push-soft-query-param";
import {clearSoftQueryParams} from "util/clear-soft-query-param";
import {Modal} from "components/modal";
import {NotificationManager} from "react-notifications";
import {Logger} from "util/logging";
import {UserDto} from "api/auth/user.dto";
import {UserAuthForm} from "api/auth/user-auth-form/user-auth-form";
import {ApiRoutes} from "api/api-routes";
import axios from "axios";
import Cookie from "js-cookie";
import {AppRoute} from "pages/app-routes";

const logger = Logger('auth-context');

/**
 * Auth Context
 *
 * Provides app-wide context of current user auth status,
 * as well as allowing the sign in modal to be opened anywhere with the showSignIn query param
 */

export interface AuthContextInterface {
    apiToken?: string,
    isSignedIn: boolean,
    userId?: string,
    currentUser?: UserDto,
    getStarted: () => any,
    showSignIn: () => any,
    hideSignIn: () => any,
    signIn: (apiToken: string) => any,
    signOut: () => any,
    clearAuthStatus: () => any,
    setProfile: (newProfile: UserDto) => any,
    checkListingFavorited: (listingId: number) => boolean,
    setListingFavorited: (listingId: number, favorited: boolean) => any,
}

export const AuthContext = React.createContext<AuthContextInterface>({
    isSignedIn: false,
    getStarted: () => {},
    showSignIn: () => {},
    signIn: () => {},
    signOut: () => {},
    hideSignIn: () => {},
    clearAuthStatus: () => {},
    setProfile: () => {},
    checkListingFavorited: () => false,
    setListingFavorited: () => Promise.resolve(),
});

export type MainAuthContextProviderProps = {
    hasInvalidApiToken?: boolean,
    initialApiToken?: string,
    initialUserProfile?: UserDto,
};

export const MainAuthContextProvider: FC<MainAuthContextProviderProps> = props => {
    const router = useRouter();
    const [apiToken, setApiToken] = useState<string | undefined>(props.hasInvalidApiToken ? undefined : props.initialApiToken);
    const [userProfile, setUserProfile] = useState<UserDto | undefined>(props.initialUserProfile);
    const [isSigningUserIn, setIsSigningUserIn] = useState<boolean>(false);
    const [isRegisteringUser, setIsRegisteringUser] = useState<boolean>(false);
    const [favoritedListingIds, setFavoritedListingIds] = useState(
        props.initialUserProfile?.savedListings?.map(listing => listing.id)
        ?? []
    );

    /**
     * Init effect
     */
    useEffect(() => {
        if (userProfile?.id) {
            setupIntercom(userProfile);
        }
        else {
            resetIntercom();
        }
    }, []);

    useEffect(function onSignInShown() {
        if (router.query.showSignIn === 'true') {
            if (router.query.signInRedirect) {
                sessionStorage.setItem('auth-redirect-url', (router.query.signInRedirect as string).replace('(q)', '?').replace('(a)', '&'));
            }
        }
    }, [router.query.showSignIn]);

    useEffect(function onApiTokenChange() {
        Cookie.set('apiToken', apiToken ?? '');
    }, [apiToken]);

    useEffect(() => {
        if (props.hasInvalidApiToken) {
            setApiToken(undefined);
        }
    }, [props.hasInvalidApiToken]);

    /**
     * Sets up intercom to recognize the given user
     */
    function setupIntercom(userProfile: UserDto) {
        (window as any).intercomSettings = {
            app_id: process.env.NEXT_PUBLIC_INTERCOM_APP_ID,
            custom_launcher_selector: '.chat-launcher',
            hide_default_launcher: true,
            name: userProfile.name,
            email: userProfile.email,
            created_at: new Date(userProfile.created_at).getUTCSeconds()
        };
        (window as any).Intercom?.('update');
    }

    /**
     * Resets intercom to an unknown user
     */
    function resetIntercom() {
        (window as any).Intercom?.('shutdown');
        (window as any).intercomSettings = {
            app_id: process.env.NEXT_PUBLIC_INTERCOM_APP_ID,
            custom_launcher_selector: '.chat-launcher',
            hide_default_launcher: true
        };
        (window as any).Intercom?.('update');
    }

    /**
     * Signs the current user in with supplied credentials
     * @return {Promise<void>}
     */
    async function signIn(email: string, password: string) {
        setIsSigningUserIn(true);
        try {
            const authenticateResponse = await axios.post(ApiRoutes.BaseUrl + ApiRoutes.UserAuthenticate, {
                identifier: email,
                password,
            });
            setApiToken(authenticateResponse.data.jwt);
            setUserProfile(authenticateResponse.data.user);
            setupIntercom(authenticateResponse.data.user);

            logger.debug('User signed in', authenticateResponse.data.user);

            // the show modal param MUST be removed before route change, or it will send user back to current page
            await hideSignInModal();
            await router.push(AppRoute.UserDashboard);
        }
        catch (e) {
            logger.error('Error signing user in', e);
            NotificationManager.error('Failed sign in');
        }
        finally {
            setIsSigningUserIn(false);
        }
    }

    /**
     * Signs the current user out
     */
    function signOut() {
        router.push('/sign-out');
    }

    async function showSignInModal() {
        await pushSoftQueryParams({showSignIn: 'true'}, router);
    }

    async function hideSignInModal() {
        await clearSoftQueryParams(['showSignIn'], router);
    }

    /**
     * Clears the current user auth status
     */
    function clearAuthStatus() {
        setApiToken(undefined);
        jsCookie.set('apiToken', '', { expires: 0, path: '/' });
        jsCookie.set('userId', '', { expires: 0, path: '/' });
        resetIntercom();
        setUserProfile(undefined);
    }

    return (
        <AuthContext.Provider value={{
            apiToken,
            isSignedIn: apiToken !== undefined && apiToken.trim() !== '',
            userId: userProfile?.id?.toString(),
            currentUser: userProfile,
            getStarted: () => {
                if (apiToken) {
                    router.push(AppRoute.UserDashboard);
                }
                else {
                    showSignInModal();
                }
            },
            showSignIn: async () => showSignInModal(),
            hideSignIn: async () => hideSignInModal(),
            signIn: async (apiToken: string) => {
                setApiToken(apiToken);
                const userProfileResult = await UserProfile.getProfile();
                setupIntercom(userProfileResult.profile);
                setUserProfile(userProfileResult.profile);
            },
            signOut,
            clearAuthStatus,
            setProfile: (newProfile: UserDto) => {
                setUserProfile(newProfile);
            },
            checkListingFavorited: (listingId: number) => {
                return favoritedListingIds.some(favoritedId => favoritedId === listingId);
            },
            setListingFavorited: async (listingId: number, favorited: boolean) => {
                await Listings.favoriteListing(listingId, favorited);
                if (favorited) {
                    setFavoritedListingIds(current => current.concat([listingId]));
                } else {
                    setFavoritedListingIds(current => current.filter(id => id !== listingId));
                }
            }
        }}>
            {/* We render a conditional modal to allow the sign in modal to be presented on any page */}
            {router.query.showSignIn === 'true' &&
                <Modal
                    onClose={() => clearSoftQueryParams(['showSignIn'], router)}
                    fullScreenBreakpoint={'450px'}
                >
                    <UserAuthForm
                        signInFormProps={{
                            showSigningIn: isSigningUserIn,
                        }}
                        onSignInRequested={async (credentials) => {
                            await signIn(credentials.email, credentials.password);
                        }}
                        onRegisterRequested={async (credentials) => {
                            setIsRegisteringUser(true);
                            try {
                                const registerResponse = await axios.post(ApiRoutes.BaseUrl + ApiRoutes.UserRegister, {
                                    username: credentials.email,
                                    email: credentials.email,
                                    password: credentials.password,
                                });

                                setApiToken(registerResponse.data.jwt);
                                setUserProfile(registerResponse.data.user);
                                logger.debug('User registered', registerResponse.data.user);

                                await hideSignInModal();
                                await router.push(AppRoute.UserProfile + '?newSignUp=true');
                            }
                            catch (e) {
                                if ('Auth.form.error.email.taken' === e.response.data.message?.[0]?.messages?.[0]?.id) {
                                    NotificationManager.error('Email already registered', 'Failed Sign Up');
                                }
                                else {
                                    NotificationManager.error('Failed sign up');
                                }
                            }
                            setIsRegisteringUser(false);
                        }}
                        registerFormProps={{
                            showRegistering: isRegisteringUser,
                        }}
                    />
                </Modal>
            }

            {props.children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
