import React, {FC} from "react";
import {useState} from "react";
import {Button} from "components/button";
import {useSignInFormStyles} from "api/auth/user-auth-form/sign-in-form/sign-in-form.styles";
import {TextInput} from "components/form-fields/text-input";
import {isValidEmail} from "util/is-valid-email";
import {NotificationManager} from "react-notifications";
import Colors from "styles/colors";
import axios from "axios";
import {ApiRoutes} from "api/api-routes";

/**
 * The user sign in form
 */

export type SignInFormProps = {
    onSignInRequested?: (credentials: {email: string, password: string}) => any,
    emailLabel?: string,
    passwordLabel?: string,
    buttonText?: string,
    showSigningIn?: boolean,
    resetPasswordButtonLabel?: string,
};

const defaultProps: Partial<SignInFormProps> = {
    emailLabel: 'Email',
    passwordLabel: 'Password',
    buttonText: 'Sign In',
    resetPasswordButtonLabel: 'Reset',
}

export const SignInForm: FC<SignInFormProps> = props => {
    const styles = useSignInFormStyles();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
    const [isResettingPassword, setIsResettingPassword] = useState<boolean>(false);

    return (
        <>
            <form
                data-testid={'sign-in-form'}
                onSubmit={e => {
                    e.preventDefault();
                    props.onSignInRequested?.({email, password});
                }}
            >
                <TextInput
                    label={props.emailLabel}
                    data-testid={'email-input'}
                    value={email}
                    type={'email'}
                    name={'email'}
                    onChange={newValue => setEmail(newValue)}
                />

                <TextInput
                    label={props.passwordLabel}
                    data-testid={'password-input'}
                    value={password}
                    type='password'
                    name={'password'}
                    onChange={newValue => setPassword(newValue)}
                />

                <Button
                    children={props.buttonText}
                    data-testid={'submit-button'}
                    loading={props.showSigningIn}
                    type={'submit'}
                />
            </form>

            <form
                onSubmit={async e => {
                    e.preventDefault();

                    if (!isValidEmail(email)) {
                        NotificationManager.error('Please enter a valid email');
                        return;
                    }

                    setIsResettingPassword(true);

                    try {
                        await axios.post(ApiRoutes.BaseUrl + ApiRoutes.UserForgotPassword, {
                            email,
                        });
                        NotificationManager.success('Please check your email', 'Password reset sent');
                    }
                    catch (e) {
                        let message = e.response.data.message?.[0]?.messages?.[0]?.id === 'Auth.form.error.user.not-exist'
                            ? 'No account exists for this email'
                            : undefined;
                        NotificationManager.error(message ?? 'Failed password reset');
                    }

                    setIsResettingPassword(false);
                }}
            >
                <div className={styles.forgotPassword}>
                    <p style={{fontSize: '13px'}}>
                        <button
                            type={'button'}
                            onClick={() => setShowForgotPassword(true)}
                            style={{
                                color: Colors.mediumBlue,
                                background: 'none',
                                border: 'none',
                                outline: 'none',
                            }}
                        >
                            Forgot your password?
                        </button>
                    </p>
                    <div className={`${styles.forgotPasswordBody} ${showForgotPassword ? 'shown' : ''}`}>
                        <TextInput
                            data-testid={'reset-email-input'}
                            name={'resetEmail'}
                            type={'email'}
                            value={email}
                            onChange={newValue => setEmail(newValue)}
                        />
                        <Button
                            type={'submit'}
                            children={props.resetPasswordButtonLabel}
                            loading={isResettingPassword}
                        />
                    </div>
                </div>
            </form>
        </>
    );
};

SignInForm.defaultProps = defaultProps;
