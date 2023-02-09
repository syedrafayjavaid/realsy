import {createListingThroughApi, FRONTEND_URL, registerUser} from "../support";

describe ('Scheduled Events', () => {
    it ('allows registered users to create visit requests', () => {
        registerUser();
        createListingThroughApi().then(listing => {
            cy.visit(FRONTEND_URL + '/?viewedListingId=' + listing.id);
            cy.wait(200);
            cy.get('button').contains('Request a Visit').click();
            cy.wait(200);
            cy.get('button').contains('Submit').click();
            cy.wait(200);
            cy.get('h4').should('have.text', 'Visit Request Pending');
        });
    });
});
