import faker from "faker";
import {
    createListingWithToken,
    FRONTEND_URL,
    getByTestId,
    registerUser,
    registerUserThroughApi, signIn,
    signOut
} from "../support";

describe ('User Chat', () => {
    it ('allows buyers and listing owners to chat', () => {
        const ownerEmail = faker.internet.email();
        const ownerPassword = faker.internet.password();
        const buyerEmail = faker.internet.email();
        const buyerPassword = faker.internet.password();

        registerUserThroughApi(ownerEmail, ownerPassword).then(ownerResponse => {
            createListingWithToken(ownerResponse.jwt).then(listing => {
                registerUser(buyerEmail, buyerPassword);
                cy.wait(500);
                cy.visit(FRONTEND_URL + '/?viewedListingId=' + listing.id);
                cy.wait(500);
                cy.get('[data-testid=listing-nav] li').contains('Messages').click();
                cy.get('textarea').type('Fake chat message');
                cy.get('button').contains('Send').click();
                cy.wait(300);
                getByTestId('own-chat-message-body').should('have.text', 'Fake chat message');

                signOut();

                signIn(ownerEmail, ownerPassword);
                cy.wait(500);
                cy.visit(FRONTEND_URL + '/account/listings/' + listing.id);
                cy.get('[data-testid=listing-nav] li').contains('Messages').click();
                cy.wait(500);
                getByTestId('other-chat-message-body').should('have.text', 'Fake chat message');
                cy.get('textarea').type('Another fake message');
                cy.get('button').contains('Send').click();
                cy.wait(300);
                getByTestId('own-chat-message-body').should('have.text', 'Another fake message');
            })
        });
    });
});
