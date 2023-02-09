import React, {FC, FormEvent, useState} from "react";
import {TextInput} from "components/form-fields/text-input";
import {Button} from "components/button";
import {NotificationManager} from "react-notifications";
import axios from "axios";
import {ApiRoutes} from "api/api-routes";
import {useAuthContext} from "api/auth/auth-context";
import {useRouter} from "next/router";

/**
 * Reset password form
 */

export type ResetPasswordFormProps = {
    resetCode: string,
};

export const ResetPasswordForm: FC<ResetPasswordFormProps> = ({
    resetCode,
}) => {
    const authContext = useAuthContext();
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function submit(e: FormEvent) {
        e.preventDefault();
        if (password === '' || passwordConfirm === '') {
            return;
        }
        if (password !== passwordConfirm) {
            NotificationManager.error('Passwords do not match');
            return;
        }

        setIsSubmitting(true);
        try {
            console.log(resetCode);
            const apiResponse = await axios.post(ApiRoutes.BaseUrl + ApiRoutes.UserResetPassword, {
                code: resetCode,
                password: password,
                passwordConfirmation: password,
            })
            const result = apiResponse.data;
            authContext.signIn(result.jwt);
            NotificationManager.success('Password reset');
            await router.push('/account/dashboard');
        }
        catch (e) {
            console.log(e.response.data);
            NotificationManager.error('Failed to reset password');
        }

        setIsSubmitting(false);
    }

    return <form onSubmit={submit}>
        <h2>Reset Password</h2>
        <TextInput label={'New Password'}
                   type={'password'}
                   value={password}
                   onChange={newValue => setPassword(newValue)}
        />
        <TextInput label={'Confirm New Password'}
                   type={'password'}
                   value={passwordConfirm}
                   onChange={newValue => setPasswordConfirm(newValue)}
        />
        <Button loading={isSubmitting}>Reset</Button>
    </form>
};
