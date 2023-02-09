import React, {FC, useContext, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {clearSoftQueryParams} from "util/clear-soft-query-param";
import {pushSoftQueryParams} from "util/push-soft-query-param";
import Listings from "api/listings";
import {useAuthContext} from "api/auth/auth-context";
import {ListingDto} from "api/listings/listing.dto";
import dynamic from "next/dynamic";
import {Loader} from "components/loader";

const SingleListingModal = dynamic(() => import('components/listings/single/modal'), {
    loading: () => (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                zIndex: 999999,
            }}
        >
            <p style={{textAlign: 'center'}}>
                <Loader style={{margin: '80px auto'}} color={'#fff'} />
            </p>
        </div>
    ),
});

/**
 * View Listing Context
 * Provides a context for opening listings in a modal
 *
 * This is done to keep associated logic (eg. setting query params) in one place, while allowing listings to
 * be opened from anywhere in the app.
 */

interface ViewListingContextInterface {
    showListing: (listing: ListingDto) => any,
}

export const ViewListingContext = React.createContext<ViewListingContextInterface>({
    showListing: () => {},
});

export const ViewListingContextProvider: FC = (props) => {
    const router = useRouter();
    const authContext = useAuthContext();
    const [viewedListing, setViewedListing] = useState<ListingDto | undefined>(undefined);

    /**
     * Viewed Listing ID query param changed effect
     * This allows opening a listing by pushing the ID to the query string
     */
    useEffect(() => {
        (async function() {
            if (router.query.viewedListingId && !viewedListing) {
                const listingResponse = await Listings.getListing(router.query.viewedListingId);
                listingResponse.success && setViewedListing(listingResponse.listing);
            }
            else if (!router.query.viewedListingId) {
                setViewedListing(undefined);
            }
        })();
    }, [router.query.viewedListingId]);

    /**
     * Viewed Listing changed effect
     * Handles opening/closing the modal for the listing
     */
    useEffect(() => {
        if (viewedListing) {
            if (authContext.isSignedIn) {
                // check for accepted offer and send user to full page if there is one
                Listings.checkOffer(viewedListing.id).then(existingOfferResult => {
                    if (existingOfferResult.offer?.status === 'accepted') {
                        router.push(`/account/listings/${viewedListing.id}`);
                    }
                });
            }
            if (!router.query.viewedListingId) {
                pushSoftQueryParams({viewedListingId: viewedListing.id}, router);
            }
        }
    }, [viewedListing]);

    /**
     * Render
     */
    return (
        <ViewListingContext.Provider
            value={{
                showListing: listing => setViewedListing(listing)
            }}
        >
            {viewedListing &&
                <SingleListingModal
                    listing={viewedListing}
                    onClose={() => {
                        setViewedListing(undefined);
                        clearSoftQueryParams(['viewedListingId', 'listingSection'], router);
                    }}
                />
            }
            {props.children}
        </ViewListingContext.Provider>
    );
};

export const useViewListingContext = () => useContext(ViewListingContext);
