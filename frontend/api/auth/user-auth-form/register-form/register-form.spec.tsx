import React from 'react';
import {act, fireEvent, render, screen, waitFor} from "@testing-library/react";
import {RegisterForm} from "api/auth/user-auth-form/register-form/register-form";
import '@testing-library/jest-dom';
import {NotificationContainer} from "react-notifications";
import faker from 'faker';

describe ('Register Form', () => {
    it ('renders email, password, and password confirmation inputs and a submit button', () => {
        render(<RegisterForm/>);
        expect(screen.getByLabelText(RegisterForm.defaultProps!.emailLabel!)).toBeVisible();
        expect(screen.getByLabelText(RegisterForm.defaultProps!.passwordLabel!)).toBeVisible();
        expect(screen.getByLabelText(RegisterForm.defaultProps!.passwordConfirmLabel!)).toBeVisible();
        expect(screen.getByRole('button')).toBeVisible();
    });

    it ('passes supplied credentials to a register requested callback', () => {
        const email = faker.internet.email();
        const password = faker.internet.password();
        let mockCallback = jest.fn();
        render(<RegisterForm onRegisterRequested={mockCallback}/>);
        act(() => {
            fireEvent.change(
                screen.getByLabelText(RegisterForm.defaultProps!.emailLabel!),
                {target: {value: email}}
            );
            fireEvent.change(
                screen.getByLabelText(RegisterForm.defaultProps!.passwordLabel!),
                {target: {value: password}}
            );
            fireEvent.change(
                screen.getByLabelText(RegisterForm.defaultProps!.passwordConfirmLabel!),
                {target: {value: password}}
            );
        });
        fireEvent.submit(screen.getByRole('button'));

        expect(mockCallback).toHaveBeenCalled();
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback.mock.calls[0][0].email).toEqual(email);
        expect(mockCallback.mock.calls[0][0].password).toEqual(password);
    });

    it ('displays an error message if submitted without an email or password', () => {
        renderAndSubmitForm('', '', '');
        const errorView = screen.getByText(RegisterForm.defaultProps!.missingEmailOrPasswordError!);
        expect(errorView).toBeVisible();
        act(() => {fireEvent.click(errorView)}); // hide error
    });

    it ('displays an error message if submitted without an email', () => {
        const password = faker.internet.password();
        renderAndSubmitForm('', password, password);
        const errorView = screen.getByText(RegisterForm.defaultProps!.missingEmailOrPasswordError!);
        expect(errorView).toBeVisible();
        act(() => {fireEvent.click(errorView)}); // hide error
    });

    it ('displays an error message if submitted without a password', () => {
        renderAndSubmitForm(faker.internet.email(), '', '');
        const errorView = screen.getByText(RegisterForm.defaultProps!.missingEmailOrPasswordError!);
        expect(errorView).toBeVisible();
        act(() => {fireEvent.click(errorView)}); // hide error
    });

    it ('displays an error if submitted without a matching password confirmation', () => {
        renderAndSubmitForm(faker.internet.email(), 'password', 'wrongPassword');
        const errorView = screen.getByText(RegisterForm.defaultProps!.passwordConfirmationError!);
        expect(errorView).toBeVisible();
        act(() => {fireEvent.click(errorView)}); // hide error
    });
});

/**
 * Renders the form, inputs the provided email, password, and confirmation, and submits.
 * @param email
 * @param password
 * @param passwordConfirmation
 */
function renderAndSubmitForm(email: string, password: string, passwordConfirmation: string) {
    render(
        <>
            <RegisterForm/>
            {/* we need a notification container to test that notifications appear */}
            <NotificationContainer/>
        </>
    );
    act(() => {
        fireEvent.change(
            screen.getByLabelText(RegisterForm.defaultProps!.emailLabel!),
            {target: {value: email}}
        );
        fireEvent.change(
            screen.getByLabelText(RegisterForm.defaultProps!.passwordLabel!),
            {target: {value: password}}
        );
        fireEvent.change(
            screen.getByLabelText(RegisterForm.defaultProps!.passwordConfirmLabel!),
            {target: {value: passwordConfirmation}}
        );
    });
    act(() => {
        fireEvent.click(screen.getByRole('button'));
    });
}
