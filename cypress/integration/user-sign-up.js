import faker from 'faker';
import {getByTestId, registerUser, signOut} from "../support";



describe ('User sign up', () => {
    it ('allows a user to register with email and password', () => {
        registerUser();
        cy.url().should('include', '/account/profile?newSignUp=true');
    });

    it ('allows a registered user to sign in and out', () => {
        const email = faker.internet.email();
        const password = faker.internet.password();

        registerUser(email, password);

        cy.wait(200);
        signOut()

        getByTestId('account-menu-button').click();
        cy.get('[name=email]').type(email);
        cy.get('[name=password]').type(password);
        getByTestId('submit-button').click();

        cy.url().should('include', '/account/dashboard');
    });

    it ('allows a registered user to modify their profile', () => {
        const email = faker.internet.email();
        const password = faker.internet.password();

        registerUser(email, password);

        cy.get('[name=name]').type('Fake User');
        cy.get('[name=phone]').type('1231231234');
        cy.get('[name=phone]').parents('form').submit();

        cy.url().should('contain', '/account/dashboard');
    });
});
