import {ListingStatuses} from "api/listing/listing-statuses";

/**
 * Listings service
 * Provides functions related to app listings
 */
module.exports = {
    /**
     * Checks if an active (or pending admin) listing for the given address exists
     * @param address
     * @param address2
     * @param city
     * @param state
     * @param zipCode
     * @returns {Promise<boolean>}
     */
    async openListingExistsForAddress({address, address2, city, state, zipCode}) {
        const existingListingCount = await strapi.query('listing', '').count({
            address,
            address2,
            city,
            state,
            zipCode,
            status_ne: ListingStatuses.Closed,
        });
        return existingListingCount > 0;
    },

    /**
     * Finds listings with no relations (for improved performance)
     * @param params
     * @returns {Promise<*>}
     */
    async relationlessFind(params) {
        return strapi.query('listing', '').find(params, []);
    },
};
