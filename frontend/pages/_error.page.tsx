import * as React from 'react';
import {useMainLayout} from 'layout/main-layout';
import Dimensions from "styles/dimensions";
import {useEffect} from "react";
import * as Sentry from '@sentry/react';
import {AppPage} from "pages/app-page.type";

/**
 * Error page
 */
type ErrorPageProps = {
    error?: any,
};

const ErrorPage: AppPage<ErrorPageProps> = (props) => {
    useEffect(() => {
        if (props.error) {
            Sentry.captureException(props.error);
        }
    }, []);

    return (
        <div style={{paddingTop: 20, paddingLeft: Dimensions.defaultPageMargin}}>
            <h1>Whoops</h1>
            <p>We ran into an unexpected error</p>
            <p><a href='/'>Go to the homepage</a></p>
        </div>
    );
};

ErrorPage.defaultLayout = useMainLayout;
export default ErrorPage;
