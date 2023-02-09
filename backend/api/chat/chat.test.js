import {initializeStrapi, teardownStrapi} from "__tests__/helpers/strapi-helpers";
import {createTestUser, getTokenForUserId} from "__tests__/helpers/auth-helpers";
import request from 'supertest';

describe ('Chat Feature Tests', () => {
    beforeAll(async () => {
        await initializeStrapi();
    });

    afterAll(() => {
        teardownStrapi();
    });

    describe ('fetching chats', () => {
        it ('denies fetches from unauthenticated users', async () => {
            await request(strapi.server)
                .get('/chats')
                .expect(403)
        });

        it ('fetches chats an authenticated user is involved in', async () => {
            async function createTestChat(token, otherUserId) {
                const response = await request(strapi.server)
                    .post('/chats/new-message')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        otherUserId: otherUserId,
                        messageBody: 'test',
                    });
                return response.body;
            }

            const user1 = await createTestUser();
            const user2 = await createTestUser();
            const user3 = await createTestUser();
            const token1 = await getTokenForUserId(user1.id);
            const token2 = await getTokenForUserId(user2.id);
            const token3 = await getTokenForUserId(user3.id);

            const chat1 = await createTestChat(token1, user2.id);
            const chat2 = await createTestChat(token1, user2.id);
            const chat3 = await createTestChat(token1, user3.id);

            const user1ChatsResponse = await request(strapi.server)
                .get('/chats/mine')
                .set('Authorization', 'Bearer ' + token1);
            const user2ChatsResponse = await request(strapi.server)
                .get('/chats/mine')
                .set('Authorization', 'Bearer ' + token2);
            const user3ChatsResponse = await request(strapi.server)
                .get('/chats/mine')
                .set('Authorization', 'Bearer ' + token3);

            expect(user1ChatsResponse.body.length).toEqual(2);
            expect(user2ChatsResponse.body.length).toEqual(1);
            expect(user3ChatsResponse.body.length).toEqual(1);
        });
    });

    describe ('posting chats', () => {
        it ('denies new chats from unauthenticated users', async () => {
            await request(strapi.server)
                .post('/chats/new-message')
                .expect(403)
        });

        it ('allows an authenticated user to initiate a chat with another other', async () => {
            const user1 = await createTestUser();
            const user2 = await createTestUser();
            const user1Token = await getTokenForUserId(user1.id);
            const testMessage = 'test message';

            const response = await request(strapi.server)
                .post('/chats/new-message')
                .set('Authorization', 'Bearer ' + user1Token)
                .send({
                    otherUserId: user2.id,
                    messageBody: testMessage,
                })
                .expect(200);

            expect(response.body.id).toBeDefined();
            expect(response.body.messages.length).toEqual(1);
            expect(response.body.messages[0].body).toEqual(testMessage);
            expect(response.body.users.length).toEqual(2);
            expect(response.body.users[0].id === user1.id || response.body.users[0].id === user2.id).toBe(true);
            expect(response.body.users[1].id === user1.id || response.body.users[1].id === user2.id).toBe(true);
        });

        it ('denies new chats with chat ID or second user ID', async () => {
            const singleUser = await createTestUser();
            const token = await getTokenForUserId(singleUser.id);
            const response = await request(strapi.server)
                .post('/chats/new-message')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    messageBody: 'test',
                })
                .expect(400);
        });

        it ('denies new chats without a message body', async () => {
            const user1 = await createTestUser();
            const user2 = await createTestUser();
            const token = await getTokenForUserId(user1.id);

            await request(strapi.server)
                .post('/chats/new-message')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    otherUserId: user2.id,
                })
                .expect(400);
        });

        it ('allows an authenticated user to post new messages to existing chats', async () => {
            const user1 = await createTestUser();
            const user2 = await createTestUser();
            const user1Token = await getTokenForUserId(user1.id);
            const user2Token = await getTokenForUserId(user2.id);
            const message1Body = 'test message 1';
            const message2Body = 'test message 2';
            const message3Body = 'test message 3';

            // create the chat
            const createChatResponse = await request(strapi.server)
                .post('/chats/new-message')
                .set('Authorization', 'Bearer ' + user1Token)
                .send({
                    otherUserId: user2.id,
                    messageBody: message1Body,
                })
                .expect(200);
            await request(strapi.server)
                .post('/chats/new-message')
                .set('Authorization', 'Bearer ' + user1Token)
                .send({
                    chatId: createChatResponse.body.id,
                    messageBody: message2Body,
                })
                .expect(200);
            const finalResponse = await request(strapi.server)
                .post('/chats/new-message')
                .set('Authorization', 'Bearer ' + user2Token)
                .send({
                    otherUserId: user1.id,
                    messageBody: message3Body,
                })
                .expect(200);

            expect(finalResponse.body.messages.length).toEqual(3);
            expect(finalResponse.body.messages[0].body).toEqual(message1Body);
            expect(finalResponse.body.messages[1].body).toEqual(message2Body);
            expect(finalResponse.body.messages[2].body).toEqual(message3Body);
        });
    });
});
