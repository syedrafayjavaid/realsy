import {ApiClient, getApiClient} from "api/api-client";

/**
 * User Chat functions
 */
const Chat = {
    findChat,
    findChatById,
    sendMessage,
    getMyChats
};
export default Chat;

/**
 * Sends a new chat message
 * @returns {Promise<{success: boolean, chat: any}>}
 */
async function sendMessage(apiToken, message) {
    const apiClient = getApiClient(apiToken);
    const response = await apiClient.post(`/chats/new-message`, message);
    const data = response.data;
    return {
        success: response.status === 200,
        chat: data
    };
}

/**
 * Finds an existing chat with the given user on the given listing
 * @param apiToken
 * @param otherUserId
 * @param listingId
 * @returns {Promise<{success: boolean, chat: any}>}
 */
async function findChat(apiToken, otherUserId, listingId) {
    const response = await ApiClient.get('/chats/mine', {
        params: { otherUserId, listingId }
    });
    const data = response.data;
    return {
        success: data.success,
        chat: data.chat
    };
}

/**
 * Finds an existing chat by ID
 * @param apiToken
 * @param chatId
 * @returns {Promise<{success: boolean, chat: any}>}
 */
async function findChatById(apiToken, chatId) {
    const response = await ApiClient.get(`/chats/mine`, {
        params: { id: chatId }
    });
    const data = response.data;
    return {
        success: data.success,
        chat: data.chat
    };
}

/**
 * Gets all of a user's chats
 * @param apiToken
 * @returns {Promise<{success: boolean, chats: any}>}
 */
async function getMyChats(apiToken) {
    const response = await ApiClient.get('/chats/mine');
    const data = response.data;
    return {
        success: response.status === 200,
        chats: data
    }
}
