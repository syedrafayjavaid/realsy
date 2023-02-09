import {ScheduledEventStatuses} from "api/scheduled-event/scheduled-event-statuses";
import {Logger} from "api/logging";
import {AppEventCodes} from "api/app-events/app-event-codes";
import {ScheduledEventTypes} from "api/scheduled-event/schedule-event-types";
import {AppEventsService} from "api/app-events/app-events-service";

const logger = Logger('scheduled-event-model');

/**
 * Scheduled Event model
 * Adds lifecycle hooks to scheduled events
 */
module.exports = {
    lifecycles: {
        async afterCreate(result, params) {
            logger.trace({
                message: 'Scheduled event created',
                result,
                params,
            });

            if (result.type === ScheduledEventTypes.RequestedVisit) {
                await AppEventsService.fire(AppEventCodes.ListingVisitRequested, result);
            }
        },

        async beforeUpdate(params, data) {
            logger.trace({
                message: 'Scheduled event updating (before)',
                params,
                data,
            });

            const existingEvent = await strapi.query('scheduled-event', '').findOne({id: params.id});
            if (data.status === ScheduledEventStatuses.Scheduled && existingEvent?.status !== ScheduledEventStatuses.Scheduled) {
                await AppEventsService.fire(AppEventCodes.EventScheduled, data);
            }
        },
    },
};
