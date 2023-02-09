import {initializeStrapi, teardownStrapi} from "__tests__/helpers/strapi-helpers";
import request from 'supertest';
import {createTestUser, getTokenForUserId} from "__tests__/helpers/auth-helpers";
import {createTestListing} from "__tests__/helpers/create-test-listing";

describe ('Scheduled Events Feature Tests', () => {
    beforeAll(async () => {
        await initializeStrapi();
    });

    afterAll(() => {
        teardownStrapi();
    });

    it ('allows an authenticated user to create a visit request', async () => {
        const user = await createTestUser();
        const token = await getTokenForUserId(user.id);
        const listing = await createTestListing();

        const response = await request(strapi.server)
            .post('/scheduled-events/request-visit')
            .set('Authorization', 'Bearer ' + token)
            .send({listingId: listing.id})
            .expect(200);

        expect(response.body.listing.id).toEqual(listing.id);
        expect(response.body.user.id).toEqual(user.id);
    });

    it ('denies visit requests from unauthenticated users', async () => {
        const response = await request(strapi.server)
            .post('/scheduled-events/request-visit')
            .expect(403);
    });

    it ('allows authenticated users to fetch their requested visits', async () => {
        const user = await createTestUser();
        const token = await getTokenForUserId(user.id);
        const listing = await createTestListing();

        // create request
        await request(strapi.server)
            .post('/scheduled-events/request-visit')
            .set('Authorization', 'Bearer ' + token)
            .send({listingId: listing.id})
            .expect(200);

        const response = await request(strapi.server)
            .get('/scheduled-events/my-requested')
            .set('Authorization', 'Bearer ' + token)
            .expect(200);

        expect(response.body.length).toEqual(1);
        expect(response.body[0].listing.id).toEqual(listing.id);
        expect(response.body[0].user).toEqual(user.id);
    });
});
