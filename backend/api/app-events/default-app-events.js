import {AppEventCodes} from "api/app-events/app-event-codes";

/**
 * The default app event configuration seeds
 */
export const defaultAppEvents = [
    {
        "eventCode": AppEventCodes.NewUser,
        "notifications": [
            {
                "__component": "app-events.notification",
                "recipientEmail": "{{user-email}}",
                "template": "Welcome to Realsy!",
                "emailSubject": "Welcome to Realsy!",
                "phoneTemplate": ""
            }
        ]
    },
    {
        "eventCode": AppEventCodes.ListingCreated,
        "notifications": [
            {
                "__component": "app-events.notification",
                "recipientEmail": "{{agent-email}}",
                "recipientPhone": "{{agent-phone}}",
                "template": "A new listing has been added under your Realsy Agent Account:\n{{listing-address}}\n\nView this listing at: {{listing-admin-link}}.",
                "emailSubject": "New Listing for your Realsy Agent Account",
                "phoneTemplate": ""
            }
        ]
    },
    {
        "eventCode": AppEventCodes.ListingApproved,
        "notifications": [
            {
                "__component": "app-events.notification",
                "recipientEmail": "{{owner-email}}",
                "recipientPhone": "{{owner-phone}}",
                "template": "Your Realsy listing is approved!\n\nView this listing at {{listing-owner-link}}.",
                "emailSubject": "Your Realsy Listing is Approved!",
                "phoneTemplate": null
            }
        ]
    },
    {
        "eventCode": AppEventCodes.NewChatMessage,
        "notifications": [
            {
                "__component": "app-events.notification",
                "recipientEmail": "{{recipient-email}}",
                "recipientPhone": "{{recipient-phone}}",
                "template": "You have a new chat message on Realsy Homes!\n\nFrom: {{sender-name}}\n{{length-constrained-message}}\n\nView the full chat at {{chat-link}}.",
                "emailSubject": "New Realsy chat message from {{sender-name}}",
                "phoneTemplate": null
            }
        ]
    },
    {
        "eventCode": AppEventCodes.ListingVisitRequested,
        "notifications": [
            {
                "__component": "app-events.notification",
                "recipientEmail": "{{lister-email}}",
                "recipientPhone": "{{lister-phone}}",
                "template": "A user has requested a visit to your Realsy listing!",
                "emailSubject": "New visit request on your Realsy listing!",
                "phoneTemplate": null
            }
        ]
    },
    {
        "eventCode": AppEventCodes.EventScheduled,
        "notifications": [
            {
                "__component": "app-events.notification",
                "recipientEmail": "{{owner-email}}",
                "recipientPhone": "{{owner-phone}}",
                "template": "Your event on Realsy Homes has been scheduled!\n\nView your calendar at {{calendar-link}}.",
                "emailSubject": "Your Realsy event is scheduled!",
                "phoneTemplate": null
            }
        ]
    },
    {
        "eventCode": AppEventCodes.OfferCreated,
        "notifications": [
            {
                "__component": "app-events.notification",
                "recipientEmail": "admin@realsyhomes.com",
                "recipientPhone": "",
                "template": "A new Realsy offer is awaiting approval.\n\nOffer ID: {{offerId}}\n{{listing-address}}\nListing ID: {{listing-id}}\n\nView this offer at {{admin-link}}",
                "emailSubject": "Realsy Offer Awaiting Approval",
                "phoneTemplate": null
            }
        ]
    },
    {
        "eventCode": AppEventCodes.OfferApproved,
        "notifications": [
            {
                "__component": "app-events.notification",
                "recipientEmail": "{{offeror-email}}",
                "recipientPhone": "{{offeror-phone}}",
                "template": "Your Realsy offer on {{listing-short-address}} is approved and awaiting the lister.\n\nYou can view this listing at {{offeror-link}}.\n           ",
                "emailSubject": "Your Realsy Offer is Approved!",
                "phoneTemplate": null
            },
            {
                "__component": "app-events.notification",
                "recipientEmail": "{{lister-email}}",
                "recipientPhone": "{{lister-phone}}",
                "template": "You have a new offer on your Realsy listing {{listing-short-address}}!\n\nYou can view the offer at {{lister-link}}.",
                "emailSubject": "You have a new offer on your Realsy listing!",
                "phoneTemplate": null
            }
        ]
    },
    {
        "eventCode": AppEventCodes.OfferAccepted,
        "notifications": [
            {
                "__component": "app-events.notification",
                "recipientEmail": "{{offeror-email}}",
                "recipientPhone": "{{offeror-phone}}",
                "template": "Your Realsy offer on {{listing-short-address}} was accepted!\n\nContinue with your closing steps at {{closing-link}}.",
                "emailSubject": "Your Realsy Offer was Accepted!",
                "phoneTemplate": null
            }
        ]
    },
    {
        "eventCode": AppEventCodes.OfferCountered,
        "notifications": [
            {
                "__component": "app-events.notification",
                "recipientEmail": "{{offeror-email}}",
                "recipientPhone": "{{offeror-phone}}",
                "template": "Your Realsy offer on {{listing-short-address}} was countered!\n\nView this listing at {{offeror-link}}.",
                "emailSubject": "Your Realsy Offer was countered!",
                "phoneTemplate": null
            }
        ]
    },
    {
        "eventCode": AppEventCodes.OfferRecountered,
        "notifications": [
            {
                "__component": "app-events.notification",
                "recipientEmail": "{{lister-email}}",
                "recipientPhone": "{{lister-phone}}",
                "template": "Your Realsy offer on {{offer-short-address}} was countered!\n\nView this offer at {{lister-link}}.",
                "emailSubject": "Your Realsy Offer was countered!",
                "phoneTemplate": null
            }
        ]
    },
    {
        "eventCode": AppEventCodes.OfferDeclined,
        "notifications": [
            {
                "__component": "app-events.notification",
                "recipientEmail": "{{offeror-email}}",
                "recipientPhone": "{{offeror-phone}}",
                "template": "Your Realsy offer on {{listing-short-address}} was declined.\n\nView this listing at {{offeror-link}}.",
                "emailSubject": "Your Realsy Offer was Declined",
                "phoneTemplate": null
            }
        ]
    },
    {
        "eventCode": AppEventCodes.CounterOfferDeclined,
        "notifications": [
            {
                "__component": "app-events.notification",
                "recipientEmail": "{{lister-email}}",
                "recipientPhone": "{{lister-phone}}",
                "template": "Your Realsy counter offer on listing {{listing-short-address}} was declined.\n\nView this listing at {{lister-link}}.",
                "emailSubject": "Your Realsy Counter Offer was Declined",
                "phoneTemplate": null
            }
        ]
    }
];
