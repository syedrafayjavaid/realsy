import {Logger} from "api/logging";
import {ListingStatuses} from "api/listing/listing-statuses";
import {ConfigKey} from "config/config-keys";
import {AppEventCodes} from "api/app-events/app-event-codes";
import {GeoCodingService} from "api/geocoding/geocoding-service";
import {AppEventsService} from "api/app-events/app-events-service";

const logger = Logger('listing-model');

export const ListingModel = {
    lifecycles: {
        async beforeCreate (data) {
            logger.trace({
                message: 'New listing being created',
                listing: data,
            });

            const activeListingExists = await strapi.services.listing.openListingExistsForAddress({
                address: data.address,
                address2: data.address2,
                city: data.city,
                state: data.state,
                zipCode: data.zipCode,
            });
            if (activeListingExists && process.env.ALLOW_DUPLICATE_LISTINGS !== 'true') {
                logger.info({
                    message: 'Not creating duplicate listing',
                    listing: data,
                });
                throw new Error('duplicate-listing');
            }

            const geoCodeResult = await GeoCodingService.geoCodeAddress(
                `${data.address} ${data.city}, ${data.state} ${data.zipCode}`
            );
            if (geoCodeResult) {
                data.latitude = geoCodeResult.lat;
                data.longitude = geoCodeResult.lng;
            }
            else {
                logger.warn({
                    message: 'Failed to geocode new listing',
                    listing: data,
                });
            }

            const appSettings = await strapi.query('app-settings', '').findOne();
            if (appSettings.listingSteps) {
                data.steps = appSettings.listingSteps;
            }
        },

        async afterCreate(result, data) {
            logger.trace({
                message: 'new listing created',
                listing: data,
                result,
            });
            await AppEventsService.fire(AppEventCodes.ListingCreated, result);
        },

        async beforeUpdate(params, data) {
            logger.trace({
                message: 'Listing updating',
                params,
                data,
            })
            const currentListing = await strapi.query('listing', '').findOne({id: params.id});
            const addressChanged = (
                (data.address && currentListing.address !== data.address)
                || (data.address2 && currentListing.address2 !== data.address2)
                || (data.city && currentListing.city !== data.city)
                || (data.state && currentListing.state !== data.state)
                || (data.zipCode && currentListing.zipCode !== data.zipCode)
            );
            if (addressChanged) {
                logger.trace({
                    message: 'Listing address updated, geocoding for new coordinates',
                    listing: currentListing,
                });
                const geoCodeResult = await GeoCodingService.geoCodeAddress(
                    `${data.address} ${data.city}, ${data.state} ${data.zipCode}`
                );
                if (geoCodeResult) {
                    data.latitude = geoCodeResult.lat;
                    data.longitude = geoCodeResult.lng;
                }
                logger.trace({
                    message: 'Listing coordinates updated',
                    listing: data
                });
            }
            if (currentListing.status === ListingStatuses.PendingRealsy && data.status === ListingStatuses.Active) {
                logger.trace({
                    message: 'Listing approved',
                    listing: data,
                });
                await AppEventsService.fire(AppEventCodes.ListingApproved, params.id);
            }
        },
    }
};

module.exports = ListingModel;
