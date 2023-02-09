import {
    createListingThroughApi,
    createListingWithToken, createOfferWithToken,
    FRONTEND_URL,
    getByTestId,
    registerUser,
    registerUserThroughApi, signIn, signOut
} from "../support";
import faker from "faker";

describe ('Offers', () => {
    it ('allows registered users to create offers on active listings', () => {
        createListingThroughApi().then(listing => {
            registerUser();
            cy.wait(500);
            cy.visit(FRONTEND_URL + '/?viewedListingId=' + listing.id);
            cy.wait(300);
            cy.get('button').contains('Make an Offer').click();
            getByTestId('pager-controls').get('button').contains('Next').click();
            getByTestId('pager-controls').get('button').contains('Next').click();
            getByTestId('pager-controls').get('button').contains('Next').click();
            getByTestId('pager-controls').get('button').contains('Submit').click();
        });
    });

    it ('sends notifications to listing owners for new offers', () => {
        const ownerEmail = faker.internet.email();
        const ownerPassword = faker.internet.password();
        const buyerEmail = faker.internet.email();
        const buyerPassword = faker.internet.password();

        registerUserThroughApi(ownerEmail, ownerPassword).then(ownerResult => {
            registerUserThroughApi(buyerEmail, buyerPassword).then(buyerResult => {
                createListingWithToken(ownerResult.jwt).then(listing => {
                    createOfferWithToken(buyerResult.jwt, listing.id).then(offer => {
                        cy.wait(500);
                        signIn(ownerEmail, ownerPassword);
                        cy.wait(5000);
                        cy.visit(FRONTEND_URL + '/account/dashboard');
                        cy.get('h3').contains('You have a new offer!');
                    })
                });
            });
        });
    });

    it ('allows listing owners to accept offers', () => {
        const ownerEmail = faker.internet.email();
        const ownerPassword = faker.internet.password();
        const buyerEmail = faker.internet.email();
        const buyerPassword = faker.internet.password();

        registerUserThroughApi(ownerEmail, ownerPassword).then(ownerResult => {
            registerUserThroughApi(buyerEmail, buyerPassword).then(buyerResult => {
                createListingWithToken(ownerResult.jwt).then(listing => {
                    createOfferWithToken(buyerResult.jwt, listing.id).then(offer => {
                        signIn(ownerEmail, ownerPassword);
                        cy.wait(500);
                        cy.visit(FRONTEND_URL + '/account/listings/' + listing.id);
                        cy.get('li').contains('Offers').click();
                        cy.get('button').contains('See Details').click();
                        cy.get('button').contains('Accept').click();
                        getByTestId('offer-status').should('have.text', 'accepted');
                    })
                });
            });
        });
    });

    it ('allows listing owners to decline offers', () => {
        const ownerEmail = faker.internet.email();
        const ownerPassword = faker.internet.password();
        const buyerEmail = faker.internet.email();
        const buyerPassword = faker.internet.password();

        registerUserThroughApi(ownerEmail, ownerPassword).then(ownerResult => {
            registerUserThroughApi(buyerEmail, buyerPassword).then(buyerResult => {
                createListingWithToken(ownerResult.jwt).then(listing => {
                    createOfferWithToken(buyerResult.jwt, listing.id).then(offer => {
                        signIn(ownerEmail, ownerPassword);
                        cy.wait(500);
                        cy.visit(FRONTEND_URL + '/account/listings/' + listing.id);
                        cy.get('li').contains('Offers').click();
                        cy.get('button').contains('See Details').click();
                        cy.get('button').contains('Reject').click();
                        getByTestId('offer-status').should('have.text', 'declined');
                    })
                });
            });
        });
    });

    it ('allows listing owners to counter offers', () => {
        const ownerEmail = faker.internet.email();
        const ownerPassword = faker.internet.password();
        const buyerEmail = faker.internet.email();
        const buyerPassword = faker.internet.password();

        registerUserThroughApi(ownerEmail, ownerPassword).then(ownerResult => {
            registerUserThroughApi(buyerEmail, buyerPassword).then(buyerResult => {
                createListingWithToken(ownerResult.jwt).then(listing => {
                    createOfferWithToken(buyerResult.jwt, listing.id).then(offer => {
                        signIn(ownerEmail, ownerPassword);
                        cy.wait(500);
                        cy.visit(FRONTEND_URL + '/account/listings/' + listing.id);
                        cy.get('li').contains('Offers').click();
                        cy.get('button').contains('See Details').click();
                        cy.get('[name=counter-price]').type('250000');
                        cy.get('button').contains('Counter').click();
                        getByTestId('offer-status').should('have.text', 'countered');
                    })
                });
            });
        });
    });

    it ('allows buyers to re-counter counter offers', () => {
        const ownerEmail = faker.internet.email();
        const ownerPassword = faker.internet.password();
        const buyerEmail = faker.internet.email();
        const buyerPassword = faker.internet.password();

        registerUserThroughApi(ownerEmail, ownerPassword).then(ownerResult => {
            registerUserThroughApi(buyerEmail, buyerPassword).then(buyerResult => {
                createListingWithToken(ownerResult.jwt).then(listing => {
                    createOfferWithToken(buyerResult.jwt, listing.id).then(offer => {
                        signIn(ownerEmail, ownerPassword);
                        cy.wait(500);
                        cy.visit(FRONTEND_URL + '/account/listings/' + listing.id);
                        cy.get('li').contains('Offers').click();
                        cy.get('button').contains('See Details').click();
                        cy.get('[name=counter-price]').type('250000');
                        cy.get('button').contains('Counter').click();
                        getByTestId('offer-status').should('have.text', 'countered');
                        signOut();
                        signIn(buyerEmail, buyerPassword);
                        cy.wait(500);
                        cy.visit(FRONTEND_URL + '/?viewedListingId=' + listing.id);
                        cy.get('button').contains('Make an Offer').click();
                        cy.get('[name=counter-price]').type('220000');
                        cy.get('button').contains('Counter').click();
                        getByTestId('offer-heading').should('have.text', 'Awaiting Lister');
                    })
                });
            });
        });
    });

    it ('allows buyers to accept counter offers', () => {
        const ownerEmail = faker.internet.email();
        const ownerPassword = faker.internet.password();
        const buyerEmail = faker.internet.email();
        const buyerPassword = faker.internet.password();

        registerUserThroughApi(ownerEmail, ownerPassword).then(ownerResult => {
            registerUserThroughApi(buyerEmail, buyerPassword).then(buyerResult => {
                createListingWithToken(ownerResult.jwt).then(listing => {
                    createOfferWithToken(buyerResult.jwt, listing.id).then(offer => {
                        signIn(ownerEmail, ownerPassword);
                        cy.wait(500);
                        cy.visit(FRONTEND_URL + '/account/listings/' + listing.id);
                        cy.get('li').contains('Offers').click();
                        cy.get('button').contains('See Details').click();
                        cy.get('[name=counter-price]').type('250000');
                        cy.get('button').contains('Counter').click();
                        getByTestId('offer-status').should('have.text', 'countered');
                        signOut();
                        signIn(buyerEmail, buyerPassword);
                        cy.wait(500);
                        cy.visit(FRONTEND_URL + '/?viewedListingId=' + listing.id);
                        cy.get('button').contains('Make an Offer').click();
                        cy.wait(500);
                        cy.get('button').contains('Accept').click();
                        getByTestId('offer-heading').should('have.text', 'Offer Accepted!');
                    })
                });
            });
        });
    });

    it ('allows buyers to decline counter offers', () => {
        const ownerEmail = faker.internet.email();
        const ownerPassword = faker.internet.password();
        const buyerEmail = faker.internet.email();
        const buyerPassword = faker.internet.password();

        registerUserThroughApi(ownerEmail, ownerPassword).then(ownerResult => {
            registerUserThroughApi(buyerEmail, buyerPassword).then(buyerResult => {
                createListingWithToken(ownerResult.jwt).then(listing => {
                    createOfferWithToken(buyerResult.jwt, listing.id).then(offer => {
                        signIn(ownerEmail, ownerPassword);
                        cy.wait(500);
                        cy.visit(FRONTEND_URL + '/account/listings/' + listing.id);
                        cy.get('li').contains('Offers').click();
                        cy.get('button').contains('See Details').click();
                        cy.get('[name=counter-price]').type('250000');
                        cy.get('button').contains('Counter').click();
                        getByTestId('offer-status').should('have.text', 'countered');
                        signOut();
                        signIn(buyerEmail, buyerPassword);
                        cy.wait(500);
                        cy.visit(FRONTEND_URL + '/?viewedListingId=' + listing.id);
                        cy.get('button').contains('Make an Offer').click();
                        cy.wait(500);
                        cy.get('button').contains('Reject').click();
                    })
                });
            });
        });
    });
});
