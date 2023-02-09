import {render, screen} from "@testing-library/react";
import {setupServer} from "msw/node";
import {rest} from "msw";
import {CmsClient} from "cms/cms-client";
import React, {ComponentType} from "react";
import '@testing-library/jest-dom';
import CmsPage from "pages/p/[slug].page";
import {CmsRoutes} from "cms/cms-routes";
import {AppInitialProps} from "next/dist/pages/_app";

describe ('CMS Page', () => {
    it ('renders an empty body if no body prop is given', async () => {
        render(<CmsPage bodyContent={[]} />);
        const main = screen.getByTestId('main-content');
        expect(main.children.length).toEqual(1); // just the heading element present
    });

    it ('pulls its document title from the CMS response', async () => {
        const testSlug = 'test-slug';
        const mockTitle = 'This is a fake!';
        const mockCmsServer = setupServer(
            rest.get(`${CmsClient.defaults.baseURL}${CmsRoutes.contentPage}/${testSlug}`, (req, res, ctx) => {
                return res(ctx.json({htmlTitle: mockTitle}));
            }),
        );
        mockCmsServer.listen();

        const initialProps = await CmsPage.getInitialProps!({
            query: {
                slug: testSlug,
            },
            pathname: '/',
            AppTree: {} as ComponentType<AppInitialProps>,
        });

        expect(initialProps.htmlTitle).toEqual(mockTitle);
        mockCmsServer.close();
    });

    it ('renders the page title as a heading', async () => {
        const testSlug = 'test-slug';
        const mockTitle = 'This is a fake!';
        const mockCmsServer = setupServer(
            rest.get(`${CmsClient.defaults.baseURL}${CmsRoutes.contentPage}/${testSlug}`, (req, res, ctx) => {
                return res(ctx.json({
                    htmlTitle: mockTitle,
                    title: mockTitle,
                }));
            }),
        );
        mockCmsServer.listen();

        const initialProps = await CmsPage.getInitialProps!({
            query: {
                slug: testSlug,
            },
            pathname: '/',
            AppTree: {} as ComponentType<AppInitialProps>,
        });
        render(<CmsPage {...initialProps}/>);

        expect(screen.getByText(mockTitle)).toBeVisible();
        mockCmsServer.close();
    });

    it ('renders content fetched from the CMS, translating the raw JSON content into react components', async () => {
        const testSlug = 'test-slug';
        const targetCmsText = 'This is mock content!';
        const mockCmsServer = setupServer(
            rest.get(`${CmsClient.defaults.baseURL}${CmsRoutes.contentPage}/${testSlug}`, (req, res, ctx) => {
                return res(ctx.json({
                    "title": "Fake Page",
                    "slug": testSlug,
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

        const initialProps = await CmsPage.getInitialProps!({
            query: {
                slug: testSlug,
            },
            pathname: '/',
            AppTree: {} as ComponentType<AppInitialProps>,
        });
        render(<CmsPage {...initialProps}/>);

        const container = screen.getByText(targetCmsText);
        expect(container).toBeDefined();

        mockCmsServer.close();
    })
});
