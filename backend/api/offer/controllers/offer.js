import {Logger} from 'api/logging';
import {AppEventCodes} from "api/app-events/app-event-codes";
import {OfferStatuses} from "api/offer/offer-statuses";
import {AppEventsService} from "api/app-events/app-events-service";

const logger = Logger('offers-controller');

/**
 * Offers controller
 * Provides extra actions related to offers
 */
module.exports = {
    /**
     * Gets offers sent by the authenticated user
     */
    async getSent(ctx) {
        const userId = ctx.state.user?.id;
        if (!userId) {
            return ctx.send([]);
        }
        const offers = await strapi.query('offer', '').find(
            {offeror: userId},
            ['listing']
        );
        return ctx.send(offers);
    },

    /**
     * Gets the authenticated user's pending sent offers
     * @param ctx
     * @returns {Promise<void>}
     */
    async getSentPending(ctx) {
        const userId = ctx.state.user.id;
        const offers = await strapi.query('offer', '').find(
            {
                offeror: userId,
                status_in: ['pending_realsy', 'pending_lister', 'countered'],
            }
        );
        return ctx.send(offers);
    },

    /**
     * Accepts an offer if for the authenticated user
     */
    async accept(ctx) {
        const userId = ctx.state.user.id;
        const offerId = ctx.request.body.offerId;
        if (!offerId) {
            return ctx.badRequest('offerId must be supplied');
        }
        const offer = await strapi.query('offer', '').findOne({id: offerId});

        // only allow lister or offeror
        if (offer.listing.owner !== userId && offer.offeror.id !== userId) {
            logger.warn({
                message: 'Attempted offer acceptance by non-included user',
                offer: offerId,
                userId,
            });
            return ctx.unauthorized("You are not allowed to perform this action.");
        }

        if (userId === offer.listing.owner) {
            // lister accepting an offer or re-counter
            if (offer.status !== 'pending_lister') {
                return ctx.unauthorized("Cannot accept an offer that is not awaiting your action");
            }
            const updatedOffer = await strapi.query('offer', '').update(
                {id: parseInt(offerId)},
                {status: 'accepted'}
            );
            logger.info({
                message: 'Offer accepted by listing owner',
                offer: offerId,
                userId,
            });
            ctx.send(updatedOffer);
        } else if (userId === offer.offeror.id) {
            // offeror accepting a counter
            if (offer.status !== 'countered') {
                return ctx.unauthorized("Cannot accept an offer that is not awaiting your action");
            }
            const updatedOffer = await strapi.query('offer', '').update(
                {id: ctx.request.body.offerId},
                {status: 'accepted'}
            );
            logger.info({
                message: 'Counter-offer accepted by offeror',
                offer: ctx.request.body.offerId,
                userId,
            });
            ctx.send(updatedOffer);
        } else {
            // should never end up here
            logger.error('Reached unused else block in offer.accept controller method');
            return ctx.unauthorized("Cannot accept an offer that is not awaiting your action");
        }
    },

    /**
     * Declines an offer if for the authenticated user
     */
    async decline(ctx) {
        const userId = ctx.state.user.id;
        const offer = await strapi.query('offer', '').findOne({id: ctx.request.body.offerId});

        // only allow lister or offeror
        if (offer.listing.owner !== userId && offer.offeror.id !== userId) {
            logger.warn({
                message: 'Attempted offer decline by non-involved user',
                offer: ctx.request.body.offerId,
                userId,
            });
            return ctx.unauthorized("You are not allowed to perform this action.");
        }

        if (userId === offer.listing.owner) {
            // lister declining offer or re-counter
            if (offer.status !== 'pending_lister') {
                return ctx.unauthorized("Cannot decline an offer that is not awaiting your action");
            }
            const updatedOffer = await strapi.query('offer', '').update(
                {id: ctx.request.body.offerId},
                {status: 'declined'}
            );
            logger.info({
                message: 'Offer decline by owner',
                offer: ctx.request.body.offerId,
                userId,
            });
            ctx.send(updatedOffer);
        }
        else if (userId === offer.offeror.id) {
            // offeror declining a counter
            if (offer.status !== 'countered') {
                return ctx.unauthorized("Cannot decline an offer that is not awaiting your action");
            }
            const updatedOffer = await strapi.query('offer', '').update(
                {id: ctx.request.body.offerId},
                {status: 'declined'}
            );
            logger.info({
                message: 'Counter-offer declined by offeror',
                offer: ctx.request.body.offerId,
                userId,
            });
            ctx.send(updatedOffer);
        }
        else {
            // should never end up here
            logger.error('Reached unused else block in offer.decline controller method');
            return ctx.unauthorized("Cannot decline an offer that is not awaiting your action");
        }
    },

    /**
     * Sends a counter offer
     */
    async counter(ctx) {
        const amount = ctx.request.body.amount;
        const closingDate = ctx.request.body.closingDate;
        if (!amount || !closingDate) {
            return ctx.badRequest('amount and closingDate must be supplied');
        }

        const userId = ctx.state.user.id;
        const offer = await strapi.query('offer', '').findOne({id: ctx.request.body.offerId});
        if (offer.listing.owner !== userId && offer.offeror.id !== userId) {
            logger.warn(`Attempted offer counter by non-included user (offer: ${ctx.request.body.offerId}, user: ${userId})`);
            return ctx.unauthorized("You are not allowed to perform this action.");
        }

        if (userId === offer.listing.owner) {
            // counter by listing owner
            if (offer.status !== 'pending_lister') {
                return ctx.unauthorized("Cannot decline an offer that is not awaiting your action");
            }

            let counterOffers = offer.counterOffers;
            counterOffers.push({
                user: userId,
                datetime: new Date(),
                amount: ctx.request.body.amount,
                closingDate: ctx.request.body.closingDate,
                closingCostsPaid: ctx.request.body.closingCostsPaid,
                notes: ctx.request.body.notes
            });
            const updatedOffer = await strapi.query('offer', '').update(
                {id: ctx.request.body.offerId},
                {
                    status: OfferStatuses.Countered,
                    amount: ctx.request.body.amount,
                    counterOffers
                }
            );

            logger.info({
                message: 'Offer countered by owner',
                offer: ctx.request.body.offerId,
                userId,
            });
            ctx.send(updatedOffer);
        }
        else if (userId === offer.offeror.id) {
            // recounter by original offeror
            if (offer.status !== 'countered') {
                return ctx.unauthorized("Cannot decline an offer that is not awaiting your action");
            }

            let counterOffers = offer.counterOffers;
            counterOffers.push({
                user: userId,
                datetime: new Date(),
                amount: ctx.request.body.amount,
                closingDate: ctx.request.body.closingDate,
                closingCostsPaid: ctx.request.body.closingCostsPaid,
                notes: ctx.request.body.notes
            });
            const updatedOffer = await strapi.query('offer', '').update({id: ctx.request.body.offerId},
                {
                    status: 'pending_lister',
                    amount: ctx.request.body.amount,
                    counterOffers
                }
            );

            logger.info({
                message: 'Counter-offer re-countered by offeror',
                offer: ctx.request.body.offerId,
                userId,
            });
            await AppEventsService.fire(AppEventCodes.OfferRecountered, offer.id);
            ctx.send(updatedOffer);
        }
        else {
            // should never end up here
            logger.error('Reached unused else block in offer.counter controller method');
            return ctx.unauthorized("Cannot counter an offer that is not awaiting your action");
        }
    }
};
