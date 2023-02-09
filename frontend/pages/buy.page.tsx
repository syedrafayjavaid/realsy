import * as React from 'react';
import ListingsMap from 'components/listings/map';
import {useMainLayout} from "layout/main-layout";

/**
 * The "buy" page
 */
const BuyPage = () => {
    return <ListingsMap />;
}

/**
 * Props
 */
BuyPage.defaultProps = {
    hideSiteFooter: true,
    title: 'Search Listings'
};

BuyPage.defaultLayout = useMainLayout;
export default BuyPage;
