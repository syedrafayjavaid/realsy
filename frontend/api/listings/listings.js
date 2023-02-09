import UserProfile from 'api/user-profile';
import {ApiClient} from "api/api-client";
import {ApiRoutes} from "api/api-routes";

const LISTINGS_ENDPOINT = '/listings';

/**
 * Listings functions
 */
const Listings = {
    LISTINGS_ENDPOINT,
    getListingMainPhotoUrl,
    getSaved,
    createListing,
    findListingsWithinGeographicBounds,
    getOwnedListings,
    getListing,
    favoriteListing,
    checkListingFavorite,
    getHomeValue,
    createOffer,
    acceptOffer,
    declineOffer,
    counterOffer,
    getOffers,
    getSentOffers,
    getSentPendingOffers,
    checkOffer,
    checkVisitRequest,
    markTip,
    calculateSavings,
};
export default Listings;

/**
 * Gets the main photo URL for a given listing
 * @param listingId
 * @param format
 * @returns {string}
 */
function getListingMainPhotoUrl(listingId, {format} = {format: 'medium'}) {
    return ApiRoutes.BaseUrl + `/listings/${listingId}/main-photo?format=${format}`;
}

/**
 * Gets the authenticated user's saved listings
 * @returns {Promise<{listings: any, success: boolean}>}
 */
async function getSaved() {
    const apiResponse = await ApiClient.get('/listings/my-saved');
    const responseData = apiResponse.data;
    return {
        success: apiResponse.status === 200,
        listings: responseData
    }
}

/**
 * Creates a new listing, owned by the authenticated user
 * @param listing
 * @returns {Promise<{success: boolean, listing: any}>}
 */
async function createListing(listing) {
    try {
        const apiResponse = await ApiClient.post(LISTINGS_ENDPOINT, listing);
        const responseData = apiResponse.data;
        return {
            success: true,
            listing: responseData
        };
    }
    catch (e) {
        return {
            success: false,
            errorCode: e.response.data.message,
        };
    }
}

/**
 * Gets listings within given geographic bounds
 * @param minLatitude
 * @param minLongitude
 * @param maxLatitude
 * @param maxLongitude
 * @param sortString
 * @param filterString
 * @returns {Promise<{listings: *, success: *}>}
 */
async function findListingsWithinGeographicBounds({minLatitude, minLongitude, maxLatitude, maxLongitude}, sortString = '', filterString = '') {
    let queryString = `?status_in=active&status_in=sale_pending&latitude_gte=${minLatitude}&latitude_lte=${maxLatitude}&longitude_gte=${minLongitude}&longitude_lte=${maxLongitude}`
        + filterString;
    if (sortString !== '') {
        queryString += `&_sort=${sortString}`;
    }

    const apiResponse = await ApiClient.get(LISTINGS_ENDPOINT  + queryString);
    const responseData = apiResponse.data;
    return {
        success: apiResponse.status === 200,
        listings: responseData
    };
}


/**
 * Gets an authenticated user's owned listings
 * @returns {Promise<{listings: any, success: boolean}>}
 */
async function getOwnedListings() {
    const profileResponse = await UserProfile.getProfile();
    const apiResponse = await ApiClient.get(LISTINGS_ENDPOINT + `?owner=${profileResponse.profile.id}`);
    const responseData = apiResponse.data;
    return {
        success: apiResponse.status === 200,
        listings: responseData
    };
}

/**
 * Gets a single listing by ID
 * @param listingId
 * @returns {Promise<{success: boolean, listing: any}>}
 */
async function getListing(listingId) {
    const apiResponse = await ApiClient.get(LISTINGS_ENDPOINT + `/${listingId}`);
    const responseData = apiResponse.data;
    return {
        success: apiResponse.status === 200,
        listing: responseData
    }
}

/**
 * Favorites a listing
 * @param listingId
 * @param favorite
 * @returns {Promise<{savedListings: any, success: boolean}>}
 */
async function favoriteListing(listingId, favorite = true) {
    const apiResponse = await ApiClient.put('/listings/set-favorite', {
        listingId,
        favorite: favorite ? 'true' : 'false',
    });
    const responseData = apiResponse.data;
    return {
        success: apiResponse.status === 200,
        savedListings: responseData,
    };
}

/**
 * Checks if a listing is favorited
 * @param listingId
 * @returns {Promise<{success: boolean, favorited: boolean}>}
 */
async function checkListingFavorite(listingId) {
    const apiResponse = await ApiClient.get('/listings/check-favorite', {
        params: {listingId}
    });
    const responseData = apiResponse.data;
    return {
        success: apiResponse.status === 200,
        favorited: responseData.favorited
    }
}

