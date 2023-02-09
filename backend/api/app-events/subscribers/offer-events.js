import {ConfigKey} from "config/config-keys";
import {AppEventTemplateVars} from "api/app-events/app-event-template-vars";
import {AppEventCodes} from "api/app-events/app-event-codes";
import {AppEventsService} from "api/app-events/app-events-service";
import {UserNotificationService} from "api/user-notifications/user-notification-service";
import {OfferStatuses} from "api/offer/offer-statuses";

export async function registerOfferEvents() {
    /**
     * Created offer
     */
    AppEventsService.subscribe(AppEventCodes.OfferCreated, async offerId => {
        await AppEventsService.sendEventNotifications(AppEventCodes.OfferCreated, {
            [AppEventTemplateVars.AdminLink]: `${process.env[ConfigKey.baseUrl]}/admin/plugins/content-manager/collectionType/application::offer.offer/${offerId}`
        });

        const offer = await strapi.query('offer', '').findOne(
            {id: offerId},
            ['listing', 'offeror', 'listing.owner'],
        );

        const notificationService = new UserNotificationService();
        await notificationService.createUserNotification({
            userId: offer.offeror,
            relatedContentType: 'listing',
            relatedContentId: offer.listing.id,
            heading: 'Your Offer is Pending!',
            subheading: `${offer.listing.address} ${offer.listing.city}`,
            body: `Your offer on ${offer.listing.address} is awaiting Realsy approval.`,
        });
        strapi.query('user-activity-record', '').create({
            user: offer.offeror,
            listing: offer.listing.id,
            typeCode: 'offer-created',
            title: 'Your Offer is Pending!',
            subheading: `${offer.listing.address} ${offer.listing.city}`,
            body: `Your offer on ${offer.listing.address} is awaiting Realsy approval.`,
            link: '/account/dashboard?viewedListingId=' + offer.listing.id + '&listingSection=make-offer',
            seen: false
        });

        if (offer.status === OfferStatuses.PendingLister && offer.listing?.owner) {
            const notificationService = new UserNotificationService();
            await notificationService.createUserNotification({
                userId: offer.listing.owner.id,
                heading: 'You have a new offer!',
                subheading: `${offer.listing.address} ${offer.listing.city}`,
                relatedContentType: 'offer',
                relatedContentId: offer.id,
                secondaryRelatedContentType: 'listing',
                secondaryRelatedContentId: offer.listing.id,
            });
            strapi.query('user-activity-record', '').create({
                user: offer?.listing?.owner?.id,
                listing: offer.listing.id,
                typeCode: 'new-offer',
                title: 'You have a new offer!',
                subheading: `${offer.listing.address} ${offer.listing.city}`,
                body: `You have a new offer on ${offer.listing.address}.`,
                link: `/account/listings/${offer.listing.id}?listingSection=offers`,
                seen: false
            });
        }
    });

    /**
     * Offer approved
     */
    AppEventsService.subscribe(AppEventCodes.OfferApproved, async offerId => {
        const offer = await strapi.query('offer', '').findOne(
            {id: offerId},
            ['listing', 'listing.owner', 'offeror']
        );

        await AppEventsService.sendEventNotifications(AppEventCodes.OfferApproved, {
            [AppEventTemplateVars.ListingShortAddress]: offer?.listing?.address,
            [AppEventTemplateVars.OfferListerLink]: `${strapi.config.get('custom.' + ConfigKey.frontendUrl)}/account/listings/${offer.listing.id}?listingSection=offers`,
            [AppEventTemplateVars.ListerEmail]: offer?.listing?.owner?.contactEmail ? offer?.listing?.owner?.email : null,
            [AppEventTemplateVars.ListerPhone]: offer?.listing?.owner?.contactText ? offer?.listing?.owner?.phone : null,
            [AppEventTemplateVars.OfferorEmail]: offer?.offeror?.contactEmail ? offer?.offeror?.email : null,
            [AppEventTemplateVars.OfferorPhone]: offer?.offeror?.contactText ? offer?.offeror?.phone : null,
            [AppEventTemplateVars.OfferOfferorLink]: `${strapi.config.get('custom.' + ConfigKey.frontendUrl)}/account/dashboard?viewedListingId=${offer.listing.id}&listingSection=make-offer`,
        });

        const notificationService = new UserNotificationService();
        await notificationService.createUserNotification({
            userId: offer.offeror,
            heading: 'Your Offer is Approved!',
            subheading: `${offer.listing.address} ${offer.listing.city}`,
            relatedContentType: 'offer',
            relatedContentId: offer.id,
            secondaryRelatedContentType: 'listing',
            secondaryRelatedContentId: offer.listing.id,
        });
        strapi.query('user-activity-record', '').create({
            user: offer.offeror,
            listing: offer.listing.id,
            typeCode: 'offer-approved',
            title: 'Your Offer is Approved!',
            subheading: `${offer.listing.address} ${offer.listing.city}`,
            body: `Your offer on ${offer.listing.address} is approved and awaiting the lister.`,
            link: '/account/dashboard?viewedListingId=' + offer.listing.id + '&listingSection=make-offer',
            seen: false
        });

        if (offer?.listing?.owner) {
            await notificationService.createUserNotification({
                userId: offer.listing.owner.id,
                heading: 'You have a new offer!',
                subheading: `${offer.listing.address} ${offer.listing.city}`,
                relatedContentType: 'offer',
                relatedContentId: offer.id,
                secondaryRelatedContentType: 'listing',
                secondaryRelatedContentId: offer.listing.id,
            });
            strapi.query('user-activity-record', '').create({
                user: offer?.listing?.owner?.id,
                listing: offer.listing.id,
                typeCode: 'new-offer',
                title: 'You have a new offer!',
                subheading: `${offer.listing.address} ${offer.listing.city}`,
                body: `You have a new offer on ${offer.listing.address}.`,
                link: `/account/listings/${offer.listing.id}?listingSection=offers`,
                seen: false
            });
        }
    });

    /**
     * Offer accepted
     */
    AppEventsService.subscribe(AppEventCodes.OfferAccepted, async offerId => {
        const offer = await strapi.query('offer', '').findOne(
            {id: offerId},
            ['listing', 'listing.owner', 'offeror']
        );

        await AppEventsService.sendEventNotifications(AppEventCodes.OfferAccepted, {
            [AppEventTemplateVars.OfferorEmail]: offer?.offeror?.contactEmail ? offer.offeror.email : null,
            [AppEventTemplateVars.OfferorPhone]: offer?.offeror?.contactText ? offer.offeror.phone : null,
            [AppEventTemplateVars.ListingShortAddress]: offer?.listing?.address,
            [AppEventTemplateVars.ClosingLink]: `${strapi.config.get('custom.' + ConfigKey.frontendUrl)}/account/listings/${offer?.listing?.id}`,
        });

        const notificationsService = new UserNotificationService();

        if (offer?.listing?.owner) {
            await notificationsService.createUserNotification({
                userId: offer.listing.owner?.id,
                heading: 'You\'ve sold!',
                subheading: `${offer.listing.address} ${offer.listing.city}`,
                relatedContentType: 'listing',
                relatedContentId: offer.listing.id,
            });
            strapi.query('user-activity-record', '').create({
                user: offer.listing.owner?.id,
                listing: offer.listing.id,
                typeCode: 'listing-sold',
                title: 'You\'ve sold!',
                subheading: `${offer.listing.address} ${offer.listing.city}`,
                body: `Congratulations on selling your home with Realsy!`,
                iconUrl: '/icon-house-white.svg',
                link: '/account/listings/' + offer.listing.id,
                seen: false
            });
        }

        await notificationsService.createUserNotification({
            userId: offer.offeror.id,
            heading: 'Home Purchased!',
            subheading: `${offer.listing.address} ${offer.listing.city}`,
            relatedContentType: 'offer',
            relatedContentId: offer.id,
        });
        strapi.query('user-activity-record', '').create({
            user: offer.offeror.id,
            listing: offer.listing.id,
            typeCode: 'home-purchased',
            title: 'Home Purchased!',
            subheading: `${offer.listing.address} ${offer.listing.city}`,
            body: `Thanks for letting us help you along the way!`,
            iconUrl: '/icon-house-white.svg',
            link: '/account/listings/' + offer.listing.id,
            seen: false
        });
    });

    /**
     * Offer countered
     */
    AppEventsService.subscribe(AppEventCodes.OfferCountered, async offerId => {
        const offer = await strapi.query('offer', '').findOne(
            {id: offerId},
            ['listing', 'offeror']
        );

        const link = '/account/dashboard?viewedListingId=' + offer.listing.id + '&listingSection=make-offer';

        await AppEventsService.sendEventNotifications(AppEventCodes.OfferCountered, {
            [AppEventTemplateVars.OfferorEmail]: offer?.offeror?.contactEmail ? offer.offeror.email : null,
            [AppEventTemplateVars.OfferorPhone]: offer?.offeror?.contactText ? offer.offeror.phone : null,
            [AppEventTemplateVars.ListingShortAddress]: offer?.listing?.address,
            [AppEventTemplateVars.OfferOfferorLink]: `${strapi.config.get('custom.' + ConfigKey.frontendUrl)}/account/dashboard?viewedListingId=${offer.listing.id}&listingSection=make-offer`,
        });

        const notificationsService = new UserNotificationService();
        await notificationsService.createUserNotification({
            userId: offer.offeror.id,
            heading: 'Offer Countered',
            subheading: `${offer.listing.address} ${offer.listing.city}`,
            relatedContentType: 'offer',
            relatedContentId: offer.id,
            secondaryRelatedContentType: 'listing',
            secondaryRelatedContentId: offer.listing.id,
        });
        strapi.query('user-activity-record', '').create({
            listing: offer.listing.id,
            user: offer.offeror.id,
            typeCode: 'offer-countered',
            title: 'Offer Countered',
            subheading: `${offer.listing.address} ${offer.listing.city}`,
            body: `Your offer has been countered!`,
            iconUrl: '/icon-house-white.svg',
            link: link,
            seen: false
        });
    });

    /**
     * Offer re-countered
     */
    AppEventsService.subscribe(AppEventCodes.OfferRecountered, async offerId => {
        const offer = await strapi.query('offer', '').findOne(
            {id: offerId},
            ['listing', 'listing.owner']
        );

        const link = '/account/listings/' + offer.listing.id + '?listingSection=offers';

        await AppEventsService.sendEventNotifications(AppEventCodes.OfferRecountered, {
            [AppEventTemplateVars.ListerEmail]: offer?.listing?.owner?.contactEmail ? offer.listing.owner.email : null,
            [AppEventTemplateVars.ListerPhone]: offer?.listing?.owner?.contactText ? offer.listing.owner.phone : null,
            [AppEventTemplateVars.ListingShortAddress]: offer?.listing?.address,
            [AppEventTemplateVars.OfferListerLink]: `${strapi.config.get('custom.' + ConfigKey.frontendUrl)}/account/listings/${offer?.listing?.id}?listingSection=offers`,
        });

        if (offer?.listing?.owner) {
            const notificationsService = new UserNotificationService();
            notificationsService.createUserNotification({
                userId: offer.listing.owner.id,
                heading: 'Offer Countered',
                subheading: `${offer.listing.address} ${offer.listing.city}`,
                relatedContentType: 'offer',
                relatedContentId: offer.id,
                secondaryRelatedContentType: 'listing',
                secondaryRelatedContentId: offer.listing.id,
            });
            strapi.query('user-activity-record', '').create({
                listing: offer.listing.id,
                user: offer.listing.owner.id,
                typeCode: 'offer-countered',
                title: 'Offer Countered',
                subheading: `${offer.listing.address} ${offer.listing.city}`,
                body: `Your offer has been countered!`,
                iconUrl: '/icon-house-white.svg',
                link: link,
                seen: false
            });
        }
    });

    /**
     * Offer declined
     */
    AppEventsService.subscribe(AppEventCodes.OfferDeclined, async offerId => {
        const offer = await strapi.query('offer', '').findOne(
            {id: offerId},
            ['listing', 'offeror']
        );

        await AppEventsService.sendEventNotifications(AppEventCodes.OfferDeclined, {
            [AppEventTemplateVars.OfferorEmail]: offer?.offeror?.contactEmail ? offer.offeror.email : null,
            [AppEventTemplateVars.OfferorPhone]: offer?.offeror?.contactText ? offer.offeror.phone : null,
            [AppEventTemplateVars.ListingShortAddress]: offer?.listing?.address,
            [AppEventTemplateVars.OfferOfferorLink]: `${strapi.config.get('custom.' + ConfigKey.frontendUrl)}/account/dashboard?viewedListingId=${offer.listing.id}`,
        });

        const notificationsService = new UserNotificationService();
        notificationsService.createUserNotification({
            userId: offer.offeror.id,
            heading: 'Offer Declined',
            subheading: `${offer.listing.address} ${offer.listing.city}`,
            relatedContentType: 'offer',
            relatedContentId: offer.id,
            secondaryRelatedContentType: 'listing',
            secondaryRelatedContentId: offer.listing.id,
        });
        strapi.query('user-activity-record', '').create({
            user: offer.offeror.id,
            listing: offer.listing.id,
            typeCode: 'offer-declined',
            title: 'Offer Declined',
            subheading: `${offer.listing.address} ${offer.listing.city}`,
            body: `Lister declined your offer`,
            iconUrl: '/icon-house-white.svg',
            link: '/account/dashboard?viewedListingId=' + offer.listing.id + '&listingSection=make-offer',
            seen: false
        });
    });

    AppEventsService.subscribe(AppEventCodes.CounterOfferDeclined, async offerId => {
        const offer = await strapi.query('offer', '').findOne(
            {id: offerId},
            ['listing', 'listing.owner', 'offeror']
        );

        await AppEventsService.sendEventNotifications(AppEventCodes.CounterOfferDeclined, {
            [AppEventTemplateVars.ListerEmail]: offer?.listing?.owner?.contactEmail ? offer.listing.owner.email : null,
            [AppEventTemplateVars.ListerPhone]: offer?.listing?.owner?.contactText ? offer.listing.owner.phone : null,
            [AppEventTemplateVars.ListingShortAddress]: offer?.listing?.address,
            [AppEventTemplateVars.OfferListerLink]: `${strapi.config.get('custom.' + ConfigKey.frontendUrl)}/account/listings/${offer?.listing?.id}`,
        });

        const notificationsService = new UserNotificationService();
        notificationsService.createUserNotification({
            userId: offer.listing.owner.id,
            heading: 'Counter Offer Declined',
            subheading: `${offer.listing.address} ${offer.listing.city}`,
            relatedContentType: 'offer',
            relatedContentId: offer.id,
            secondaryRelatedContentType: 'listing',
            secondaryRelatedContentId: offer.listing.id,
        });
        strapi.query('user-activity-record', '').create({
            user: offer.listing.owner.id,
            listing: offer.listing.id,
            typeCode: 'offer-declined',
            title: 'Counter Offer Declined',
            subheading: `${offer.listing.address} ${offer.listing.city}`,
            body: `Offeror declined your counter offer`,
            iconUrl: '/icon-house-white.svg',
            link: '/account/listings/' + offer.listing.id + '?listingSection=offers',
            seen: false
        });
    });
}
