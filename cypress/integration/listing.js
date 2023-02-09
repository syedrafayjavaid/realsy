import {
    API_URL,
    createListing,
    createListingThroughApi,
    FRONTEND_URL,
    getByTestId,
    registerUser,
    signOut
} from "../support";

describe ('User listing process', () => {
    it ('allows a registered user to create a listing', () => {
        registerUser();
        cy.wait(200);
        createListing()
    });

    it ('allows a registered user to save and un-save listings', () => {
        createListingThroughApi().then(listing => {
            registerUser();
            cy.wait(500);
            cy.visit(FRONTEND_URL + '/?viewedListingId=' + listing.id);
            getByTestId('favorite-button').click();
            cy.visit(FRONTEND_URL + '/account/saved-listings');
            cy.get('[data-testid=favorite-button]').should('exist');
            cy.get('[data-testid=favorite-button]').click();
            cy.visit(FRONTEND_URL + '/account/saved-listings');
            cy.get('[data-testid=favorite-button]').should('not.exist');
        })
    });

    it ('allows users to find listings on a search map', () => {
        createListingThroughApi().then(listing => {
            const lat = listing.latitude;
            const lng = listing.longitude;
            cy.visit(FRONTEND_URL + `/buy?latitude=${lat}&longitude=${lng}`);
            cy.wait(500);
            getByTestId('map-marker').first().click({force: true});
            cy.url().should('include', 'viewedListingId=');
        })
    });
});
