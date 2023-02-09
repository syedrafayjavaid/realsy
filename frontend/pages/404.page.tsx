import * as React from 'react';
import {useMainLayout} from 'layout/main-layout';
import Dimensions from "styles/dimensions";
import Colors from "styles/colors";
import {AppPage} from "pages/app-page.type";

/**
 * 404 "not found" page
 */
const NotFoundPage: AppPage = () => {
    return (
        <div style={{paddingTop: 20, paddingLeft: Dimensions.defaultPageMargin}}>
            <h1>Nothing Here</h1>
            <p>We couldn't find what you were looking for...</p>
            <p><a style={{color: Colors.darkBlue}} href='/'>Go to the homepage</a></p>
        </div>
    );
};

NotFoundPage.defaultLayout = useMainLayout;
export default NotFoundPage;
