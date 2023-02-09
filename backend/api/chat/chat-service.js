/**
 * Chat Service
 * provides functions related to user chat
 */
export const ChatService = {
    /**
     * Generates a unique chat key for the given user IDs and listing
     * @param userId1
     * @param userId2
     * @param listingId
     * @returns {string}
     */
    generateChatKey(userId1, userId2, listingId) {
        const leastUserId = userId1 < userId2 ? userId1 : userId2;
        const greatestUserId = userId1 === leastUserId ? userId2 : userId1;
        return `${leastUserId}-${greatestUserId}-${listingId}`;
    },

    /**
     * Finds an existing chat, if one exists for the given user IDs and listing ID
     * @param userId1
     * @param userId2
     * @param listingId
     * @returns {Promise<Object>}
     */
    async findChatForUsersAndListing(userId1, userId2, listingId) {
        const chatKey = ChatService.generateChatKey(userId1, userId2, listingId);
        return await strapi.query('chat', '').findOne({key: chatKey});
    },

    /**
     * Finds an existing chat for the authenticated user
     * @param ctx
     * @returns {Promise<{success: boolean, chat: Promise<*>}>}
     */
    async findMine(ctx) {
        const senderId = ctx.state.user.id;
        const params = ctx.query;

        if (params.id) {
            const foundChat = await strapi.query('chat', '').findOne(
                {id: params.id},
                ['messages', 'users', 'messages.user', 'messages.user.profilePhoto']
            );
            return ctx.send({
                success: true,
                chat: foundChat
            })
        }
        else if (params.otherUserId && params.listingId) {
            const foundChat = await findExistingChat(senderId, params.otherUserId, params.listingId);
            return ctx.send({
                success: true,
                chat: foundChat
            });
        }
        else {
            const user = await strapi.query('user', 'users-permissions').findOne(
                {id: senderId},
                ['chats', 'chats.messages', 'chats.users', 'chats.listing', 'chats.messages.user', 'chats.messages.user.profilePhoto']
            );
            return ctx.send(user.chats ?? []);
        }
    }
};


