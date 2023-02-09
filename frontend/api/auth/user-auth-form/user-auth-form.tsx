import React, {FC, useState} from 'react';
import {SignInForm, SignInFormProps} from "api/auth/user-auth-form/sign-in-form";
import {Button} from "components/button";
import RealsyLogo from "components/icons/realsy-logo";
import {ApiRoutes} from "api/api-routes";
import {RegisterForm, RegisterFormProps} from 'api/auth/user-auth-form/register-form';
import {useUserAuthFormStyles} from "api/auth/user-auth-form/user-auth-form.styles";

/**
 * A form for user sign-in or registration
 */

export type UserAuthFormProps = {
    onSignInRequested?: (credentials: {email: string, password: string}) => any,
    onRegisterRequested?: (credentials: {email: string, password: string}) => any,
    onPasswordResetRequested?: (email: string) => any,
    signInTabText?: string,
    registerTabText?: string,
    signInFacebookLabel?: string,
    signInFacebookUrl?: string,
    signInGoogleLabel?: string,
    signInGoogleUrl?: string,
    signInFormProps?: SignInFormProps,
    registerFormProps?: RegisterFormProps,
};

const defaultProps: Partial<UserAuthFormProps> = {
    signInTabText: 'Sign In',
    registerTabText: 'Create an Account',
    signInFacebookLabel: 'Sign in with Facebook',
    signInFacebookUrl: ApiRoutes.BaseUrl + ApiRoutes.InitOauthFacebook,
    signInGoogleLabel: 'Sign in with Google',
    signInGoogleUrl: ApiRoutes.BaseUrl + ApiRoutes.InitOauthGoogle,
    signInFormProps: SignInForm.defaultProps,
    registerFormProps: RegisterForm.defaultProps,
};

export const UserAuthForm: FC<UserAuthFormProps> = (props) => {
    const styleClasses = useUserAuthFormStyles();
    const [showRegister, setShowRegister] = useState(false);
    const [isLoadingFacebook, setIsLoadingFacebook] = useState(false);
    const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

    return (
        <div className={styleClasses.userAuthForm} data-testid={'sign-in-modal'}>
            <div className={styleClasses.mobileHeader}>
                <RealsyLogo className={styleClasses.headerLogo}/>
            </div>

            <div className={styleClasses.emailSignIn}>
                <ul>
                    <li className={!showRegister ? 'active' : ''}>
                        <button
                            children={props.signInTabText}
                            data-testid={'sign-in-button'}
                            className={styleClasses.tabButton}
                            onClick={() => setShowRegister(false)}
                        />
                    </li>
                    <li className={showRegister ? 'active' : ''}>
                        <button
                            children={props.registerTabText}
                            data-testid={'register-button'}
                            className={styleClasses.tabButton}
                            onClick={() => setShowRegister(true)}
                        />
                    </li>
                </ul>

                {!showRegister &&
                    <SignInForm
                        onSignInRequested={props.onSignInRequested}
                        {...props.signInFormProps}
                    />
                }
                {showRegister &&
                    <div className={styleClasses.registerContainer}>
                        <RegisterForm
                            onRegisterRequested={props.onRegisterRequested}
                        />
                    </div>
                }
            </div>

            <div className={styleClasses.oAuthLogin}>
                <p>OR</p>

                <div className={styleClasses.oAuthButtons}>
                    <Button
                        children={props.signInFacebookLabel}
                        className={styleClasses.oAuthButton}
                        href={ApiRoutes.BaseUrl + ApiRoutes.InitOauthFacebook}
                        loading={isLoadingFacebook}
                        onClick={() => setIsLoadingFacebook(true)}
                    />
                    <Button
                        children={props.signInGoogleLabel}
                        className={styleClasses.oAuthButton}
                        href={ApiRoutes.BaseUrl + ApiRoutes.InitOauthGoogle}
                        loading={isLoadingGoogle}
                        onClick={() => setIsLoadingGoogle(true)}
                    />
                </div>
            </div>
        </div>
    );
};

UserAuthForm.defaultProps = defaultProps;
