import ReactGA from 'react-ga'
import TagManager from 'react-gtm-module'

/**
 * Initializes google analytics
 */
export const initializeAnalytics = () => {
    ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? '');
    (window as any).GA_INITIALIZED = true;
}

/**
 * Logs a page view in google analytics
 */
export const logAnalyticsPageView = () => {
    if (process.browser && (window as any).GA_INITIALIZED) {
        ReactGA.set({page: window.location.pathname})
        ReactGA.pageview(window.location.pathname)
    }
}

/**
 * Initializes google tag manager
 */
export const initializeTagManager = () => {
    TagManager.initialize({
        gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID ?? '',
    });
}
