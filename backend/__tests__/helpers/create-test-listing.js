import faker from 'faker';

/**
 * Creates a listing for use in tests, with optional faked attributes
 * @param address
 * @param address2
 * @param city
 * @param state
 * @param zipCode
 * @param ownerId
 * @return {Promise<*>}
 */
export async function createTestListing({
    address,
    address2,
    city,
    state,
    zipCode,
    ownerId = undefined,
} = {}) {
    return await strapi.query('listing', '').create({
        owner: ownerId,
        address: address ?? faker.address.streetAddress(),
        address2: address2 ?? faker.address.secondaryAddress(),
        city: city ?? faker.address.city(),
        state: state ?? faker.address.stateAbbr(),
        zipCode: zipCode ?? faker.address.zipCode('#####'),
    });
}
