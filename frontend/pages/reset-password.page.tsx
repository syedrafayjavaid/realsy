import * as React from 'react';
import {useMainLayout} from 'layout/main-layout';
import {ResetPasswordForm} from "api/auth/reset-password-form";
import {useRouter} from "next/router";
import {useStyles} from './reset-password.page.styles';
import {AppPage} from "pages/app-page.type";

/**
 * Reset password page
 */
const ResetPasswordPage: AppPage = () => {
    const router = useRouter();

    const styles = useStyles();
    return <div className={styles.container}>
        <ResetPasswordForm
            resetCode={(router.query.code as string) ?? ''}
        />
    </div>
};

ResetPasswordPage.defaultLayout = useMainLayout;
export default ResetPasswordPage;
