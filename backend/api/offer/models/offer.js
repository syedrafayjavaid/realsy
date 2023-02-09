import {Logger} from "api/logging";
import {OfferStatuses} from "api/offer/offer-statuses";
import {ListingStatuses} from "api/listing/listing-statuses";
import {AppEventCodes} from "api/app-events/app-event-codes";
import {AppEventsService} from "api/app-events/app-events-service";

const logger = Logger('offer-model');

/**
 * Offer model
 * Adds lifecycle events to offers
 */
module.exports = {
    lifecycles: {
        async afterCreate(result, data) {
            logger.trace({
                message: 'New offer created',
                offer: data,
            });
            await AppEventsService.fire(AppEventCodes.OfferCreated, result.id);
        },

        async beforeUpdate(params, data) {
            logger.trace({
                message: 'Offer updating',
                offerId: params.id,
            });

            const previousOffer = await strapi.query('offer', '').findOne({id: params.id});
            const statusChanged = data.status !== previousOffer?.status;
            if (statusChanged) {
                if (data.status === OfferStatuses.Accepted) {
                    await AppEventsService.fire(AppEventCodes.OfferAccepted, params.id);

                    // if offer accepted, close the listing
                    await strapi.query('listing', '').update(
                        {id: previousOffer.listing.id},
                        {status: ListingStatuses.Closed}
                    );

                    // also decline other pending offers
                    const otherOffers = await strapi.query('offer', '').find({
                        listing: previousOffer.listing.id,
                        status_in: [
                            OfferStatuses.PendingRealsy,
                            OfferStatuses.PendingLister,
                            OfferStatuses.Countered
                        ],
                        id_ne: params.id
                    });
                    for (let i = 0; i < otherOffers.length; ++i) {
                        await strapi.query('offer', '').update(
                            {id: otherOffers[i].id},
                            {status: OfferStatuses.Declined}
                        );
                    }
                }
                else if (data.status === OfferStatuses.Declined) {
                    const previousOffer = await strapi.query('offer', '').findOne({id: params.id});
                    if (previousOffer.status === OfferStatuses.PendingLister) {
                        await AppEventsService.fire(AppEventCodes.OfferDeclined, params.id);
                    }
                    else if (previousOffer.status === OfferStatuses.Countered) {
                        await AppEventsService.fire(AppEventCodes.CounterOfferDeclined, params.id);
                    }
                }
                else if (data.status === OfferStatuses.Countered) {
                    await AppEventsService.fire(AppEventCodes.OfferCountered, params.id);
                }
                else if (data.status === OfferStatuses.PendingLister) {
                    const previousOffer = await strapi.query('offer', '').findOne({id: params.id});
                    if (previousOffer.status === OfferStatuses.PendingRealsy) {
                        await AppEventsService.fire(AppEventCodes.OfferApproved, params.id);
                    }
                    else if (previousOffer.status === OfferStatuses.Countered) {
                        await AppEventsService.fire(AppEventCodes.OfferRecountered, params.id);
                    }
                }
            }
        },
    },
};
