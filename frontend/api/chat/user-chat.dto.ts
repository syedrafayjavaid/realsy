import {UserDto} from "api/auth/user.dto";
import {ListingDto} from "api/listings/listing.dto";

/**
 * A chat fetched from the API
 */
export interface UserChatDto {
    id: number,
    key: string,
    users: UserDto[],
    listing?: ListingDto,
}
