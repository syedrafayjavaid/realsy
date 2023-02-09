/**
 * The status codes which an offer can be in
 */
export enum OfferStatus {
    PendingAdmin = 'pending_realsy',
    PendingListing = 'pending_lister',
    Accepted = 'accepted',
    Countered = 'countered',
    Declined = 'declined',
}
