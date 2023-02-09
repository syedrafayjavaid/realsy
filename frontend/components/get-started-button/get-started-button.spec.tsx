import React from 'react';
import {fireEvent, render, screen} from "@testing-library/react";
import {AuthContext} from "api/auth/auth-context";
import {GetStartedButton} from "components/get-started-button/get-started-button";
import {RouterContext} from "next/dist/next-server/lib/router-context";
import {mockAuthContext} from "__mocks__/mock-auth-context";
import {mockRouterContext} from "__mocks__/mock-router-context";

/**
 * @group unit
 */
describe ('Get Started Button Component', () => {
    it ('Starts user sign in if not currently authenticated', async () => {
        let signInStarted = false;
        render(
            <RouterContext.Provider value={mockRouterContext()}>
                <AuthContext.Provider value={mockAuthContext({
                    isSignedIn: false,
                    showSignIn: () => signInStarted = true,
                })}>
                    <GetStartedButton body={'test button'}/>
                </AuthContext.Provider>
            </RouterContext.Provider>
        );
        fireEvent.click(await screen.findByText('test button'));
        expect(signInStarted).toEqual(true);
    });

    it ('Links to authenticated link property if currently authenticated', async () => {
        let pathname = '/';
        const testBody = 'test button';
        const testLink = '/fake-path';

        render(
            <RouterContext.Provider value={mockRouterContext({
                push: async newPathname => {pathname = newPathname as string; return true},
            })}>
                <AuthContext.Provider value={mockAuthContext({
                    isSignedIn: true,
                })}>
                    <GetStartedButton
                        body={testBody}
                        linkIfAuthenticated={testLink}
                    />
                </AuthContext.Provider>
            </RouterContext.Provider>
        );

        fireEvent.click(await screen.findByText(testBody));

        expect(pathname).toEqual(testLink);
    });
});
