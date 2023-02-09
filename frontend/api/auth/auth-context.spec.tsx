import React from 'react';
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {MainAuthContextProvider} from "api/auth/auth-context";
import {RouterContext} from "next/dist/next-server/lib/router-context";
import {mockRouterContext} from "__mocks__/mock-router-context";
import {UserAuthForm} from "api/auth/user-auth-form/user-auth-form";
import '@testing-library/jest-dom';
import {setupServer, SetupServerApi} from "msw/node";
import {rest} from "msw";
import {ApiRoutes} from "api/api-routes";
import userEvent from "@testing-library/user-event";
import * as faker from "faker";

describe ('Auth Context', () => {
    it ('displays a user auth form if the query param showSignIn is set true', () => {
        render(
            <RouterContext.Provider
                value={mockRouterContext({
                    query: {showSignIn: 'true'},
                })}
            >
                <MainAuthContextProvider/>
            </RouterContext.Provider>
        );

        expect(screen.getByRole('link', {name: UserAuthForm.defaultProps?.signInGoogleLabel})).toBeVisible();
    });

    it ('does not display the user auth form if query param showSignIn is not set true', () => {
        render(
            <RouterContext.Provider value={mockRouterContext()}>
                <MainAuthContextProvider/>
            </RouterContext.Provider>
        );

        expect(screen.queryByText(UserAuthForm.defaultProps?.signInGoogleLabel!)).not.toBeInTheDocument();
    });

    describe('after authentication', () => {
        let mockApi: SetupServerApi;

        beforeAll(() => {
            mockApi = setupServer();
            mockApi.listen();
        });

        afterEach(() => mockApi.resetHandlers());

        afterAll(() => mockApi.close());

        it('sends a users to their dashboard after signing in', async () => {
            mockApi.use(
                rest.post(ApiRoutes.BaseUrl + ApiRoutes.UserAuthenticate, (req, res, ctx) => {
                    return res(ctx.json({
                        jwt: 'fake-token',
                        user: {},
                    }));
                }),
                rest.get(ApiRoutes.BaseUrl + ApiRoutes.CurrentUserProfile, (req, res, ctx) => {
                    return res(ctx.json({}));
                }),
            );

            let pushedRoute = '/';
            const router = mockRouterContext({
                query: {showSignIn: 'true'},
                async push(url: string): Promise<boolean> {
                    pushedRoute = url;
                    return true;
                }
            });
            render(
                <RouterContext.Provider value={router}>
                    <MainAuthContextProvider/>
                </RouterContext.Provider>
            );

            const email = faker.internet.email();
            const password = faker.internet.password();
            userEvent.type(screen.getByLabelText(UserAuthForm.defaultProps?.signInFormProps?.emailLabel!), email);
            userEvent.type(screen.getByLabelText(UserAuthForm.defaultProps?.signInFormProps?.passwordLabel!), password);
            fireEvent.submit(screen.getByLabelText(UserAuthForm.defaultProps?.signInFormProps?.passwordLabel!));

            await waitFor(() =>
                expect(pushedRoute).toEqual('/account/dashboard')
            );
        });

        it ('sends the user to the initial profile setup on new sign up', async () => {
            mockApi.use(
                rest.post(ApiRoutes.BaseUrl + ApiRoutes.UserRegister, (req, res, ctx) => {
                    return res(ctx.json({
                        jwt: 'fake-token',
                        user: {},
                    }));
                }),
            );

            let pushedRoute = '/';
            const router = mockRouterContext({
                query: {showSignIn: 'true'},
                async push(url: string): Promise<boolean> {
                    pushedRoute = url;
                    return true;
                }
            });
            render(
                <RouterContext.Provider value={router}>
                    <MainAuthContextProvider/>
                </RouterContext.Provider>
            );

            const email = faker.internet.email();
            const password = faker.internet.password();
            userEvent.click(screen.getByRole('button', {name: UserAuthForm.defaultProps?.registerTabText}));
            userEvent.type(screen.getByLabelText(UserAuthForm.defaultProps?.registerFormProps?.emailLabel!), email);
            userEvent.type(screen.getByLabelText(UserAuthForm.defaultProps?.registerFormProps?.passwordLabel!), password);
            userEvent.type(screen.getByLabelText(UserAuthForm.defaultProps?.registerFormProps?.passwordConfirmLabel!), password);
            fireEvent.submit(screen.getByLabelText(UserAuthForm.defaultProps?.registerFormProps?.passwordConfirmLabel!));

            await waitFor(() =>
                expect(pushedRoute).toEqual('/account/profile?newSignUp=true')
            );
        });
    });
});
