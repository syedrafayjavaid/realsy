import {ScheduleEventStatus} from "api/scheduled-events/schedule-event-status.enum";
import {ScheduledEventType} from "api/scheduled-events/scheduled-event-type.enum";
import {ListingDto} from "api/listings/listing.dto";
import {UserDto} from "api/auth/user.dto";

/**
 * A scheduled event fetched from the API
 */
export interface ScheduledEventDto {
    id: number,
    datetime?: string,
    details?: string,
    status: ScheduleEventStatus,
    type: ScheduledEventType,
    listing?: ListingDto,
    user?: UserDto,
}
