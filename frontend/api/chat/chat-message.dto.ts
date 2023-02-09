import {UserDto} from "api/auth/user.dto";

export interface ChatMessageDto {
    id: number,
    body: string,
    user?: UserDto,
    datetimeSent: string,
}
