import {ConfigKey} from "config/config-keys";
import {AppEventTemplateVars} from "api/app-events/app-event-template-vars";
import {AppEventCodes} from "api/app-events/app-event-codes";
import {AppEventsService} from "api/app-events/app-events-service";
import {UserNotificationService} from "api/user-notifications/user-notification-service";

export async function registerListingSubscribers() {
    AppEventsService.subscribe(
        AppEventCodes.ListingCreated,
        async listing => {
            if (listing.externalId) {
                // skip notifications for MLS listings
                return;
            }

            const agent = await strapi.query('agent', '').findOne({id: listing.agent?.id});
            await AppEventsService.sendEventNotifications(AppEventCodes.ListingCreated, {
                [AppEventTemplateVars.ListingAddress]: `${listing.address} ${listing.address2 ?? ''} ${listing.city}, ${listing.state} ${listing.zipCode}`,
                [AppEventTemplateVars.ListingOwnerLink]: strapi.config.get('custom.' + ConfigKey.frontendUrl) + '/account/listings/' + listing.id,
                [AppEventTemplateVars.ListingAdminLink]: `${process.env[ConfigKey.baseUrl]}/admin/plugins/content-manager/collectionType/application::listing.listing/${listing.id}`,
                [AppEventTemplateVars.AgentEmail]: agent?.emailNotifications ? agent?.email : null,
                [AppEventTemplateVars.AgentPhone]: agent?.textNotifications ? agent?.phone : null,
            });
        }
    );

    AppEventsService.subscribe(
        AppEventCodes.ListingApproved,
        async listingId => {
            const listing = await strapi.query('listing', '').findOne(
                {id: listingId},
                ['owner']
            );

            await AppEventsService.sendEventNotifications(AppEventCodes.ListingApproved, {
                [AppEventTemplateVars.OwnerEmail]: listing?.owner?.contactEmail ? listing?.owner?.email : null,
                [AppEventTemplateVars.OwnerPhone]: listing?.owner?.contactText ? listing?.owner?.phone : null,
                [AppEventTemplateVars.ListingOwnerLink]: `${strapi.config.get('custom.' + ConfigKey.frontendUrl)}/account/listings/${listingId}`,
            });

            if (listing.owner) {
                const notificationService = new UserNotificationService();
                await notificationService.createUserNotification({
                    userId: listing.owner?.id,
                    heading: 'Your Listing is Approved!',
                    subheading: `${listing.address} ${listing.city}`,
                    relatedContentType: 'listing',
                    relatedContentId: listingId,
                    body: `Your listing ${listing.address} is now active!`,
                });
                strapi.query('user-activity-record', '').create({
                    user: listing.owner?.id,
                    typeCode: 'listing-approved',
                    title: 'Your Listing is Approved!',
                    subheading: `${listing.address} ${listing.city}`,
                    iconUrl: '/icon-house-white.svg',
                    listing: listingId,
                    link: '/account/listings/' + listingId,
                    body: `Your listing ${listing.address} is now active!`,
                    seen: false
                });
            }
        }
    );
}