/**
 * Gets a home valuation
 * @param address
 * @param address2
 * @param city
 * @param state
 * @param zipCode
 * @param overrides
 * @returns {Promise<any>}
 */
async function getHomeValue({address, address2, city, state, zipCode}, overrides = {}) {
    const valuationResponse = await ApiClient.get('/listings/check-value', {
        params: { address, address2, city, state, zipCode, ...overrides }
    });
    console.log(overrides);
    return {
        success: valuationResponse.data.success,
        valuation: valuationResponse.data.result,
    };
}

/**
 * Makes an offer on a home
 */
async function createOffer(offer) {
    const apiResponse = await ApiClient.post('/offers', offer);
    const responseData = apiResponse.data;
    return {
        success: apiResponse.status === 200,
        offer: responseData
    }
}

/**
 * Accepts an offer
 */
async function acceptOffer(offerId) {
    try {
        const apiResponse = await ApiClient.put('/offers/accept', {offerId});
        const responseData = apiResponse.data;
        return {
            success: apiResponse.status === 200,
            offer: responseData
        }
    }
    catch (e) {
        return { success: false };
    }
}

/**
 * Declines an offer
 */
async function declineOffer(offerId) {
    try {
        const apiResponse = await ApiClient.put('/offers/decline', {offerId});
        const responseData = apiResponse.data;
        return {
            success: apiResponse.status === 200,
            offer: responseData
        }
    }
    catch (e) {
        return { success: false };
    }
}

/**
 * Counters an offer
 */
async function counterOffer({offerId, amount, closingDate, closingCostsPaid, notes}) {
    try {
        const apiResponse = await ApiClient.post('/offers/counter', {
            offerId,
            amount,
            closingDate,
            closingCostsPaid,
            notes,
        });
        const responseData = apiResponse.data;
        return {
            success: apiResponse.status === 200,
            offer: responseData
        }
    }
    catch (e) {
        return { success: false };
    }
}

/**
 * Gets offers for a given listing
 * @param listingId
 * @returns {Promise<{offers: any, success: boolean}>}
 */
async function getOffers(listingId) {
    const apiResponse = await ApiClient.get('/listings/get-offers', {
        params: { listingId }
    });
    const responseData = apiResponse.data;
    return {
        success: apiResponse.status === 200,
        offers: responseData
    }
}

/**
 * Gets all offers sent by the currently authenticated user
 * @returns {Promise<{offers: any, success: boolean}>}
 */
async function getSentOffers() {
    const apiResponse = await ApiClient.get(`/offers/sent`);
    const responseData = apiResponse.data;
    return {
        success: apiResponse.status === 200,
        offers: responseData,
    }
}

/**
 * Gets pending offers sent by the currently authenticated user
 * @returns {Promise<{offers: any, success: boolean}>}
 */
async function getSentPendingOffers() {
    const apiResponse = await ApiClient.get(`/offers/sent-pending`);
    const responseData = apiResponse.data;
    return {
        success: apiResponse.status === 200,
        offers: responseData,
    }
}

/**
 * Checks for an offer on a given listing from the authenticated user
 * @param listingId
 * @returns {Promise<{offer: (null|Validator<NonNullable<Object>>), success: boolean, hasActiveOffer: boolean}>}
 */
async function checkOffer(listingId) {
    const apiResponse = await ApiClient.get('/listings/check-offer', {
        params: { listingId }
    });
    const responseData = apiResponse.data;
    return {
        success: apiResponse.status === 200,
        offer: responseData.offer,
        hasActiveOffer: responseData.offer !== null
    }
}

/**
 * Checks for an unprocessed visit request on a given listing from the authenticated user
 * @param listingId
 */
async function checkVisitRequest(listingId) {
    const apiResponse = await ApiClient.get('/listings/check-visit-request', {
        params: { listingId }
    });
    const responseData = apiResponse.data;
    return {
        success: apiResponse.status === 200,
        result: responseData,
        listing: responseData.listing,
        hasPendingRequest: responseData.visitRequest !== null
    }
}

/**
 * Sets a listing tip as complete/incomplete
 * @param listingId
 * @param tipId
 * @param complete
 * @returns {Promise<{success: boolean}>}
 */
async function markTip(listingId, tipId, complete) {
    const apiResponse = await ApiClient.put('/listings/mark-tip', {
        listingId, tipId, complete
    });
    const responseData = apiResponse.data;
    return {
        success: apiResponse.status === 200,
        newTips: responseData
    }
}

/**
 * Calculates the potential savings for a given listing price
 * @param listingPrice
 * @returns {number}
 */
function calculateSavings(listingPrice) {
    return (listingPrice * .06) - 2800
}
