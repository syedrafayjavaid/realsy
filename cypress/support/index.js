// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import './commands'
import faker from "faker";

export const FRONTEND_URL = 'http://localhost:3000';
export const API_URL = 'http://localhost:3001';

export function getByTestId(testId) {
    return cy.get(`[data-testid=${testId}]`);
}

/**
 * Registers a new user, with optional faked credentials
 * @param givenEmail
 * @param givenPassword
 */
export function registerUser(givenEmail = null, givenPassword = null) {
    const email = givenEmail ?? faker.internet.email();
    const password = givenPassword ?? faker.internet.password()

    cy.visit(FRONTEND_URL);
    getByTestId('account-menu-button').click();
    getByTestId('register-button').click();
    cy.get('[name=email]').type(email);
    cy.get('[name=password').type(password);
    cy.get('[name=passwordConfirm').type(password);
    getByTestId('register-submit-button').click();
}

/**
 * Signs a user in through the frontend
 */
export function signIn(email, password) {
    cy.visit(FRONTEND_URL);
    getByTestId('account-menu-button').click();
    cy.get('[name=email]').type(email);
    cy.get('[name=password]').type(password);
    getByTestId('submit-button').click();
}

/**
 * Signs the current user out
 */
export function signOut() {
    getByTestId('account-menu-button').trigger('mouseover', {force: true});
    cy.wait(200);
    // TODO: this should not be a forced click.
    //  Cypress has problems recognizing the dropdown menu is visible, so we force it
    getByTestId('sign-out-button').click({force: true});
    cy.url().should('include', 'sign-out');
    cy.wait(4500);
}

/**
 * Creates a listing for the signed in user
 */
export function createListing() {
    cy.visit(FRONTEND_URL + '/account/dashboard');
    getByTestId('sidebar-link-listings').click();
    cy.url().should('include', 'account/listings');
    cy.contains('List now!').click();

    getByTestId('address-input').type('245 Chesser Loop Rd');
    getByTestId('city-input').type('Chelsea');
    getByTestId('zip-code-input').type('35043');
    getByTestId('next-button').click();

    getByTestId('valuation-summary').invoke('text').then(firstValuation => {
        getByTestId('bedroom-count-select').select('5');
        getByTestId('bathroom-count-select').select('5');
        getByTestId('update-button').click();
        cy.wait(2000);
        getByTestId('valuation-summary').invoke('text').then(newValuation => {
            expect(newValuation).to.not.equal(firstValuation);
        })
        getByTestId('next-button').click();
        getByTestId('submit-button').click();

        cy.url().should('contain', 'account/listings');
    });
}

/**
 * Registers a user through the API (faster than graphical nav)
 */
export async function registerUserThroughApi(givenEmail = null, givenPassword = null) {
    const email = givenEmail ?? faker.internet.email();
    const password = givenPassword ?? faker.internet.password();
    return new Promise(resolve => {
        cy.request('POST', API_URL + '/auth/local/register', {username: email, email, password}).then(registerResponse => {
            resolve(registerResponse.body);
        });
    });
}

export async function createListingWithToken(token) {
    return new Promise(resolve => {
        cy.request({
            method: 'POST',
            headers: {Authorization: 'Bearer ' + token},
            url: API_URL + '/listings',
            body: {
                address: '245 Chessor Loopr Rd',
                city: 'Chelsea',
                state: 'AL',
                zipCode: '35043',
            },
        }).then(listingResponse => {
            resolve(listingResponse.body);
        });
    });
}

export async function createOfferWithToken(token, listingId) {
    return new Promise(resolve => {
        cy.request({
            method: 'POST',
            headers: {Authorization: 'Bearer ' + token},
            url: API_URL + '/offers',
            body: {
                listing: listingId,
                amount: 250000,
            },
        }).then(offerResponse => {
            resolve(offerResponse.body);
        });
    });
}

/**
 * Creates a listing through the API (faster than graphical navigation)
 */
export async function createListingThroughApi(noUser = false) {
    const email = faker.internet.email();
    const password = faker.internet.password();
    return new Promise(resolve => {
        cy.request('POST', API_URL + '/auth/local/register', {username: email, email, password}).then(registerResponse => {
            const headers = noUser ? {} : {Authorization: 'Bearer ' + registerResponse.body.jwt};
            cy.request({
                method: 'POST',
                headers,
                url: API_URL + '/listings',
                body: {
                    address: '245 Chessor Loopr Rd',
                    city: 'Chelsea',
                    state: 'AL',
                    zipCode: '35043',
                },
            }).then(listingResponse => {
                resolve(listingResponse.body);
            });
        });
    })
}
