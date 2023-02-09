import React from 'react';
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {CmsTransformedContent} from "components/cms-transformed-content/cms-transformed-content";
import {
    CmsButtonDto,
    CmsContentItemTypes,
    CmsHeroSectionDto, CmsImageDto,
    CmsSavingsSliderDto,
    CmsUserGuideBoxDto
} from "cms/cms-content-item-types";
import '@testing-library/jest-dom';
import 'intersection-observer';
import {AuthContext} from "api/auth/auth-context";
import {RouterContext} from "next/dist/next-server/lib/router-context";
import {mockAuthContext} from "__mocks__/mock-auth-context";
import {mockRouterContext} from "__mocks__/mock-router-context";

/**
 * @group unit
 */
describe ('CMS Transformed Content Component', () => {
    it ('renders rich text content items', () => {
        const heading = 'Fake Heading';
        const bodyContent = 'test content';
        render(
            <CmsTransformedContent contentItems={[
                {
                    __component: CmsContentItemTypes.RichBodyText,
                    body: `<h2>${heading}</h2><p>${bodyContent}</p>`,
                },
            ]}/>
        );
        expect(screen.getByRole('heading')).toBeVisible();
        expect(screen.getByRole('heading')).toHaveTextContent(heading);
        expect(screen.getByText(bodyContent)).toBeVisible();
    });

    it ('renders hero section content items', async () => {
        const fakeHeroSection: CmsHeroSectionDto = {
            __component: CmsContentItemTypes.HeroSection,
            headline: 'Fake Headline',
            showGetStartedButton: true,
            fullWidth: true,
        };
        render(<CmsTransformedContent contentItems={[fakeHeroSection]}/>);
        // hero section fades heading in, so we have to wait for it
        await waitFor(() => {
            expect(screen.getByRole('heading')).toHaveTextContent(fakeHeroSection.headline!);
            expect(screen.getByRole('heading')).toBeVisible();
        });
    });

    it ('renders hero sections that initiate "get started" on button click if showGetStartedButton prop is true', async () => {
        const fakeHeroSection: CmsHeroSectionDto = {
            __component: CmsContentItemTypes.HeroSection,
            headline: 'Fake Headline',
            showGetStartedButton: true,
            fullWidth: true,
            buttonText: 'Fake Button',
        };
        let getStartedTriggered = false;
        render(
            <AuthContext.Provider value={mockAuthContext({getStarted: () => getStartedTriggered = true})}>
                <CmsTransformedContent contentItems={[fakeHeroSection]}/>
            </AuthContext.Provider>
        );
        await waitFor(() => {
            expect(screen.getByRole('heading')).toBeVisible();
        });
        expect(screen.getByRole('heading')).toHaveTextContent(fakeHeroSection.headline!);
        expect(screen.getByRole('button')).toHaveTextContent(fakeHeroSection.buttonText!);
        fireEvent.click(screen.getByRole('button'));
        expect(getStartedTriggered).toBe(true);

    });

    it ('links hero section button to given URL if showGetStartedButton prop is false', async () => {
        const fakeHeroSection: CmsHeroSectionDto = {
            __component: CmsContentItemTypes.HeroSection,
            headline: 'Fake Headline',
            showGetStartedButton: false,
            fullWidth: true,
            buttonText: 'Fake Link',
            buttonUrl: '/buy',
        };
        render(
            <RouterContext.Provider value={mockRouterContext()}>
                <CmsTransformedContent contentItems={[fakeHeroSection]}/>
            </RouterContext.Provider>
        );
        await waitFor(() => {
            expect(screen.getByRole('heading')).toBeVisible();
        });
        expect(screen.getByRole('heading')).toHaveTextContent(fakeHeroSection.headline!);
        expect(screen.getByRole('link')).toBeVisible();
        expect(screen.getByRole('link')).toHaveAttribute('href', fakeHeroSection.buttonUrl);
    });

    it ('renders savings slider content items', () => {
        const savingsSliderItem: CmsSavingsSliderDto = {
            __component: CmsContentItemTypes.SavingsSlider,
            currentValueText: 'fake text',
        };
        render(<CmsTransformedContent contentItems={[savingsSliderItem]}/>)
        expect(screen.getByText(savingsSliderItem.currentValueText!)).toBeVisible();
    });

    it ('renders user guide box items', async () => {
        const userGuideBoxItem: CmsUserGuideBoxDto = {
            __component: CmsContentItemTypes.UserGuideBox,
            heading: 'Fake Guide Box',
            bulletPoints: [
                {body: 'test'},
                {body: 'fake'},
            ]
        };

        render(
            <RouterContext.Provider value={mockRouterContext()}>
                <CmsTransformedContent contentItems={[userGuideBoxItem]}/>
            </RouterContext.Provider>
        );

        // user guide boxes fade in, so wait for it
        await waitFor(() => {
            expect(screen.getByRole('heading')).toBeVisible();
            expect(screen.getByRole('heading')).toHaveTextContent(userGuideBoxItem.heading);
        });
    });

    it ('renders button items', async () => {
        const buttonItem: CmsButtonDto = {
            __component: CmsContentItemTypes.Button,
            text: 'Fake Button',
            link: '/about',
        };

        render(
            <RouterContext.Provider value={mockRouterContext()}>
                <CmsTransformedContent contentItems={[buttonItem]}/>
            </RouterContext.Provider>
        );

        expect(screen.getByRole('link')).toBeVisible();
        expect(screen.getByRole('link')).toHaveAttribute('href', buttonItem.link);
        expect(screen.getByRole('link')).toHaveTextContent(buttonItem.text);
    });

    it ('renders button items that trigger intercom chat', async () => {
        const buttonItem: CmsButtonDto = {
            __component: CmsContentItemTypes.Button,
            text: 'Chat Button',
            triggerChat: true,
        };

        render(
            <CmsTransformedContent contentItems={[buttonItem]}/>
        );

        expect(screen.getByRole('button')).toBeVisible();
        expect(screen.getByRole('button')).toHaveTextContent(buttonItem.text);
        expect(screen.getByRole('button')).toHaveClass('chat-launcher');
    });

    it ('renders button items that trigger get started', async () => {
        const buttonItem: CmsButtonDto = {
            __component: CmsContentItemTypes.Button,
            text: 'Get Started',
            triggerSignIn: true,
        };

        render(
            <RouterContext.Provider value={mockRouterContext()}>
                <CmsTransformedContent contentItems={[buttonItem]}/>
            </RouterContext.Provider>
        );

        expect(screen.getByRole('link')).toBeVisible();
        expect(screen.getByRole('link')).toHaveTextContent(buttonItem.text);
        expect(screen.getByRole('link')).toHaveAttribute('href', '/account/dashboard');
    });

    it ('renders image content items', async () => {
        const imageItem: CmsImageDto = {
            __component: CmsContentItemTypes.Image,
            image: { url: '/favicon.ico' }
        };

        render(
            <RouterContext.Provider value={mockRouterContext()}>
                <CmsTransformedContent contentItems={[imageItem]}/>
            </RouterContext.Provider>
        );

        expect(screen.getByRole('img')).toBeVisible();
        expect(screen.getByRole('img')).toHaveAttribute('src', imageItem.image!.url);
    })
});
