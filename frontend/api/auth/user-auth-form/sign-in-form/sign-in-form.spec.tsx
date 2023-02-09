import React from 'react';
import {SignInForm} from "api/auth/user-auth-form/sign-in-form/sign-in-form";
import {render, screen, fireEvent} from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import * as faker from "faker";

/**
 * Unit tests for the user sign in form
 * @group unit
 */
describe ('Sign In Form', () => {
    it ('renders an email and password input', () => {
        render(<SignInForm/>);
        expect(screen.getByLabelText(SignInForm.defaultProps?.emailLabel!)).toBeVisible();
        expect(screen.getByLabelText(SignInForm.defaultProps?.passwordLabel!)).toBeVisible();
    });

    it ('passes supplied credentials to a sign in requested callback', () => {
        let passedCredentials = {email: '', password: ''};
        render(
            <SignInForm
                onSignInRequested={credentials => passedCredentials = credentials}
            />
        );

        const email = faker.internet.email();
        const password = faker.internet.password();
        userEvent.type(screen.getByLabelText(SignInForm.defaultProps?.emailLabel!), email);
        userEvent.type(screen.getByLabelText(SignInForm.defaultProps?.passwordLabel!), password);
        fireEvent.submit(screen.getByRole('button', {name: SignInForm.defaultProps?.buttonText}));

        expect(passedCredentials.email).toEqual(email);
        expect(passedCredentials.password).toEqual(password);
    });
});
