import React, {useEffect, useState} from 'react';
import NextCookies from 'next-cookies';
import {MainAuthContextProvider} from "api/auth/auth-context";
import redirect from "util/redirect";
import {ErrorBoundary} from "containers/error-boundary/error-boundary";
import {ViewListingContextProvider} from "contexts/view-listing-context";
import {initializeAnalytics, initializeTagManager, logAnalyticsPageView} from "util/analytics";
import 'normalize.css';
import 'react-notifications/dist/react-notifications.css';
import 'react-datepicker/dist/react-datepicker.min.css';
import 'react-tippy/dist/tippy.css';
import 'react-image-lightbox/style.css'
import 'react-tagsinput/react-tagsinput.css';
import * as Sentry from "@sentry/react";
import {Integrations} from "@sentry/tracing";
import App, {AppContext, AppProps} from "next/app";
import {NotificationsContextProvider} from "contexts/notifications-context";
import Head from "next/head";
import {ApiClient, setApiClientContext} from "api/api-client";
import {AppInfo} from "app-info";
import Modal from 'react-modal';
import {Logger} from "util/logging";
import {ApiRoutes} from "api/api-routes";
import {CmsClient} from "cms/cms-client";
import {CmsRoutes} from "cms/cms-routes";
import {UserDto} from "api/auth/user.dto";
import {AppPage} from "pages/app-page.type";

const logger = Logger('main-app');

/**
 * Main App component
 * Handles each page request, persisting layout and providing app-wide context
 */

type CustomAppProps = AppProps & {
    apiToken?: string,
    hasInvalidApiToken: boolean,
    userProfile?: UserDto,
    pageProps: any,
    globalContent: any,
};

const CustomApp = (props: CustomAppProps) => {
    // global content is fetched once on the initial server-side render and then stored in state on the client
    const [globalContent] = useState(props.globalContent);

    /**
     * Initializes Google Analytics if configured
     */
    function initGoogleAnalytics() {
        if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
            initializeAnalytics();
            logger.debug('Google Analytics initialized');
        }
        else {
            logger.debug('Google Analytics disabled - no ID set in build');
        }
    }

    /**
     * Initializes Google Tag Manager if configured
     */
    function initGoogleTagManager() {
        if (process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID) {
            initializeTagManager();
            logger.debug('Google Tag Manager initialized');
        }
        else {
            logger.debug('Google Tag Manager disabled - no ID set in build');
        }
    }

    /**
     * Initializes sentry if enabled
     */
    function initSentry() {
        if (process.env.NEXT_PUBLIC_DISABLE_SENTRY !== 'true') {
            Sentry.init({
                dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
                environment: process.env.NODE_ENV,
                autoSessionTracking: true,
                integrations: [
                    new Integrations.BrowserTracing(),
                ],
                tracesSampleRate: 1.0,
            });
            logger.debug('Sentry initialized');
        }
        else {
            logger.debug('Sentry disabled by build config');
        }
    }

    /**
     * Initializes app on first mount
     */
    useEffect(() => {
        initGoogleAnalytics();
        initGoogleTagManager();
        initSentry();
        Modal.setAppElement('#__next'); // react-modal requires setting the root app element for accessibility
    }, []);

    if (process.env.GOOGLE_ANALYTICS_ID) {
        logAnalyticsPageView();
        logger.debug('Recorded analytics page view');
    }

    // Page components can have a static defaultLayout function to choose a layout,
    // so we check that to choose which layout to render (defaults to no layout)
    const getLayout =
        props.pageProps.layoutFunc ??
        (props.Component as AppPage).defaultLayout ?? ((page: any) => page);

    /**
     * Render
     */
    return (
        <>
            <Head>
                <title>{AppInfo.name}: {AppInfo.defaultPageTitle}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <MainAuthContextProvider
                hasInvalidApiToken={props.hasInvalidApiToken || false}
                initialApiToken={props.apiToken}
                initialUserProfile={props.userProfile}
            >
                <NotificationsContextProvider>
                    <ViewListingContextProvider>
                        <ErrorBoundary>
                            {/* render the page by calling its defaultLayout static property with global content */}
                            {getLayout(<props.Component {...props.pageProps} />, { globalContent })}
                        </ErrorBoundary>
                    </ViewListingContextProvider>
                </NotificationsContextProvider>
            </MainAuthContextProvider>
        </>
    );
}



/**
 * Initial props
 * Sets up app-wide context (login status, etc) when request is rendered server-side
 * (After first server-side rendering, state is kept client side)
 */
CustomApp.getInitialProps = async (appContext: AppContext) => {
    // because each page render can be either client-side or server-side rendered
    // we need to set the API client context on each page load, so that it knows how to pull
    // the current API token
    setApiClientContext(appContext.ctx);

    let defaultAppProps = {};
    try {
        defaultAppProps = await App.getInitialProps(appContext);
    }
    catch (e) {
        // ignore page initial props errors
    }

    // add currentApiToken to the app props, to then use as the initial token for the auth context provider
    const cookies = NextCookies(appContext.ctx);
    const apiToken = cookies.apiToken;

    let hasInvalidApiToken = false;
    let userProfile = null;
    let globalContent = null;

    // a user-profile fetch is used as a token validation on each page view
    // if the request fails we pass the invalid token state to the auth context
    if (apiToken) {
        try {
            const userProfileResponse = await ApiClient.get(ApiRoutes.CurrentUserProfile);
            userProfile = userProfileResponse.data;
            logger.debug('Fetched user profile', userProfile);
        }
        catch (e) {
            if (e.response.status === 401 && e.response.data.message === 'Invalid token.') {
                logger.info('Current API token is invalid');
                hasInvalidApiToken = true;
            }
        }
    }

    // we persist global content on the client, so only fetch it if rendering server-side
    if (!process.browser) {
        const globalContentResponse = await CmsClient.get(CmsRoutes.globalContent);
        globalContent = globalContentResponse.data;
    }

    // redirect to sign in if auth required and not authenticated
    if ((appContext.Component as AppPage).requiresAuth && (!apiToken || hasInvalidApiToken)) {
        redirect(
            `/?showSignIn=true&signInRedirect=${appContext.ctx.req?.url?.replace('?', '(q)').replace('&', '(a)')}`,
            appContext.ctx.res,
            302
        );
        return {};
    }

    return {
        apiToken,
        hasInvalidApiToken,
        globalContent,
        userProfile,
        ...defaultAppProps
    };
};

export default CustomApp;
