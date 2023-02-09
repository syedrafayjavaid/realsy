import React from 'react';
import PropTypes from 'prop-types';
import {formatCurrency} from "util/format-currency";
import {useListingSummaryStyles} from "./listing-summary.styles";

/**
 * A quick summary of listing details (displayed eg. below a thumbnail photo on the map page)
 */
export default function ListingSummary(props) {
    const styleClasses = useListingSummaryStyles(props);

    return (
        <div className={`${styleClasses.listingSummary} ${props.horizontalLayout ? styleClasses.listingSummaryHorizontal : ''}`}>
            <div className={styleClasses.mainInfo}>
                <p className={styleClasses.askingPrice}>{formatCurrency(props.listing.askingPrice, {omitDecimal: true})}</p>
                <p className={styleClasses.address}>
                    {props.listing.address}<br />
                    {props.listing.city}, {props.listing.state}
                </p>
            </div>
            <div className={styleClasses.detailsContainer}>
                <ul className={styleClasses.detailsList}>
                    <li><img src='/icon-bathroom.svg'/> {props.listing.bathroomCount}</li>
                    <li><img src='/icon-bedroom.svg'/> {props.listing.bedroomCount}</li>
                    <li><img src='/icon-footage.svg'/> {props.listing.squareFootage}<sup>sqft</sup></li>
                </ul>
            </div>
        </div>
    );
}

ListingSummary.propTypes = {
    listing: PropTypes.object.isRequired,
    horizontalLayout: PropTypes.bool.isRequired,
};

ListingSummary.defaultProps = {
    listing: {},
    horizontalLayout: false
};
