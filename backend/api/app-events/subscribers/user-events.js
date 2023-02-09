import {AppEventsService} from "api/app-events/app-events-service";
import {AppEventCodes} from "api/app-events/app-event-codes";
import {AppEventTemplateVars} from "api/app-events/app-event-template-vars";

export async function registerUserEvents() {
    /**
     * New user event subscriber
     */
    AppEventsService.subscribe(AppEventCodes.NewUser, async userParams => {
        const user = await strapi.query('user', 'users-permissions').findOne({id: userParams.id});
        await AppEventsService.sendEventNotifications(AppEventCodes.NewUser, {
            [AppEventTemplateVars.UserEmail]: user.email,
        });
    });
}
