import {initializeStrapi, teardownStrapi} from "__tests__/helpers/strapi-helpers";
import request from 'supertest';
import {createTestUser, getTokenForUserId} from "__tests__/helpers/auth-helpers";
import {createTestListing} from "__tests__/helpers/create-test-listing";

describe ('Listings Feature Tests', () => {
    beforeAll(async () => {
        await initializeStrapi();
    });

    afterAll(() => {
        teardownStrapi();
    });

    describe ('fetching listings', () => {
        it ('provides listings to unauthenticated users', async () => {
            await request(strapi.server)
                .get('/listings')
                .expect(200);
        });

        it ('provides listings to authenticated users', async () => {
            const user = await createTestUser();
            const token = await getTokenForUserId(user.id);
            await request(strapi.server)
                .get('/listings')
                .set('Authorization', 'Bearer ' + token)
                .expect(200);
        });
    });

    describe ('posting listings', () => {
        it ('denies posted listings from unauthenticated users', async () => {
            await request(strapi.server)
                .post('/listings')
                .expect(403);
        });

        it ('accepts listings from authorized users', async () => {
            const user = await createTestUser();
            const token = await getTokenForUserId(user.id);

            await request(strapi.server)
                .post('/listings')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    address: '1234 Hickory St',
                    city: 'Omaha',
                    state: 'NE',
                    zipCode: '68105',
                })
                .expect(200);
        });

        it ('denies new listings for an address which already has an active listing', async () => {
            const savedEnv = process.env.ALLOW_DUPLICATE_LISTINGS
            process.env.ALLOW_DUPLICATE_LISTINGS = 'false';
            const user = await createTestUser();
            const token = await getTokenForUserId(user.id);

            await request(strapi.server)
                .post('/listings')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    address: '1234 Hickory St',
                    city: 'Omaha',
                    state: 'NE',
                    zipCode: '68105',
                })
                .expect(200);
            const response = await request(strapi.server)
                .post('/listings')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    address: '1234 Hickory St',
                    city: 'Omaha',
                    state: 'NE',
                    zipCode: '68105',
                })
                .expect(200);

            expect(response.body.error).toBe(true);
            expect(response.body.message).toEqual('duplicate-listing');

            process.env.ALLOW_DUPLICATE_LISTINGS = savedEnv;
        });

        it ('copies default listing steps into new listings', async () => {
            const user = await createTestUser();
            const token = await getTokenForUserId(user.id);

            const listingResponse = await request(strapi.server)
                .post('/listings')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    address: '1234 Hickory St',
                    city: 'Omaha',
                    state: 'NE',
                    zipCode: '68105',
                })
                .expect(200);

            expect(listingResponse.body.steps.length).toBeGreaterThan(0);
        })
    });

    describe ('home valuations', () => {
        it ('fetches home valuations for authenticated users', async () => {
            const user = await createTestUser();
            const token = await getTokenForUserId(user.id);

            await request(strapi.server)
                .get('/listings/check-value')
                .set('Authorization', 'Bearer ' + token)
                .query({
                    address: '1007 S 37th St',
                    city: 'Omaha',
                    state: 'NE',
                    zipCode: '68105',
                })
                .expect(200);
        });

        it ('denies home valuation requests for unauthenticated users', async () => {
            await request(strapi.server)
                .get('/listings/check-value')
                .expect(403);
        });
    });

    describe ('listing favorites', () => {
        it ('allows an authenticated user to favorite and un-favorite a listing', async () => {
            const user = await createTestUser();
            const token = await getTokenForUserId(user.id);
            const listing = await createTestListing();

            const favoriteResponse = await request(strapi.server)
                .put('/listings/set-favorite')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    listingId: listing.id,
                    favorite: 'true',
                })
                .expect(200);

            expect(favoriteResponse.body.length).toEqual(1);
            expect(favoriteResponse.body[0].id).toEqual(listing.id);

            const unFavoriteResponse = await request(strapi.server)
                .put('/listings/set-favorite')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    listingId: listing.id.toString(),
                    favorite: false,
                })
                .expect(200);

            expect(unFavoriteResponse.body.length).toEqual(0);
        });

        it ('does not favorite a listing more than once', async () => {
            const user = await createTestUser();
            const token = await getTokenForUserId(user.id);
            const listing = await createTestListing();

            await request(strapi.server)
                .put('/listings/set-favorite')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    listingId: listing.id,
                    favorite: 'true',
                })
                .expect(200);

            await request(strapi.server)
                .put('/listings/set-favorite')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    listingId: listing.id,
                    favorite: 'true',
                })
                .expect(200);

            const fetchFavoritesResponse = await request(strapi.server)
                .get('/listings/my-saved')
                .set('Authorization', 'Bearer ' + token)
                .expect(200);

            expect(fetchFavoritesResponse.body.length).toEqual(1);
        });

        it ('fetches an authenticated users favorited listings', async () => {
            const user = await createTestUser();
            const token = await getTokenForUserId(user.id);
            const listing = await createTestListing();

            await request(strapi.server)
                .put('/listings/set-favorite')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    listingId: listing.id,
                    favorite: 'true',
                })
                .expect(200);

            const fetchFavoritesResponse = await request(strapi.server)
                .get('/listings/my-saved')
                .set('Authorization', 'Bearer ' + token)
                .expect(200);

            expect(fetchFavoritesResponse.body.length).toEqual(1);
            expect(fetchFavoritesResponse.body[0].id).toEqual(listing.id);
        });
    });
});
