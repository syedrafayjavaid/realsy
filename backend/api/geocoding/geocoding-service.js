import axios from 'axios';
import {Logger} from "api/logging";
import {ConfigKey} from "config/config-keys";

const logger = Logger('geocoding-service');

export const GeoCodingService = {
    /**
     * Geocodes an address
     * @param address
     * @returns {Promise<{lng: (number|Validator<NonNullable<number>>), lat: (number|Validator<NonNullable<number>>)}>}
     */
    async geoCodeAddress(address) {
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env[ConfigKey.googleMapsApiKey]}`);
            const data = response.data;
            if (data.results && data.results.length && data.results.length > 0) {
                logger.trace({
                    message: 'Geocoded address',
                    address,
                    data
                });
                return {
                    lat: data.results[0].geometry.location.lat,
                    lng: data.results[0].geometry.location.lng
                };
            } else {
                logger.warn({
                    message: 'Failed to geocode address',
                    address,
                    response: data,
                });
            }
        }
        catch (e) {
            logger.error({
                message: `Error geocoding address`,
                errorMessage: e.message,
                stack: e.stack,
            });
        }
    },
};
