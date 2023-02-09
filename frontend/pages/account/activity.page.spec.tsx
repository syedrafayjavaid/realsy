import React from 'react';
import {act, render, screen, waitFor} from "@testing-library/react";
import AccountActivityPage from "pages/account/activity.page";
import {setupServer} from "msw/node";
import {ApiRoutes} from "api/api-routes";
import {rest} from "msw";
import {RouterContext} from "next/dist/next-server/lib/router-context";
import {mockRouterContext} from "__mocks__/mock-router-context";
import '@testing-library/jest-dom';
import {UserActivityRecordDto} from "api/notifications/user-activity-record.dto";

describe ('User Account Activity Page', () => {
    const mockApiServer = setupServer();

    beforeAll(() => mockApiServer.listen());

    afterEach(() => mockApiServer.resetHandlers());

    afterAll(() => mockApiServer.close());

    it ('displays a "you signed up" record', async () => {
        mockApiServer.use(
            rest.get(ApiRoutes.BaseUrl + ApiRoutes.CurrentUserActivityRecords, (req, res, ctx) => {
                return res(ctx.json([]));
            }),
        );
        render(
            <RouterContext.Provider value={mockRouterContext()}>
                <AccountActivityPage/>
            </RouterContext.Provider>
        );
        await waitFor(() => expect(screen.getByText('You joined Realsy!')).toBeVisible());
    });

    it ('displays activity records fetched from the API', async () => {
        const fakeRecord: UserActivityRecordDto = {
            id: 1,
            title: 'Fake Record',
            body: 'testing',
            seen: true,
            created_at: new Date(),
        };

        mockApiServer.use(
            rest.get(ApiRoutes.BaseUrl + ApiRoutes.CurrentUserActivityRecords, (req, res, ctx) => {
                return res(ctx.json([fakeRecord]));
            }),
        );

        render(<AccountActivityPage/>);

        await waitFor(() => expect(screen.getByText(fakeRecord.title)).toBeVisible());
    });
});
