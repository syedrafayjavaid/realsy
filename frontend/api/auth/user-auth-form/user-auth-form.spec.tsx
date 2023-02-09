import React from 'react';
import {act, fireEvent, render, screen} from "@testing-library/react";
import {RegisterForm} from "api/auth/user-auth-form/register-form";
import {SignInForm} from "api/auth/user-auth-form/sign-in-form";
import {UserAuthForm} from "api/auth/user-auth-form/user-auth-form";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import * as faker from "faker";

describe ('User Auth Form', () => {
    it ('presents a Realsy logo', () => {
        render(<UserAuthForm/>);
        expect(screen.getByLabelText('Realsy Homes')).toBeVisible();
    });

    it ('allows toggling between sign in and register forms', () => {
        render(<UserAuthForm/>);
        const signInTab = screen.getAllByRole('button', {name: UserAuthForm.defaultProps?.signInTabText})[0];
        const registerTab = screen.getByRole('button', {name: UserAuthForm.defaultProps?.registerTabText});
        expect(signInTab).toBeVisible();
        expect(registerTab).toBeVisible();

        fireEvent.click(registerTab);
        expect(screen.getByLabelText(RegisterForm.defaultProps?.emailLabel!)).toBeVisible();
        expect(screen.getByLabelText(RegisterForm.defaultProps?.passwordLabel!)).toBeVisible();
        expect(screen.getByLabelText(RegisterForm.defaultProps?.passwordConfirmLabel!)).toBeVisible();

        fireEvent.click(signInTab);
        expect(screen.getByLabelText(SignInForm.defaultProps?.emailLabel!)).toBeVisible();
        expect(screen.getByLabelText(SignInForm.defaultProps?.passwordLabel!)).toBeVisible();
    });

    it ('presents Facebook and Google oauth sign in buttons', () => {
        render(<UserAuthForm/>);
        const facebookOauthLink = screen.getByRole('link', {name: UserAuthForm.defaultProps?.signInFacebookLabel});
        expect(facebookOauthLink).toBeVisible();
        expect(facebookOauthLink).toHaveAttribute('href', UserAuthForm.defaultProps?.signInFacebookUrl);
        const googleOauthLink = screen.getByRole('link', {name: UserAuthForm.defaultProps?.signInGoogleLabel});
        expect(googleOauthLink).toBeVisible();
        expect(googleOauthLink).toHaveAttribute('href', UserAuthForm.defaultProps?.signInGoogleUrl);
    });

    it ('passes sign in credentials to a sign in requested callback', async () => {
        let passedCredentials = {email: '', password: ''};
        render(
            <UserAuthForm
                onSignInRequested={credentials => passedCredentials = credentials}
            />
        );

        const email = faker.internet.email();
        const password = faker.internet.password();
        userEvent.type(screen.getByLabelText(UserAuthForm.defaultProps?.signInFormProps?.emailLabel!), email);
        userEvent.type(screen.getByLabelText(UserAuthForm.defaultProps?.signInFormProps?.passwordLabel!), password);
        fireEvent.submit(screen.getByLabelText(UserAuthForm.defaultProps?.signInFormProps?.emailLabel!));
        expect(passedCredentials.email).toEqual(email);
        expect(passedCredentials.password).toEqual(password);
    });

    it ('passes register credentials to a register requested callback', async () => {
        let passedCredentials = {email: '', password: ''};
        render(
            <UserAuthForm
                onRegisterRequested={credentials => passedCredentials = credentials}
            />
        );

        const email = faker.internet.email();
        const password = faker.internet.password();
        userEvent.click(screen.getByRole('button', {name: UserAuthForm.defaultProps?.registerTabText}));
        userEvent.type(screen.getByLabelText(UserAuthForm.defaultProps?.registerFormProps?.emailLabel!), email);
        userEvent.type(screen.getByLabelText(UserAuthForm.defaultProps?.registerFormProps?.passwordLabel!), password);
        userEvent.type(screen.getByLabelText(UserAuthForm.defaultProps?.registerFormProps?.passwordConfirmLabel!), password);
        fireEvent.submit(screen.getByLabelText(UserAuthForm.defaultProps?.registerFormProps?.emailLabel!));
        expect(passedCredentials.email).toEqual(email);
        expect(passedCredentials.password).toEqual(password);
    });
});
