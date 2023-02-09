import React from 'react';
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {HeroSection} from "components/hero-section/hero-section";
import '@testing-library/jest-dom';
import 'intersection-observer';
import {RouterContext} from "next/dist/next-server/lib/router-context";

/**
 * @group unit
 */
describe ('Hero Section', () => {
    it ('fades in the given heading', async () => {
        const headline = 'Fake Headline';
        render(<HeroSection headline={headline}/>);
        expect(screen.getByText(headline)).not.toBeVisible();
        await waitFor(
            () => expect(screen.getByText(headline)).toBeVisible()
        );
    });

    it ('fades in a button with given text and click handler', async () => {
        const buttonText = 'Fake Button';
        let buttonClicked = false;
        render(
            <HeroSection
                showButton={true}
                buttonText={buttonText}
                onButtonClicked={() => buttonClicked = true}
            />
        );

        expect(screen.getByText(buttonText)).not.toBeVisible();
        await waitFor(
            () => expect(screen.getByText(buttonText)).toBeVisible()
        );
        fireEvent.click(screen.getByText(buttonText));
        expect(buttonClicked).toBe(true);
    });

    it ('renders its button as a link if the buttonUrl prop is given', async () => {
        const buttonText = 'Link Button';
        const buttonUrl = '/fake-route';

        let pushedRoute = null;
        render(
            <RouterContext.Provider value={{
                basePath: '/',
                pathname: '/',
                route: '/',
                query: {},
                asPath: '/',
                push: jest.fn((route: string) => {
                    pushedRoute = route;
                    return Promise.resolve(true)
                }),
                replace: jest.fn(() => Promise.resolve(true)),
                reload: jest.fn(() => Promise.resolve(true)),
                prefetch: jest.fn(() => Promise.resolve()),
                back: jest.fn(() => Promise.resolve(true)),
                beforePopState: jest.fn(() => Promise.resolve(true)),
                isFallback: false,
                events: {
                    on: jest.fn(),
                    off: jest.fn(),
                    emit: jest.fn(),
                },
            }}>
                <HeroSection
                    showButton={true}
                    buttonText={buttonText}
                    buttonUrl={buttonUrl}
                />
            </RouterContext.Provider>
        );

        await waitFor(
            () => expect(screen.getByText(buttonText)).toBeVisible()
        );
        fireEvent.click(screen.getByText(buttonText));
        expect(pushedRoute).toEqual(buttonUrl);
    });
});
