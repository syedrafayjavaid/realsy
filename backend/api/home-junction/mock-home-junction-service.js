/**
 * Provides a mocked interface to the Home Junction API
 * (useful for local testing)
 */
export class MockHomeJunctionService {
    /**
     * Gets a mocked home value
     *
     * Overrides for bedroom and bathrooms counts can be provided to alter the valuation, same as
     * the real HomeJunction API.
     *
     * @param deliveryLine - the "street address"
     * @param city
     * @param state
     * @param zipCode
     * @param overrideBathroomCount
     * @param overrideBedroomCount
     * @returns {Promise<HomeJunctionValuationResponse>}
     */
    async getHomeValue(deliveryLine, city, state, zipCode, {overrideBathroomCount = null, overrideBedroomCount = null} = {}) {
        const bedroomCount = overrideBedroomCount ?? 2;
        const bathroomCount = overrideBathroomCount ?? 2;

        return Promise.resolve({
            success: true,
            result: {
                "valuations": {
                    "general": {
                        "EMV": 162250 + (bedroomCount * 5000) + (bathroomCount * 3000),
                        "low": 155760 + (bedroomCount * 5000) + (bathroomCount * 3000),
                        "high": 168740 + (bedroomCount * 5000) + (bathroomCount * 3000),
                        "accuracy": 4
                    },
                    "default": {
                        "EMV": 162250 + (bedroomCount * 5000) + (bathroomCount * 3000),
                    },
                },
                "address": {
                    deliveryLine,
                    city,
                    state,
                    zip: zipCode,
                    street: deliveryLine,
                },
                "coordinates": {
                    "latitude": 41.244162,
                    "longitude": -95.980225
                },
                "attributes": {
                    "id": "d75774908456b08eee87a2580c328c68",
                    "beds": bedroomCount,
                    "baths": bathroomCount,
                    "size": 1379,
                    "lotSize": {
                        "sqft": 5200,
                        "acres": 0.12
                    },
                    "stories": 1,
                    "yearBuilt": 1927,
                    "taxValue": 192300,
                    "taxes": 4129,
                    "apn": "2331080000",
                    "propertyType": "Single-Family",
                    "county": "Douglas"
                },
            }
        });
    }
}
