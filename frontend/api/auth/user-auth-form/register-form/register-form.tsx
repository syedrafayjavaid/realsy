import * as React from 'react';
import {Button} from 'components/button';
import {NotificationManager} from "react-notifications";
import {FC, useState} from "react";
import {Logger} from "util/logging";
import {TextInput} from "components/form-fields/text-input";

const logger = Logger('register-form');

export interface RegisterFormProps {
    onRegisterRequested?: (credentials: {email: string, password: string}) => any,
    showRegistering?: boolean,
    emailLabel?: string,
    passwordLabel?: string,
    passwordConfirmLabel?: string,
    submitButtonLabel?: string,
    missingEmailOrPasswordError?: string,
    passwordConfirmationError?: string,
    registrationFailedError?: string,
    emailAlreadyRegisteredError?: string,
}

const defaultProps: Partial<RegisterFormProps> = {
    emailLabel: 'Email',
    passwordLabel: 'Password',
    passwordConfirmLabel: 'Confirm Password',
    submitButtonLabel: 'Get Started',
    missingEmailOrPasswordError: 'Please provide your email and password',
    passwordConfirmationError: 'Passwords do not match',
    registrationFailedError: 'Failed sign up',
    emailAlreadyRegisteredError: 'Email already registered',
}

/**
 * The user registration form
 */
export const RegisterForm: FC<RegisterFormProps> = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    return (
        <form
            onSubmit={async e => {
                e.preventDefault();

                if (email === '' || password === '') {
                    logger.debug('Not submitting register request. Email or password missing.');
                    NotificationManager.error(props.missingEmailOrPasswordError);
                    return;
                }
                if (password !== passwordConfirm) {
                    logger.debug('Not submitting register request. Password confirmation does not match');
                    NotificationManager.error(props.passwordConfirmationError);
                    return;
                }

                props.onRegisterRequested?.({email, password});
            }}
        >
            <TextInput
                name={'email'}
                label={props.emailLabel}
                type={'email'}
                value={email}
                onChange={newValue => setEmail(newValue)}
            />
            <TextInput
                name={'password'}
                label={props.passwordLabel}
                type={'password'}
                value={password}
                onChange={newValue => setPassword(newValue)}
            />
            <TextInput
                name={'passwordConfirm'}
                label={props.passwordConfirmLabel}
                type={'password'}
                value={passwordConfirm}
                onChange={newValue => setPasswordConfirm(newValue)}
            />

            <Button
                type={'submit'}
                children={props.submitButtonLabel}
                loading={props.showRegistering}
                data-testid={'register-submit-button'}
            />
        </form>
    );
};

RegisterForm.defaultProps = defaultProps;
