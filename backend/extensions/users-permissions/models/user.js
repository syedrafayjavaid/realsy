import {AppEventCodes} from "api/app-events/app-event-codes";
import {AppEventsService} from "api/app-events/app-events-service";

const userModel = {
    lifecycles: {
        beforeCreate: async (data) => {
            // set default availability for new users
            data.availableSundayStart = '07:00:00';
            data.availableSundayEnd = '22:00:00';
            data.availableMondayStart = '07:00:00';
            data.availableMondayEnd = '22:00:00';
            data.availableTuesdayStart = '07:00:00';
            data.availableTuesdayEnd = '22:00:00';
            data.availableWednesdayStart = '07:00:00';
            data.availableWednesdayEnd = '22:00:00';
            data.availableThursdayStart = '07:00:00';
            data.availableThursdayEnd = '22:00:00';
            data.availableFridayStart = '07:00:00';
            data.availableFridayEnd = '22:00:00';
            data.availableSaturdayStart = '07:00:00';
            data.availableSaturdayEnd = '22:00:00';
        },

        afterCreate: async (result) => {
            await AppEventsService.fire(AppEventCodes.NewUser, {
                id: result.id
            });
        }
    }
};

module.exports = userModel;
