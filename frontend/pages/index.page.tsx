import * as React from 'react';
import {useMainLayout} from "layout/main-layout";
import {NotificationManager} from 'react-notifications';
import {useEffect} from "react";
import {useHomePageStyles} from "./index.page.styles";
import {CmsClient} from "cms/cms-client";
import Head from "next/head";
import {AppInfo} from "app-info";
import {CmsRoutes} from "cms/cms-routes";
import {CmsTransformedContent} from "components/cms-transformed-content/cms-transformed-content";
import {NextPageContext} from "next";
import {AppPage} from "pages/app-page.type";
import {
    CmsHeroSectionDto,
    CmsRichBodyTextDto,
    CmsSavingsSliderDto,
    CmsUserGuideBoxDto
} from "cms/cms-content-item-types";

/**
 * The home page
 */

type HomePageProps = {
    htmlTitle?: string,
    bodyContent?: (CmsSavingsSliderDto | CmsUserGuideBoxDto | CmsHeroSectionDto | CmsRichBodyTextDto)[],
    failedSignUp?: boolean,
    userNotification?: string,
};

const HomePage: AppPage<HomePageProps> = (props) => {
    const styleClasses = useHomePageStyles();

    useEffect(() => {
        if (props.failedSignUp) {
            NotificationManager.error(props.userNotification ? props.userNotification : null, 'Failed sign up');
        }
    }, []);

    return (
        <>
            <Head>
                <title>{AppInfo.name}: {props.htmlTitle ?? AppInfo.defaultPageTitle}</title>
            </Head>
            <div
                data-testid={'main-content'}
                className={styleClasses.homePage}
            >
                <CmsTransformedContent contentItems={props.bodyContent ?? []}/>
            </div>
        </>
    );
};

HomePage.getInitialProps = async (ctx: NextPageContext) => {
    const homePageResponse = await CmsClient.get(`${CmsRoutes.contentPage}/homepage`);
    const homePageData = homePageResponse.data;

    return {
        htmlTitle: homePageData.htmlTitle,
        bodyContent: homePageData.bodyContent,

        // failed oauth sign ups redirect here with query params
        // check for these params and notify user if present
        failedSignUp: ctx.query.failedSignUp === 'true',
        userNotification: ctx.query.message
            ? typeof ctx.query.message === 'string'
                ? ctx.query.message.replace(/\+/g, ' ')
                : ctx.query.message[0].replace(/\+/g, ' ')
            : undefined,
    };
};

HomePage.defaultLayout = useMainLayout;
export default HomePage;
