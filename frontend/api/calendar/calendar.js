import {ApiClient} from "api/api-client";

/**
 * User Calendar functions
 */
const Calendar = {
    createVisitRequest,
    getScheduledEvents,
    getScheduledEventsForListing,
    getPendingVisitRequests
};
export default Calendar;

/**
 * Creates a visit request
 * @param apiToken
 * @param listingId
 * @returns {Promise<{success: boolean, visitRequest: any}>}
 */
async function createVisitRequest(apiToken, listingId) {
    const response = await ApiClient.post('/scheduled-events/request-visit', {
        listingId,
    });
    return {
        success: response.status === 200,
        visitRequest: response.data,
    }
}

/**
 * Gets pending visit requests
 */
async function getPendingVisitRequests() {
    const response = await ApiClient.get('/scheduled-events/my-requested');
    return {
        success: response.status === 200,
        visitRequests: response.data,
    }
}

/**
 * Gets events scheduled within the given time period
 * @param apiToken
 * @param earliestDate
 * @param latestDate
 * @returns {Promise<{success: boolean, events: any}>}
 */
async function getScheduledEvents(apiToken, earliestDate = null, latestDate = null) {
    console.log(earliestDate);
    console.log(latestDate);
    const response = await ApiClient.get('/scheduled-events/mine', {
        params: {
            earliestDate: earliestDate.toISOString(),
            latestDate: latestDate.toISOString(),
        }
    });
    return {
        success: response.status === 200,
        events: response.data,
    };
}

/**
 * Gets events scheduled for a given listing
 * @param apiToken
 * @param listingId
 * @returns {Promise<{success: boolean, events: any}>}
 */
async function getScheduledEventsForListing(apiToken, listingId) {
    const response = await ApiClient.get('/scheduled-events/mine', {
        params: {
            listingId,
        },
    });
    return {
        success: response.status === 200,
        events: response.data,
    };
}
