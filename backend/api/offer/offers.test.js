import {initializeStrapi, teardownStrapi} from "__tests__/helpers/strapi-helpers";
import request from 'supertest';
import {createTestUser, getTokenForUserId} from "__tests__/helpers/auth-helpers";
import {createTestListing} from "__tests__/helpers/create-test-listing";

describe ('Offers e2e tests', () => {
    beforeAll(async () => {
        await initializeStrapi();
    });

    afterAll(() => {
        teardownStrapi();
    });

    it ('denies offers from unauthenticated users', async () => {
        await request(strapi.server)
            .post('/offers')
            .expect(403);
    });

    it ('accepts offers from authenticated users', async () => {
        const user = await createTestUser();
        const token = await getTokenForUserId(user.id);
        const listing = await createTestListing();

        const response = await request(strapi.server)
            .post('/offers')
            .set('Authorization', 'Bearer ' + token)
            .send({
                listing: listing.id,
                amount: 250000,
            })
            .expect(200);
    });

    it ('requires a listing associated with an offer', async () => {
        const user = await createTestUser();
        const token = await getTokenForUserId(user.id);
        await request(strapi.server)
            .post('/offers')
            .set('Authorization', 'Bearer ' + token)
            .send({
                amount: 250000,
            })
            .expect(400);
    });

    it ('allows an authenticated user to check if they have an offer on a listing', async () => {
        const offeror = await createTestUser();
        const offerorToken = await getTokenForUserId(offeror.id);
        const listing = await createTestListing();

        const offerResponse = await request(strapi.server)
            .get('/listings/check-offer')
            .query(({listingId: listing.id}))
            .set('Authorization', 'Bearer ' + offerorToken)
            .expect(200);
    });

    it ('allows a listing owner to accept an offer', async () => {
        const listingOwner = await createTestUser();
        const offeror = await createTestUser();
        const listingOwnerToken = await getTokenForUserId(listingOwner.id);
        const offerorToken = await getTokenForUserId(offeror.id);
        const listing = await createTestListing({ownerId: listingOwner.id});

        const offerResponse = await request(strapi.server)
            .post('/offers')
            .set('Authorization', 'Bearer ' + offerorToken)
            .send({
                listing: listing.id,
                amount: 250000,
            })
            .expect(200);

        await request(strapi.server)
            .put('/offers/accept')
            .set('Authorization', 'Bearer ' + listingOwnerToken)
            .send({
                offerId: offerResponse.body.id
            })
            .expect(200);
    });

    it ('allows a listing owner to decline an offer', async () => {
        const listingOwner = await createTestUser();
        const offeror = await createTestUser();
        const listingOwnerToken = await getTokenForUserId(listingOwner.id);
        const offerorToken = await getTokenForUserId(offeror.id);
        const listing = await createTestListing({ownerId: listingOwner.id});

        const offerResponse = await request(strapi.server)
            .post('/offers')
            .set('Authorization', 'Bearer ' + offerorToken)
            .send({
                listing: listing.id,
                amount: 250000,
            })
            .expect(200);

        await request(strapi.server)
            .put('/offers/decline')
            .set('Authorization', 'Bearer ' + listingOwnerToken)
            .send({
                offerId: offerResponse.body.id
            })
            .expect(200);
    });

    it ('allows a listing owner to counter an offer', async () => {
        const listingOwner = await createTestUser();
        const offeror = await createTestUser();
        const listingOwnerToken = await getTokenForUserId(listingOwner.id);
        const offerorToken = await getTokenForUserId(offeror.id);
        const listing = await createTestListing({ownerId: listingOwner.id});

        const offerResponse = await request(strapi.server)
            .post('/offers')
            .set('Authorization', 'Bearer ' + offerorToken)
            .send({
                listing: listing.id,
                amount: 250000,
            })
            .expect(200);

        await request(strapi.server)
            .post('/offers/counter')
            .set('Authorization', 'Bearer ' + listingOwnerToken)
            .send({
                offerId: offerResponse.body.id,
                amount: 230000,
                closingDate: (new Date()).toISOString(),
            })
            .expect(200);
    });

    it ('allows an offeror to accept a counter offer', async () => {
        const listingOwner = await createTestUser();
        const offeror = await createTestUser();
        const listingOwnerToken = await getTokenForUserId(listingOwner.id);
        const offerorToken = await getTokenForUserId(offeror.id);
        const listing = await createTestListing({ownerId: listingOwner.id});

        const offerResponse = await request(strapi.server)
            .post('/offers')
            .set('Authorization', 'Bearer ' + offerorToken)
            .send({
                listing: listing.id,
                amount: 250000,
            })
            .expect(200);

        await request(strapi.server)
            .post('/offers/counter')
            .set('Authorization', 'Bearer ' + listingOwnerToken)
            .send({
                offerId: offerResponse.body.id,
                amount: 230000,
                closingDate: (new Date()).toISOString(),
            })
            .expect(200);

        const acceptResponse = await request(strapi.server)
            .put('/offers/accept')
            .set('Authorization', 'Bearer ' + offerorToken)
            .send({offerId: offerResponse.body.id})
            .expect(200);

        expect(acceptResponse.body.status).toEqual('accepted');
    });

    it ('allows an offeror to decline a counter offer', async () => {
        const listingOwner = await createTestUser();
        const offeror = await createTestUser();
        const listingOwnerToken = await getTokenForUserId(listingOwner.id);
        const offerorToken = await getTokenForUserId(offeror.id);
        const listing = await createTestListing({ownerId: listingOwner.id});

        const offerResponse = await request(strapi.server)
            .post('/offers')
            .set('Authorization', 'Bearer ' + offerorToken)
            .send({
                listing: listing.id,
                amount: 250000,
            })
            .expect(200);

        await request(strapi.server)
            .post('/offers/counter')
            .set('Authorization', 'Bearer ' + listingOwnerToken)
            .send({
                offerId: offerResponse.body.id,
                amount: 230000,
                closingDate: (new Date()).toISOString(),
            })
            .expect(200);

        const acceptResponse = await request(strapi.server)
            .put('/offers/decline')
            .set('Authorization', 'Bearer ' + offerorToken)
            .send({offerId: offerResponse.body.id})
            .expect(200);

        expect(acceptResponse.body.status).toEqual('declined');
    });

    it ('denies an offeror accepting their own offer', async () => {
        const listingOwner = await createTestUser();
        const offeror = await createTestUser();
        const offerorToken = await getTokenForUserId(offeror.id);
        const listing = await createTestListing({ownerId: listingOwner.id});

        const offerResponse = await request(strapi.server)
            .post('/offers')
            .set('Authorization', 'Bearer ' + offerorToken)
            .send({
                listing: listing.id,
                amount: 250000,
            })
            .expect(200);

        await request(strapi.server)
            .put('/offers/accept')
            .set('Authorization', 'Bearer ' + offerorToken)
            .send({
                offerId: offerResponse.body.id,
            })
            .expect(401);
    });

    it ('allows an offeror to counter-offer a counter-offer', async () => {
        const listingOwner = await createTestUser();
        const offeror = await createTestUser();
        const listingOwnerToken = await getTokenForUserId(listingOwner.id);
        const offerorToken = await getTokenForUserId(offeror.id);
        const listing = await createTestListing({ownerId: listingOwner.id});

        const offerResponse = await request(strapi.server)
            .post('/offers')
            .set('Authorization', 'Bearer ' + offerorToken)
            .send({
                listing: listing.id,
                amount: 250000,
            })
            .expect(200);

        await request(strapi.server)
            .post('/offers/counter')
            .set('Authorization', 'Bearer ' + listingOwnerToken)
            .send({
                offerId: offerResponse.body.id,
                amount: 230000,
                closingDate: (new Date()).toISOString(),
            })
            .expect(200);

        const acceptResponse = await request(strapi.server)
            .post('/offers/counter')
            .set('Authorization', 'Bearer ' + offerorToken)
            .send({
                offerId: offerResponse.body.id,
                amount: 900000,
                closingDate: (new Date()).toISOString(),
            })
            .expect(200);

        expect(acceptResponse.body.status).toEqual('pending_lister');
    });
});
