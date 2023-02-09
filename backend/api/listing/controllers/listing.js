import {parseMultipartData} from "strapi-utils";
import sanitizeEntity from "strapi-utils/lib/sanitize-entity";
import {HomeJunctionServiceFactory} from "api/home-junction/home-junction-service-factory";

/**
 * Listings controller
 * Provides extra actions related to listings
 */
module.exports = {
    async create(ctx) {
        try {
            let entity;
            if (ctx.is('multipart')) {
                const {data, files} = parseMultipartData(ctx);
                entity = await strapi.query('listing', '').create(data, {files});
            } else {
                entity = await strapi.query('listing', '').create(ctx.request.body);
            }
            return sanitizeEntity(entity, {model: strapi.models.listing});
        }
        catch (e) {
            if (e.message === 'duplicate-listing') {
                return ctx.send({
                    error: true,
                    message: e.message,
                });
            }
            else {
                throw e;
            }
        }
    },

    /**
     * Returns search results without relations for optimized querying
     */
    async relationlessFind(ctx) {
        return strapi.services.listing.relationlessFind(ctx.query);
    },

    /**
     * Redirects to a listings main photo
     */
    async getMainPhoto(ctx) {
        let format = ctx.request.query.format || 'medium';
        const listingId = parseInt(ctx.params.id);
        let listing = null;
        if (listingId) {
            listing = await strapi.query('listing', '').findOne({id: ctx.params.id}, ['photos']);
        }
        if (listing && listing.photos?.length > 0) {
            return ctx.redirect(listing.photos?.[0]?.formats?.[format]?.url || listing.photos?.[0]?.url);
        }
        else {
            // listing has no photos -- try default configured in admin
            const defaultListingPhoto = (await strapi.query('global-content', '').find())?.defaultListingPhoto;
            if (defaultListingPhoto) {
                return ctx.redirect(defaultListingPhoto?.formats?.[format]?.url || defaultListingPhoto?.url);
            }
            else {
                // no default photo configured in admin, use static file
                return ctx.redirect('/default-listing-photo.jpg');
            }
        }
    },

    /**
     * Gets the authenticated user's saved listings
     * @param ctx
     * @returns {Promise<void>}
     */
    async getMySaved(ctx) {
        const userId = ctx.state.user.id;
        const user = await strapi.query('user', 'users-permissions').findOne(
            { id: userId },
            [
                'savedListings',
                'savedListings.images',
                'savedListings.owner',
                'savedListings.scheduledEvents',
                'savedListings.photos'
            ]
        );
        ctx.send(user.savedListings);
    },

    /**
     * Sets or unsets favorite status for a listing
     */
    async setFavorite(ctx) {
        const userId = ctx.state.user.id;
        const favorite = ctx.request.body.favorite;
        const listingId = ctx.request.body.listingId;
        const user = await strapi.query('user', 'users-permissions').findOne({ id: userId });

        let newSavedListings = user.savedListings;
        if (favorite === 'true') {
            newSavedListings.push(listingId);
        }
        else {
            newSavedListings = newSavedListings.filter(listing => {
                return listing.id.toString() !== listingId.toString();
            });
        }

        const result = await strapi.query('user', 'users-permissions').update(
            {id: userId},
            {savedListings: newSavedListings}
        );

        ctx.send(result.savedListings);
    },

    /**
     * Checks favorite status of a listing
     * @param ctx
     * @returns {Promise<void>}
     */
    async checkFavorite(ctx) {
        const userId = ctx.state.user.id;
        const listingId = ctx.query.listingId;
        const user = await strapi.query('user', 'users-permissions').findOne({ id: userId });
        return ctx.send({
            listingId,
            favorited: user.savedListings.some(savedListing => savedListing.id.toString() === listingId)
        });
    },

    /**
     * Gets a home valuation
     * @param ctx
     * @returns {Promise<*>}
     */
    async checkHomeValue(ctx) {
        let deliveryLine = ctx.query.address;
        if (ctx.query.address2 !== undefined) {
            deliveryLine += ' ' + ctx.query.address2;
        }

        let overrides = {};
        if (ctx.query.beds) { overrides.overrideBedroomCount = ctx.query.beds; }
        if (ctx.query.baths) { overrides.overrideBathroomCount = ctx.query.baths; }
        if (ctx.query.size) { overrides.overrideSquareFootage = ctx.query.size; }

        const homeJunctionServiceFactory = new HomeJunctionServiceFactory();
        const homeJunctionService = homeJunctionServiceFactory.getServiceForEnv();
        return await homeJunctionService.getHomeValue(
            deliveryLine,
            ctx.query.city,
            ctx.query.state,
            ctx.query.zipCode,
            overrides
        );
    },

    /**
     * Gets offers for a listing
     * @param ctx
     * @returns {Promise<void>}
     */
    async getOffers(ctx) {
        let userId = ctx.state.user.id;
        const listingId = ctx.query.listingId;
        const offers = await strapi.query('offer', '').find({
            listing: listingId
        });

        ctx.send(offers);
    },

    /**
     * Checks if the authenticated user has an active offer on this listing
     * @param ctx
     * @returns {Promise<void>}
     */
    async checkOffer(ctx) {
        let userId = ctx.state.user.id;
        const listingId = ctx.query.listingId;
        const offer = await strapi.query('offer', '').findOne({
            offeror: userId,
            listing: listingId,
        });

        if (offer) {
            return ctx.send({offer});
        }
        else {
            return ctx.send({offer: null});
        }
    },

    /**
     * Checks if the authenticated user has an unprocessed visit request for a listing
     * @param ctx
     * @returns {Promise<void>}
     */
    async checkVisitRequest(ctx) {
        let userId = ctx.state.user.id;
        const listingId = ctx.query.listingId;
        const listing = await strapi.query('listing').findOne({id: listingId});
        const pendingVisitRequests = await strapi.query('scheduled-event').find({
            user: userId,
            listing: listingId,
            status: 'pending_realsy',
            type: 'requested_visit',
        });
        let visitRequest =null;
        if (pendingVisitRequests.length > 0) {
            visitRequest = pendingVisitRequests[0];
        }

        return ctx.send({listing, visitRequest});
    },

    /**
     * Marks a tip from Realsy on a listing as complete/incomplete
     * @param ctx
     * @returns {Promise<void>}
     */
    async markTip(ctx) {
        const listing = await strapi.query('listing', '').findOne({id: ctx.request.body.listingId});
        if (!listing) { return ctx.send(null); }
        const newTips = listing.realsyTips.splice(0);
        newTips.forEach(tip => {
            if (tip.id === parseInt(ctx.request.body.tipId)) {
                tip.complete = (ctx.request.body.complete === 'true' || ctx.request.body.complete === '1')
            }
        });
        await strapi.query('listing', '').update(
            {id: listing.id},
            {realsyTips: newTips}
        );
        return ctx.send(newTips);
    },
};
