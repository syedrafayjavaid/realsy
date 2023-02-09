/**
 * A user fetched from the API
 */
import {FileUploadDto} from "api/uploads/file-upload.dto";

export type UserDto = {
    id: number,
    username: string,
    email: string,
    provider: string,
    confirmed?: boolean,
    blocked?: boolean,
    role: {
        id: number,
        name: string,
        description: string,
        type: string,
    },

    name?: string,
    agent?: boolean,
    phone?: string,
    contactText: boolean,
    contactEmail: boolean,
    contactPhone: boolean,

    availableSundayStart?: string,
    availableSundayEnd?: string,
    availableMondayStart?: string,
    availableMondayEnd?: string,
    availableTuesdayStart?: string,
    availableTuesdayEnd?: string,
    availableWednesdayStart?: string,
    availableWednesdayEnd?: string,
    availableThursdayStart?: string,
    availableThursdayEnd?: string,
    availableFridayStart?: string,
    availableFridayEnd?: string,
    availableSaturdayStart?: string,
    availableSaturdayEnd?: string,

    preApprovedAmount: number,
    daysLookingToBuy: number,
    alsoSellingAHome: boolean,
    alreadyFoundHome: boolean,
    canListExternal: boolean,
    isAgent: boolean,

    created_at: Date,
    updated_at: Date,

    profilePhoto: FileUploadDto,
    savedListings: any[],
    listings: [],
    documents: [],
    scheduledEvents: [],
    chats: [],
    documentsInvolved: [],
    notifications: []
};

export function availabilityForUser(user: UserDto) {
    return {
        availableSundayStart: user.availableSundayStart ?? '',
        availableSundayEnd: user.availableSundayEnd ?? '',
        availableMondayStart: user.availableMondayStart ?? '',
        availableMondayEnd: user.availableMondayEnd ?? '',
        availableTuesdayStart: user.availableTuesdayStart ?? '',
        availableTuesdayEnd: user.availableTuesdayEnd ?? '',
        availableWednesdayStart: user.availableWednesdayStart ?? '',
        availableWednesdayEnd: user.availableWednesdayEnd ?? '',
        availableThursdayStart: user.availableThursdayStart ?? '',
        availableThursdayEnd: user.availableThursdayEnd ?? '',
        availableFridayStart: user.availableFridayStart ?? '',
        availableFridayEnd: user.availableFridayEnd ?? '',
        availableSaturdayStart:user.availableSaturdayStart ?? '',
        availableSaturdayEnd: user.availableSaturdayEnd ?? '',
    };
}
