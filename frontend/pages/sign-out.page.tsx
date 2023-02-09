import React, {useEffect, useState} from 'react';
import {Loader} from "components/loader";
import {useAuthContext} from "api/auth/auth-context";
import {useMainLayout} from "layout/main-layout";
import {useRouter} from "next/router";
import Colors from "styles/colors";

/**
 * Displays while a user is signed out
 */
const SignOutPage = () => {
    const authContext = useAuthContext();
    const router = useRouter();
    const [signingOut, setSigningOut] = useState(true);

    useEffect(() => {
        authContext.clearAuthStatus();
        setTimeout(() => {
            setSigningOut(false);
            setTimeout(() => {
                router.replace('/');
            }, 1500);
        }, 2000);
    }, []);

    return (
        <>
            <p
                style={{
                    textAlign: 'center',
                    marginTop: '-5vh',
                    marginBottom: -10,
                    display: 'grid',
                    height: '100%',
                    alignContent: 'center',
                }}
            >
                <Loader
                    style={{
                        margin: '0 auto',
                        opacity: signingOut ? 1 : 0,
                        transition: 'opacity 300ms',
                    }}
                    size={30}
                    color={Colors.lightGray}
                />
                <br/>
                {signingOut ? 'Signing out...' : 'Signed out'}
            </p>
        </>
    );
};

SignOutPage.defaultLayout = useMainLayout;
export default SignOutPage;
