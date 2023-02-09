import {Logger} from "api/logging";

const logger = Logger('scheduled-events-controller');

/**
 * Scheduled Events controller
 * Provides extra actions related to scheduled events
 */
module.exports = {
    /**
     * Finds scheduled events for the authenticated user
     */
    async findMine(ctx) {
        const userId = ctx.state.user.id;
        const queryParams = new URLSearchParams(ctx.request.query);

        logger.info({
            message: `Finding scheduled events for user`,
            userId,
        });

        try {
            const events = await strapi.query('scheduled-event', '').find(
                {
                    user: userId,
                    datetime_gte: queryParams.get('earliestDate'),
                    datetime_lte: queryParams.get('latestDate'),
                },
                ['listing']
            );

            const ownedListingEvents = await strapi.query('scheduled-event', '').find(
                {
                    'listing.owner': userId,
                    datetime_gte: queryParams.get('earliestDate'),
                    datetime_lte: queryParams.get('latestDate'),
                },
                ['listing'],
            );

            ctx.send(events.concat(ownedListingEvents));
        }
        catch (e) {
            logger.error({
                message: 'Error finding scheduled events for user',
                errorMessage: e.message,
                stack: e.stack,
            });
        }
    },

    /**
     * Finds scheduled events the user has requested, but are not yet scheduled
     */
    async findMyRequested(ctx) {
        const userId = ctx.state.user.id;
        const queryParams = new URLSearchParams(ctx.request.query);

        const events = await strapi.query('scheduled-event', '').find({
            user: userId,
            status: 'pending_realsy',
        },
            [ 'listing' ]
        );

        const ownedListingEvents = await strapi.query('scheduled-event', '').find(
            {
                'listing.owner': userId,
                status: 'pending_realsy',
            },
            ['listing'],
        );

        ctx.send(events.concat(ownedListingEvents));
    },

    /**
     * Create a new visit request
     */
    async requestVisit(ctx) {
        const listing = await strapi.query('listing', '').findOne({id: ctx.request.body.listingId}, ['owner']);
        if (!listing) {
            return ctx.send({});
        }
        const requesterProfile = await strapi.query('user', 'users-permissions').findOne({id: ctx.state.user.id});
        const eventData = {
            user: ctx.state.user.id,
            listing: ctx.request.body.listingId,
            status: 'pending_realsy',
            type: 'requested_visit',
            userAvailability: {
                sundayStart: requesterProfile.availableSundayStart,
                sundayEnd: requesterProfile.availableSundayEnd,
                mondayStart: requesterProfile.availableMondayStart,
                mondayEnd: requesterProfile.availableMondayEnd,
                tuesdayStart: requesterProfile.availableTuesdayStart,
                tuesdayEnd: requesterProfile.availableTuesdayEnd,
                wednesdayStart: requesterProfile.availableWednesdayStart,
                wednesdayEnd: requesterProfile.availableWednesdayEnd,
                thursdayStart: requesterProfile.availableThursdayStart,
                thursdayEnd: requesterProfile.availableThursdayEnd,
                fridayStart: requesterProfile.availableFridayStart,
                fridayEnd: requesterProfile.availableFridayEnd,
                saturdayStart: requesterProfile.availableSaturdayStart,
                saturdayEnd: requesterProfile.availableSaturdayEnd,
            },
        };
        if (listing.owner) {
            eventData.listerAvailability = {
                sundayStart: listing.owner.availableSundayStart,
                sundayEnd: listing.owner.availableSundayEnd,
                mondayStart: listing.owner.availableMondayStart,
                mondayEnd: listing.owner.availableMondayEnd,
                tuesdayStart: listing.owner.availableTuesdayStart,
                tuesdayEnd: listing.owner.availableTuesdayEnd,
                wednesdayStart: listing.owner.availableWednesdayStart,
                wednesdayEnd: listing.owner.availableWednesdayEnd,
                thursdayStart: listing.owner.availableThursdayStart,
                thursdayEnd: listing.owner.availableThursdayEnd,
                fridayStart: listing.owner.availableFridayStart,
                fridayEnd: listing.owner.availableFridayEnd,
                saturdayStart: listing.owner.availableSaturdayStart,
                saturdayEnd: listing.owner.availableSaturdayEnd
            };
        }
        const createResult = await strapi.query('scheduled-event', '').create(eventData);
        ctx.send(createResult);
    }
};
