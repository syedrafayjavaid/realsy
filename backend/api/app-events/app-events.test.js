import {afterAll, beforeAll} from "@jest/globals";
import faker from 'faker';
import {initializeStrapi, teardownStrapi} from "__tests__/helpers/strapi-helpers";
import {createTestUser, getTokenForUserId} from "__tests__/helpers/auth-helpers";

const request = require('supertest');

describe ('App Events Feature Tests', () => {
    beforeAll(async () => {
        await initializeStrapi({clearDatabase: true});
    });

    afterAll(async () => {
        teardownStrapi();
    });

    it ('Sends text to listing owner when a visit is requested', async () => {
        const owner = await createTestUser(process.env.TEST_EMAIL);
        const ownerToken = await getTokenForUserId(owner.id);
        const requester = await createTestUser();
        const requesterToken = await getTokenForUserId(requester.id);

        await request(strapi.server)
            .put('/user-profiles/me')
            .set('Authorization', 'Bearer ' + ownerToken)
            .send({
                contactText: true,
                contactEmail: true,
                phone: process.env.TEST_PHONE_NUMBER,
            })
            .expect(200);

        const listingResponse = await request(strapi.server)
            .post('/listings')
            .set('Authorization', 'Bearer ' + ownerToken)
            .send({
                address: faker.address.streetAddress(),
                city: faker.address.city(),
                state: faker.address.stateAbbr(),
                zipCode: faker.address.zipCode('#####'),
            })
            .expect(200);

        await request(strapi.server)
            .post('/scheduled-events/request-visit')
            .set('Authorization', 'Bearer ' + requesterToken)
            .send({
                listingId: listingResponse.body.id,
            })
            .expect(200);

        // text message and email will be sent to env var TEST_PHONE_NUMBER and TEST_EMAIL if not disabled in .env.test
    });
});
