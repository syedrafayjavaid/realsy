import {UserNotificationService} from "api/user-notifications/user-notification-service";
import {initializeStrapi, teardownStrapi} from "__tests__/helpers/strapi-helpers";
import {createTestUser} from "__tests__/helpers/auth-helpers";

/**
 * @group integration
 */
describe ('User Notification Service', () => {
    beforeAll(async () => {
        await initializeStrapi();
    });

    afterAll(() => {
        teardownStrapi();
    });

    it ('creates user notifications', async () => {
        const user = await createTestUser();
        const service = new UserNotificationService();
        const testHeading = 'Test Notification';
        const testSubheading = 'This notification is a test';
        const testBody = 'This is longer content that can be shown in a larger view';
        const testLink = 'https://www.google.com';

        const result = await service.createUserNotification({
            userId: user.id,
            heading: testHeading,
            subheading: testSubheading,
            body: testBody,
            link: testLink,
        });

        expect(result.heading).toEqual(testHeading);
        expect(result.subheading).toEqual(testSubheading);
        expect(result.body).toEqual(testBody);
        expect(result.link).toEqual(testLink);
    });

    it ('gets notifications for a given user', async () => {
        const user = await createTestUser();
        const differentUser = await createTestUser();
        const service = new UserNotificationService();
        const testHeading = 'Test Notification';
        const testSubheading = 'This notification is a test';
        const testBody = 'This is longer content that can be shown in a larger view';
        const testLink = 'https://www.google.com';

        await service.createUserNotification({
            userId: user.id,
            heading: testHeading,
            subheading: testSubheading,
            body: testBody,
            link: testLink,
        });
        await service.createUserNotification({
            userId: differentUser.id,
            heading: testHeading,
            subheading: testSubheading,
            body: testBody,
            link: testLink,
        });

        const result = await service.getUserNotifications({userId: user.id});

        expect(result.length).toEqual(1);
        expect(result[0].heading).toEqual(testHeading);
        expect(result[0].subheading).toEqual(testSubheading);
        expect(result[0].body).toEqual(testBody);
        expect(result[0].link).toEqual(testLink);
    });

    it ('deletes notifications for a given user and related content', async () => {
        const user = await createTestUser();
        const otherUser = await createTestUser();
        const service = new UserNotificationService();
        const testHeading = 'Test Notification';
        const testSubheading = 'This notification is a test';
        const testBody = 'This is longer content that can be shown in a larger view';
        const testContentType = 'test-type';
        const testContentId = 7;

        const relatedNotification = await service.createUserNotification({
            userId: user.id,
            heading: testHeading,
            subheading: testSubheading,
            body: testBody,
            relatedContentType: testContentType,
            relatedContentId: testContentId.toString(),
        });
        const notificationForOtherUser = await service.createUserNotification({
            userId: otherUser.id,
            heading: testHeading,
            subheading: testSubheading,
            body: testBody,
            relatedContentType: testContentType,
            relatedContentId: testContentId.toString(),
        });
        const notificationForOtherContentId = await service.createUserNotification({
            userId: user.id,
            heading: testHeading,
            subheading: testSubheading,
            body: testBody,
            relatedContentType: testContentType,
            relatedContentId: (testContentId + 1).toString(),
        });
        const notificationForOtherContentType = await service.createUserNotification({
            userId: user.id,
            heading: testHeading,
            subheading: testSubheading,
            body: testBody,
            relatedContentType: 'other-type',
            relatedContentId: testContentId.toString(),
        });
        const unrelatedNotification = await service.createUserNotification({
            userId: user.id,
            heading: testHeading,
            subheading: testSubheading,
            body: testBody,
            relatedContentType: 'random-type',
            relatedContentId: (testContentId + 9).toString(),
        });
        const nonContentRelatedNotification = await service.createUserNotification({
            userId: user.id,
            heading: testHeading,
            subheading: testSubheading,
            body: testBody,
            link: 'https://www.google.com',
        })

        const deletedNotifications = await service.deleteNotificationsForUser({
            userId: user.id,
            relatedContentType: testContentType,
            relatedContentId: testContentId,
        });

        const notificationsLeft = await service.getUserNotifications({userId: user.id});
        expect(notificationsLeft.length).toEqual(4);

        const notificationsForOtherUser = await service.getUserNotifications({userId: otherUser.id});
        expect(notificationsForOtherUser.length).toEqual(1);
    });
});
