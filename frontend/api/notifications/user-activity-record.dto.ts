import {ListingDto} from "api/listings/listing.dto";

/**
 * A user activity record fetched from the API
 */
export interface UserActivityRecordDto {
    id: number,
    title: string,
    body: string,
    listing?: ListingDto,
    seenAt?: Date,
    typeCode?: string,
    level?: number,
    seen: boolean,
    link?: string,
    iconUrl?: string,
    subheading?: string,
    created_at: Date,
    extra?: any,
}
