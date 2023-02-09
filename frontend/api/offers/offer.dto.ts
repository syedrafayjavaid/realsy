import {OfferStatus} from "api/offers/offer-status.enum";
import {UserDto} from "api/auth/user.dto";
import {UserDocumentDto} from "api/documents/user-document.dto";
import {ListingDto} from "api/listings/listing.dto";

/**
 * An offer fetched from the API
 */
export interface OfferDto {
    id: number,
    listing: ListingDto,
    amount: number,
    status: OfferStatus,
    desiredClosingDate: Date,
    closingCostsPaid: string,
    itemsIncluded: string[],
    includedInspections: string[],
    otherNotes: string,
    agentNotes: {body: string}[],
    counterOffers: {
        user: UserDto,
        datetime: Date,
        amount: number,
        closingDate: Date,
        notes: string,
        offerDocument?: UserDocumentDto,
        agentNotes: {body: string}[],
        closingCostsPaid: string,
    }[],
    closingSteps: {
        id: number,
        title: string,
        microSteps: {
            id: number,
            name: string,
            complete: boolean
        }[],
    }[],
}
