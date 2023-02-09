import React from 'react';
import PropTypes from 'prop-types';
import {formatCurrency} from 'util/format-currency';
import FavoriteButton from "components/listings/favorite-button";
import Colors from "styles/colors";
import {useRouter} from "next/router";
import {useStyles} from './listing-thumbnail.styles';
import {useAuthContext} from "api/auth/auth-context";
import {useViewListingContext} from "contexts/view-listing-context";
import Listings from "api/listings";

/**
 * The small "thumbnail" view of a listing
 */
const ListingThumbnail = (props) => {
    const styleClasses = useStyles(props);
    const authContext = useAuthContext();
    const viewListingContext = useViewListingContext();
    const router = useRouter();

    const isOwned = authContext.currentUser?.id === props.listing.owner
        || authContext.currentUser?.id === props.listing.owner?.id; // owner can by object or just the ID
    const address = props.listing.address;
    const city = props.listing.city;
    const state = props.listing.state;
    const bathroomCount = props.listing.bathroomCount;
    const bedroomCount = props.listing.bedroomCount;
    const squareFootage = props.listing.squareFootage;
    const askingPrice = formatCurrency(props.listing.askingPrice, {omitDecimal: true});
    let statusText = null;
    let statusBackgroundColor = null;
    if (props.listing.status === 'closed') {
        statusText = 'Closed';
        statusBackgroundColor = Colors.darkBlue;
    }
    else if (props.listing.status === 'sale_pending') {
        statusText = 'Sale Pending';
        statusBackgroundColor = Colors.pink;
    }

    /**
     * Click handler
     */
    function handleClick() {
        if (props.linkToFullPage) {
            router.push('/account/listings/[id]', `/account/listings/${props.listing.id}`);
        }
        else {
            viewListingContext.showListing(props.listing);
        }
    }

    /**
     * Render
     */
    return (
        <div className={styleClasses.wrapper}>
            {authContext.isSignedIn && !isOwned && <FavoriteButton listingId={props.listing.id}/>}

            <div onClick={handleClick} className={styleClasses.thumbnailContainer}>
                <div
                    className={styleClasses.imageContainer}
                    style={{backgroundImage: `url("${Listings.getListingMainPhotoUrl(props.listing.id, {format: 'thumbnail'})}"`}}
                />
                {!props.horizontalLayout && statusText &&
                    <p className={styleClasses.status} style={{backgroundColor: statusBackgroundColor}}>
                        {statusText}
                    </p>
                }

                <div className={styleClasses.infoContainer} style={{backgroundColor: props.backgroundColor}}>
                    <div className={styleClasses.mainInfo}>
                        <p className={styleClasses.askingPrice}>{askingPrice}</p>
                        <div className={styleClasses.address}>
                            <p>{address}</p>
                            <p>{city}, {state}</p>
                        </div>
                    </div>
                    <ul className={styleClasses.details}>
                        <li><img src='/icon-bathroom.svg'/> {bathroomCount}</li>
                        <li><img src='/icon-bedroom.svg' style={{marginTop: 6}}/> {bedroomCount}</li>
                        <li><img src='/icon-footage.svg'/> {squareFootage}<sup>sqft</sup></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

/**
 * Props
 */
ListingThumbnail.propTypes = {
    listing: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    horizontalLayout: PropTypes.bool.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    linkToFullPage: PropTypes.bool,
    linkToSection: PropTypes.string,
};

ListingThumbnail.defaultProps = {
    horizontalLayout: false,
    backgroundColor: Colors.offWhite,
    linkToFullPage: false,
    linkToSection: '',
};

export default ListingThumbnail;
