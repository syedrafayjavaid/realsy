import React, {FC} from 'react';
import {Button, ButtonVariant} from 'components/button';
import {useAuthContext} from "api/auth/auth-context";

/**
 * A "get started" button that starts user sign-up or brings them to the dashboard is already signed in
 */

export type GetStartedButtonProps = {
    variant?: ButtonVariant,
    body?: string,
    linkIfAuthenticated?: string,
};

export const GetStartedButton: FC<GetStartedButtonProps> = ({
    variant = ButtonVariant.Blue,
    body = 'Get Started',
    linkIfAuthenticated = '/account/dashboard',
}) => {
    const authContext = useAuthContext();

    return (
        <Button
            href={linkIfAuthenticated}
            variant={variant}
            type={'button'}
            onClick={() => {
                if (!authContext.isSignedIn) {
                    authContext.showSignIn();
                }
            }}
            children={body}
        />
    );
};
