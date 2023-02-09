/**
 * A user notification fetched from the API
 */
export interface UserNotificationDto {
    id: number,
    heading: string,
    subheading?: string,
    link?: string,
    relatedContentType?: string,
    relatedContentId?: number,
    secondaryRelatedContentType?: string,
    secondaryRelatedContentId?: number,
}
