import Listings from "api/listings";
import * as faker from "faker";
import {storeApiToken} from "api/auth/auth-functions";

/**
 * Creates a listing for use in tests
 * @param apiToken
 * @returns {Promise<any>}
 */
export async function createListing(apiToken) {
    storeApiToken(apiToken);
    const result = await Listings.createListing({
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        zipCode: faker.address.zipCode('#####'),
        askingPrice: 150000
    });
    return result.listing;
}
