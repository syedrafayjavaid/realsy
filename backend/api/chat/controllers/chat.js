import {Logger} from "api/logging";
import {AppEventCodes} from "api/app-events/app-event-codes";
import {AppEventsService} from "api/app-events/app-events-service";
import {ChatService} from "api/chat/chat-service";

const logger = Logger('chat-controller');

/**
 * Chat controller
 * Provides extra actions related to user chats
 */
module.exports = {
    /**
     * Handles a new posted chat message
     * @param ctx
     * @returns {Promise<void>}
     */
    async newMessage(ctx) {
        const senderId = ctx.state.user.id;
        const body = ctx.request.body;
        const messageBody = body.messageBody;
        const chatId = body.chatId;
        const otherUserId = body.otherUserId;
        if (!messageBody) {
            return ctx.badRequest('messageBody must be supplied');
        }
        if (!otherUserId && !chatId) {
            return ctx.badRequest('chatId or otherUserId must be supplied');
        }

        logger.trace(`New chat message ${JSON.stringify(body)}`);

        const existingChat = body.chatId
            ? await strapi.query('chat', '').findOne({id: body.chatId})
            : await ChatService.findChatForUsersAndListing(senderId, body.otherUserId, body.listingId);

        if (existingChat) {
            // this is a new message for an existing chat
            logger.trace('Adding message to existing chat');

            const newMessages = existingChat.messages;
            newMessages.push({
                body: body.messageBody,
                user: senderId,
                datetimeSent: Date.now()
            });

            const result = await strapi.query('chat', '').update(
                { id: existingChat.id },
                { messages: newMessages }
            );

            await AppEventsService.fire(AppEventCodes.NewChatMessage, result);
            logger.trace(`Chat message saved`);
            return ctx.send(result);
        }
        else {
            // create a new chat with this as the first message
            logger.trace('Creating new chat');

            const result = await strapi.query('chat', '').create({
                key: ChatService.generateChatKey(senderId, body.otherUserId, body.listingId),
                users: [senderId, body.otherUserId],
                listing: body.listingId,
                messages: [{
                    body: body.messageBody,
                    user: senderId,
                    datetimeSent: Date.now()
                }],
            });

            await AppEventsService.fire(AppEventCodes.NewChatMessage, result);
            logger.trace(`Chat message saved`);
            return ctx.send(result);
        }
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
            const foundChat = await ChatService.findChatForUsersAndListing(senderId, params.otherUserId, params.listingId);
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
