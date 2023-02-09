import React, {ComponentType} from 'react';
import HomePage from "pages/index.page";
import {screen, render, waitFor} from "@testing-library/react";
import {setupServer} from "msw/node";
import {rest} from "msw";
import {CmsClient} from "cms/cms-client";
import '@testing-library/jest-dom';
import {NotificationContainer} from "react-notifications";
import {CmsRoutes} from "cms/cms-routes";
import {AppInitialProps} from "next/dist/pages/_app";

/**
 * @group unit
 */
describe ('Home Page', () => {
    it ('renders an empty body if no body prop is given', async () => {
        render(<HomePage bodyContent={[]}/>);
        const main = screen.getByTestId('main-content');
        expect(main).toBeEmptyDOMElement();
    });

    it ('pulls its document title from the CMS response', async () => {
        const mockTitle = 'This is a fake!';
        const mockCmsServer = setupServer(
            rest.get(`${CmsClient.defaults.baseURL}${CmsRoutes.contentPage}/homepage`, (req, res, ctx) => {
                return res(ctx.json({htmlTitle: mockTitle}));
            }),
        );
        mockCmsServer.listen();

        const initialProps = await HomePage.getInitialProps!({
            query: {},
            pathname: '/',
            AppTree: {} as ComponentType<AppInitialProps>,
        });

        expect(initialProps.htmlTitle).toEqual(mockTitle);
        mockCmsServer.close();
    });

    it ('renders content fetched from the CMS, translating the raw JSON content into react components', async () => {
        const targetCmsText = 'This is mock content!';
        const mockCmsServer = setupServer(
            rest.get(`${CmsClient.defaults.baseURL}${CmsRoutes.contentPage}/homepage`, (req, res, ctx) => {
                return res(ctx.json({
                    "title": "Fake Page",
                    "slug": 'homepage',
                    "published": true,
                    "htmlTitle": null,
                    "created_at": "2020-01-12T15:26:10.287Z",
                    "updated_at": "2020-01-24T16:37:51.038Z",
                    "bodyContent": [
                        {
                            "__component": "content.rich-body-text",
                            "id": 3,
                            "body": `<p>${targetCmsText}</p>`,
                        }
                    ]
                }));
            }),
        );
        mockCmsServer.listen();

        const initialProps = await HomePage.getInitialProps!({
            query: {},
            pathname: '/',
            AppTree: {} as ComponentType<AppInitialProps>,
        });
        render(<HomePage {...initialProps}/>);

        const container = screen.getByText(targetCmsText);
        expect(container).toBeDefined();

        mockCmsServer.close();
    });

    it ('renders a failed sign up notification if query params present', async () => {
        const mockCmsServer = setupServer(
            rest.get(`${CmsClient.defaults.baseURL}${CmsRoutes.contentPage}/homepage`, (req, res, ctx) => {
                return res(ctx.json({
                    bodyContent: [],
                }));
            }),
        );
        mockCmsServer.listen();

        const fakeMessage = 'fake sign up failure';
        const initialProps = await HomePage.getInitialProps!({
            query: {failedSignUp: 'true', message: fakeMessage},
            pathname: '/',
            AppTree: {} as ComponentType<AppInitialProps>,
        });
        render(
            <>
                <HomePage {...initialProps}/>
                <NotificationContainer/>
            </>
        );
        await waitFor(() => {
            expect(screen.getByText(fakeMessage)).toBeInTheDocument();
        });

        mockCmsServer.close();
    });
});


