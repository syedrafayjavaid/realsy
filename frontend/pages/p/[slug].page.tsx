import * as React from 'react';
import {useMainLayout} from "layout/main-layout";
import {useStyles} from "./[slug].page.styles";
import {CmsClient} from "cms/cms-client";
import {AppInfo} from "app-info";
import Head from "next/head";
import {CmsRoutes} from "cms/cms-routes";
import {CmsTransformedContent} from "components/cms-transformed-content/cms-transformed-content";
import {AppPage} from "pages/app-page.type";

/**
 * A dynamic page handler for pages fetched from the CMS.
 */

export type CmsPageProps = {
    title?: string,
    htmlTitle?: string,
    bodyContent: [],
};

const CmsPage: AppPage<CmsPageProps> = (props) => {
    const styleClasses = useStyles();
    return (
        <>
            <Head>
                <title>{AppInfo.name}: {props.htmlTitle ?? props.title ?? AppInfo.defaultPageTitle}</title>
            </Head>
            <div className={styleClasses.contentPage} data-testid={'main-content'}>
                <h1 className={styleClasses.title}>{props.title}</h1>
                {props.bodyContent &&
                    <CmsTransformedContent contentItems={props.bodyContent}/>
                }
            </div>
        </>
    );
}


CmsPage.getInitialProps = async (context) => {
    const pageResponse = await CmsClient.get(`${CmsRoutes.contentPage}/${context.query.slug}`);
    const page = pageResponse.data;
    return {
        title: page.title,
        htmlTitle: page.htmlTitle,
        bodyContent: page.bodyContent,
        layoutFunc: useMainLayout,
    }
};

CmsPage.defaultLayout = useMainLayout;
export default CmsPage;
