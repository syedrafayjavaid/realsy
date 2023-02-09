import {ChatService} from "api/chat/chat-service";

describe ('Chat Service', () => {
    it ('generates unique chat keys for user and listing combinations in (leastUserId)-(greatestUserId)-(listingId) format', () => {
        const result = ChatService.generateChatKey(1, 2, 1);
        expect(result).toEqual('1-2-1');
        const result2 = ChatService.generateChatKey(2, 1, 1);
        expect(result2).toEqual('1-2-1');
    });
});
