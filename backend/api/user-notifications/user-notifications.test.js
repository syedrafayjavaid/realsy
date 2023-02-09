import {initializeStrapi, teardownStrapi} from "__tests__/helpers/strapi-helpers";
import {createTestUser, getTokenForUserId} from "__tests__/helpers/auth-helpers";
import {UserNotificationService} from "api/user-notifications/user-notification-service";

const request = require('supertest');

/**
 * Tests actual requests to a spun up test API
 * @group integration
 */
describe ('User Notifications - Feature Tests', () => {
    beforeAll(async () => {
        await initializeStrapi();
    })

    afterAll(() => {
        teardownStrapi();
    });

    describe ('Notification creation', () => {
        it ('deletes existing notifications for the same user and content', async () => {
            const user = await createTestUser();
            const contentType = 'test-type';
            const contentId = '7';

            const notification1 = await strapi.query('user-notifications', '').create({
                user,
                relatedContentType: contentType,
                relatedContentId: contentId,
            });
            const notification2 = await strapi.query('user-notifications', '').create({
                user,
                relatedContentType: contentType,
                relatedContentId: contentId,
            });

            const activeNotifications = await strapi.query('user-notifications', '').find({
                user: user.id,
                relatedContentType: contentType,
                relatedContentId: contentId,
            });

            expect(activeNotifications.length).toEqual(1);
            expect(activeNotifications[0].id).toEqual(notification2.id);
        });
    });

    describe ('GET /', () => {
        it ('requires authentication', async () => {
            await request(strapi.server).get('/user-notifications').expect(403);
        });

        it ('filters notifications to the authenticated user', async () => {
            const user = await createTestUser();
            const otherUser = await createTestUser();
            const token = await getTokenForUserId(user.id);
            const notificationService = new UserNotificationService();
            await notificationService.createUserNotification({
                userId: user.id,
            });
            await notificationService.createUserNotification({
                userId: otherUser.id,
            });

            const response = await request(strapi.server)
                .get('/user-notifications')
                .set('Authorization', 'Bearer ' + token)
                .expect(200);

            expect(response.body.length).toEqual(1);
            expect(response.body[0].user.id).toEqual(user.id);
        });

        it ('gets notifications related to given content', async () => {
            const user = await createTestUser();
            const otherUser = await createTestUser();
            const token = await getTokenForUserId(user.id);
            const notificationService = new UserNotificationService();

            const expectedNotification = await notificationService.createUserNotification({
                userId: user.id,
                relatedContentType: 'test-type',
                relatedContentId: 1,
            });
            await notificationService.createUserNotification({
                userId: user.id,
                relatedContentType: 'test-type',
                relatedContentId: 2,
            });
            await notificationService.createUserNotification({
                userId: user.id,
                relatedContentType: 'other-type',
                relatedContentId: 1,
            });
            await notificationService.createUserNotification({
                userId: otherUser.id,
                relatedContentType: 'test-type',
                relatedContentId: 1,
            });

            const response = await request(strapi.server)
                .get('/user-notifications')
                .query({
                    relatedContentType: 'test-type',
                    relatedContentId: 1,
                })
                .set('Authorization', 'Bearer ' + token)
                .expect(200);

            expect(response.body.length).toEqual(1);
            expect(response.body[0].id).toEqual(expectedNotification.id);
        });

        it ('gets notifications related to given content type', async () => {
            const user = await createTestUser();
            const otherUser = await createTestUser();
            const token = await getTokenForUserId(user.id);
            const notificationService = new UserNotificationService();

            const expectedNotification = await notificationService.createUserNotification({
                userId: user.id,
                relatedContentType: 'test-type',
                relatedContentId: 1,
            });
            const secondNotificationOfSameType = await notificationService.createUserNotification({
                userId: user.id,
                relatedContentType: 'test-type',
                relatedContentId: 2,
            });
            await notificationService.createUserNotification({
                userId: user.id,
                relatedContentType: 'other-type',
                relatedContentId: 1,
            });
            await notificationService.createUserNotification({
                userId: otherUser.id,
                relatedContentType: 'test-type',
                relatedContentId: 1,
            });

            const response = await request(strapi.server)
                .get('/user-notifications')
                .query({
                    relatedContentType: 'test-type',
                })
                .set('Authorization', 'Bearer ' + token)
                .expect(200);

            expect(response.body.length).toEqual(2);
            expect(response.body[0].id).toEqual(expectedNotification.id);
            expect(response.body[1].id).toEqual(secondNotificationOfSameType.id);
        });
    });

    describe ('DELETE /', () => {
        it ('deletes a single notification owned by an authenticated user', async () => {
            const user = await createTestUser();
            const token = await getTokenForUserId(user.id);
            const notificationService = new UserNotificationService();

            const expectedNotification = await notificationService.createUserNotification({
                userId: user.id,
            });

            const response = await request(strapi.server)
                .delete('/user-notifications/' + expectedNotification.id)
                .set('Authorization', 'Bearer ' + token)
                .expect(200);

            expect (response.body.id).toEqual(expectedNotification.id);
        });

        it ('deletes notifications owned by an authenticated user', async () => {
            const user = await createTestUser();
            const otherUser = await createTestUser();
            const token = await getTokenForUserId(user.id);
            const notificationService = new UserNotificationService();

            const expectedNotification = await notificationService.createUserNotification({
                userId: user.id,
            });
            await notificationService.createUserNotification({
                userId: otherUser.id,
            });

            const response = await request(strapi.server)
                .delete('/user-notifications')
                .set('Authorization', 'Bearer ' + token)
                .expect(200);

            expect(response.body.length).toEqual(1);
            expect(response.body[0].id).toEqual(expectedNotification.id);

            // make sure the other user's notification is left alone
            const leftoverNotifications = await strapi.query('user-notifications', '').find({
                user: otherUser.id,
            });
            expect(leftoverNotifications.length).toEqual(1);
        });

        it ('deletes notifications of a given content type', async () => {
            const user = await createTestUser();
            const token = await getTokenForUserId(user.id);
            const notificationService = new UserNotificationService();
            const testContentType = 'test-type';

            const expectedNotification = await notificationService.createUserNotification({
                userId: user.id,
                relatedContentType: testContentType,
            });

            // create extra notifications to check they aren't deleted
            await notificationService.createUserNotification({
                userId: user.id,
                relatedContentType: 'other-type',
            });
            await notificationService.createUserNotification({
                userId: user.id,
            });

            const tmp = await strapi.query('user-notifications', '').find({
                user: user.id,
            });

            const response = await request(strapi.server)
                .delete('/user-notifications')
                .query({
                    relatedContentType: testContentType,
                })
                .set('Authorization', 'Bearer ' + token)
                .expect(200);

            expect(response.body.length).toEqual(1);
            expect(response.body[0].id).toEqual(expectedNotification.id);

            const leftOverNotifications = await strapi.query('user-notifications', '').find({user: user.id});
            expect(leftOverNotifications.length).toEqual(2);
        });

        it ('deletes notifications related to a given content type and ID', async () => {
            const user = await createTestUser();
            const token = await getTokenForUserId(user.id);
            const notificationService = new UserNotificationService();
            const testContentType = 'test-type';
            const testContentId = 7;

            const expectedNotification = await notificationService.createUserNotification({
                userId: user.id,
                relatedContentType: testContentType,
                relatedContentId: testContentId,
            });

            // create some other notifications to make sure they aren't deleted
            await notificationService.createUserNotification({
                userId: user.id,
                relatedContentType: testContentType,
                relatedContentId: testContentId - 1,
            });
            await notificationService.createUserNotification({
                userId: user.id,
                relatedContentType: 'other-type',
                relatedContentId: testContentId,
            });

            const response = await request(strapi.server)
                .delete('/user-notifications')
                .query({
                    relatedContentType: testContentType,
                    relatedContentId: testContentId,
                })
                .set('Authorization', 'Bearer ' + token)
                .expect(200);

            expect(response.body.length).toEqual(1);
            expect(response.body[0].id).toEqual(expectedNotification.id);

            const leftoverNotifications = await strapi.query('user-notifications', '').find({user: user.id});
            expect(leftoverNotifications.length).toEqual(2);
        });
    });
});
