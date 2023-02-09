import {afterAll, beforeAll, describe, it} from "@jest/globals";
import * as faker from 'faker';
import {createTestUser, getTokenForUserId} from "../helpers/auth-helpers";
import {initializeStrapi, teardownStrapi} from "__tests__/helpers/strapi-helpers";

const request = require('supertest');

/**
 * @group e2e
 * @group auth
 */
describe ('Auth Feature Tests', () => {
    beforeAll(async () => {
        await initializeStrapi();
    });

    afterAll(async () => {
        teardownStrapi();
    });

    it ('registers a user by email and password', async () => {
        const testEmail = faker.internet.email().toLowerCase();

        const registerResponse = await request(strapi.server)
            .post('/auth/local/register')
            .send({
                username: testEmail,
                email: testEmail,
                password: faker.internet.password(),
            })
            .expect(200);

        expect(registerResponse.body.jwt).toBeDefined();
        expect(registerResponse.body.jwt).not.toBeNull();
        expect(registerResponse.body.user.email).toEqual(testEmail);
    });

    it ('does not register the same email twice', async () => {
        const testEmail = faker.internet.email().toLowerCase();
        await createTestUser(testEmail);

        const registerResponse = await request(strapi.server)
            .post('/auth/local/register')
            .send({
                username: testEmail,
                email: testEmail,
                password: faker.internet.password(),
            })
            .expect(400);

        expect(registerResponse.body.message[0].messages[0].id).toEqual('Auth.form.error.email.taken');
    });

    it ('authenticates a user', async done => {
        const testEmail = faker.internet.email().toLowerCase();
        const testPassword = faker.internet.password();

        await createTestUser(testEmail, testPassword);

        await request(strapi.server)
            .post('/auth/local')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({
                identifier: testEmail,
                password: testPassword,
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(data => {
                expect(data.body.jwt).toBeDefined();
            });

        done();
    });

    it ('provides the profile for an authenticated user', async done => {
        const testEmail = faker.internet.email();
        const user = await createTestUser(testEmail);
        const jwt = await getTokenForUserId(user.id);

        await request(strapi.server)
            .get('/users/me')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(data => {
                expect(data.body).toBeDefined();
                expect(data.body.id).toBe(user.id);
                expect(data.body.username).toBe(user.username);
                expect(data.body.email).toBe(user.email);
            });

        done();
    });

    it ('sets a new users availability to maximum', async () => {
        const testEmail = faker.internet.email().toLowerCase();

        const registerResponse = await request(strapi.server)
            .post('/auth/local/register')
            .send({
                username: testEmail,
                email: testEmail,
                password: faker.internet.password(),
            })
            .expect(200);

        expect(registerResponse.body.jwt).toBeDefined();
        expect(registerResponse.body.jwt).not.toBeNull();
        expect(registerResponse.body.user.availableSundayStart).toContain('07:00:00');
        expect(registerResponse.body.user.availableSundayEnd).toContain('22:00:00');
        expect(registerResponse.body.user.availableMondayStart).toContain('07:00:00');
        expect(registerResponse.body.user.availableMondayEnd).toContain('22:00:00');
        expect(registerResponse.body.user.availableTuesdayStart).toContain('07:00:00');
        expect(registerResponse.body.user.availableTuesdayEnd).toContain('22:00:00');
        expect(registerResponse.body.user.availableSaturdayStart).toContain('07:00:00');
        expect(registerResponse.body.user.availableSaturdayEnd).toContain('22:00:00');
    });
});
