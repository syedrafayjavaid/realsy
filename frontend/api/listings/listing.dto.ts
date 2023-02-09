import {UserDto} from "api/auth/user.dto";

/**
 * A listing fetched from the API
 */
export interface ListingDto {
    id: number,
    description: string,
    address: string,
    address2?: string,
    bathroomCount: number,
    bedroomCount: number,
    squareFootage: number,
    owner?: UserDto,
    homeType: string,
    latitude: number,
    longitude: number,
    city: string,
    state: string,
    askingPrice: number,
    zipCode: string,
    status: string,
    userUnsureOfValue: boolean,
    estimatedPayoff: number,
    desiredNetAmount: number,
    hadInvalidAddress?: boolean,
    listingOrganization?: string,
    listingAgentName?: string,
    listingAgentEmail?: string,
    listingAgentPhoneNum?: string,
    created_at: Date,
    updated_at: Date,
    steps: {
        id: number,
        title: string,
        microSteps: {
            id: number,
            name: string,
            complete: boolean
        }[],
    }[],
}
