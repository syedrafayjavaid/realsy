import {describe, it, jest} from "@jest/globals";
import {AppEventsService} from "api/app-events/app-events-service";

/**
 * App Events service unit tests
 * @group unit
 * @group events/unit
 */
describe('App Events service', () => {
    it ('collects subscribers to events', () => {
        const handle = AppEventsService.subscribe('test-event', () => {});
        expect(handle).toBeDefined();
    });

    it ('unsubscribes subscribers', () => {
        const handle = AppEventsService.subscribe('test-event', () => {});
        AppEventsService.unsubscribe(handle);
    });

    it ('sends fired events to subscribers', async () => {
        const callback = jest.fn();
        const fakeData = {fake: true};
        const testEventCode = 'test-event';

        AppEventsService.subscribe(testEventCode, callback);
        await AppEventsService.fire(testEventCode, fakeData);

        expect(callback.mock.calls.length).toEqual(1);
        expect(callback).toHaveBeenCalledWith(fakeData);
    });

    it ('sends notifications as configured in the database for given events', () => {

    });
});
