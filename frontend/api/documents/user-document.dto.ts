import {FileUploadDto} from "api/uploads/file-upload.dto";
import {ListingDto} from "api/listings/listing.dto";

/**
 * A user document fetched from the API
 */
export interface UserDocumentDto {
    id: number,
    name: string,
    type?: string,
    original?: FileUploadDto,
    signed?: FileUploadDto,
    listing?: ListingDto,
    owner?: UserDocumentDto,
    created_at: Date,
    docusignEnvelope?: {
        templateId?: string,
        envelopeId?: string,
        signers: {
            role: string,
            email: string,
        }[],
    },
}
