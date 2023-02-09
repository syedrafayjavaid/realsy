import React, {Fragment} from 'react';
import Head from "next/head";
import {NotificationContainer} from 'react-notifications';
import MainHeader from "layout/main-layout/main-header";
import MainFooter from "layout/main-layout/main-footer";
import PropTypes from 'prop-types';
import {useMainLayoutStyles} from 'layout/main-layout/main-layout.styles';

/**
 * The site's main layout
 */
const MainLayout = props => {
    const styleClasses = useMainLayoutStyles();

    /**
     * Render
     */
    return (
        <Fragment>
            <Head>
                <title>Realsy Homes: Real estate is easier than ever before</title>
                <link href="https://fonts.googleapis.com/css2?family=Noticia+Text:wght@300;400;700&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet"/>
            </Head>
            <MainHeader
                menuItems={props.globalContent?.mainMenuItems || MainLayout.defaultProps.globalContent.mainMenuItems}
            />
            <main className={`${styleClasses.mainContent}`}>
                {props.children}
            </main>
            {!props.hideFooter &&
                <MainFooter
                    menuItems={props.globalContent?.footerMenuItems || MainLayout.defaultProps.globalContent.footerMenuItems}
                    socialMenuItems={props.globalContent?.footerSocialMenuItems || MainLayout.defaultProps.globalContent.footerSocialMenuItems}
                    newsletterSignUpText={props.globalContent.newsletterSignUpText}
                    chatButtonText={props.globalContent.chatButtonText}
                />
            }
            <NotificationContainer/>
        </Fragment>
    );
};

/**
 * Prop Types
 */
MainLayout.propTypes = {
    hideFooter: PropTypes.bool,
    title: PropTypes.string,
    globalContent: PropTypes.object,
};

/**
 * Default Props
 */
MainLayout.defaultProps = {
    hideFooter: false,
    title: "Real estate is easier than ever before",
    globalContent: {
        mainMenuItems: [
            {
                text: 'Sell',
                url: '/p/sell',
            },{
                text: 'Buy',
                url: '/buy'
            },{
                text: 'About',
                url: '/p/about',
            }
        ],
        footerMenuItems: [
            {
                text: 'About',
                url: '/p/about',
            },{
                text: 'Contact',
                url: '/p/contact',
            },{
                text: 'Terms & Conditions',
                url: '/p/terms',
            },{
                text: 'Privacy Policy',
                url: '/p/privacy',
            }
        ],
        footerSocialMenuItems: [
            {
                slug: 'realsyhomes',
                type: 'facebook',
            },{
                slug: 'realsyhomes',
                type: 'twitter',
            },{
                slug: 'realsyhomes',
                type: 'instagram',
            }
        ],
        newsletterSignUpText: 'Subscribe to our newsletter',
        chatButtonText: 'Chat with Us!'
    }
};

/**
 * Wraps a given page in the main layout
 * @param page
 * @param globalContent
 * @returns {*}
 */
export const useMainLayout = (page, {globalContent = {}} = {}) => {
    if (!globalContent) {
        globalContent = MainLayout.defaultProps.globalContent;
    }

    if (!globalContent.mainMenuItems || globalContent.mainMenuItems.length < 1) {
        globalContent.mainMenuItems = MainLayout.defaultProps.globalContent.mainMenuItems;
    }
    if (!globalContent.footerMenuItems || globalContent.footerMenuItems.length < 1) {
        globalContent.footerMenuItems = MainLayout.defaultProps.globalContent.footerMenuItems;
    }
    if (!globalContent.footerSocialMenuItems || globalContent.footerSocialMenuItems.length < 1) {
        globalContent.footerSocialMenuItems = MainLayout.defaultProps.globalContent.footerSocialMenuItems;
    }
    if (!globalContent.chatButtonText || globalContent.chatButtonText.trim().length < 1) {
        globalContent.chatButtonText = MainLayout.defaultProps.globalContent.chatButtonText;
    }
    if (!globalContent.newsletterSignUpText || globalContent.newsletterSignUpText.trim().length < 1) {
        globalContent.newsletterSignUpText = MainLayout.defaultProps.globalContent.newsletterSignUpText;
    }

    return <MainLayout
        title={page.props.title}
        globalContent={globalContent}
        hideFooter={page.props.hideSiteFooter}
    >
        {page}
    </MainLayout>
};

export default MainLayout;
