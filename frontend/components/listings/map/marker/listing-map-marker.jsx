import React from 'react';
import PropTypes from 'prop-types';
import {useStyles} from './listing-map-marker.styles';
import {useViewListingContext} from "contexts/view-listing-context";

/**
 * A marker on the listings map
 */
const MapMarker = (props) => {
    const styleClasses = useStyles(props);
    const viewListingContext = useViewListingContext();

    return (
        <div>
            <span
                data-testid={'map-marker'}
                className={styleClasses.mapMarker}
                onClick={() => props.onClick ? props.onClick() : viewListingContext.showListing(props.listing)}
            >
                ${Math.round(props.listing.askingPrice / 1000)}K
            </span>
        </div>
    );
}

/**
 * Props
 */
MapMarker.propTypes = {
    listing: PropTypes.object.isRequired,
    onClick: PropTypes.func,
};

export default MapMarker;
