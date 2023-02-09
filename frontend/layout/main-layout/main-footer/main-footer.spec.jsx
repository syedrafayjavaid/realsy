import React from 'react';
import MainFooter from "./main-footer";
import {render, screen} from "@testing-library/react";
import '@testing-library/jest-dom';

/**
 * @group unit
 */
describe ('Main Footer', () => {
    it ('renders the main logo linking to the homepage', () => {
        render(<MainFooter/>);
        expect(screen.getByLabelText('Realsy Homes')).toBeVisible();
        expect(screen.getByLabelText('Realsy Homes').closest('a')).toHaveAttribute('href', '/');
    });

    it ('renders a navigation menu of given items', () => {
        const testItemUrl = 'https://www.google.com/';
        const testItemText = 'Google';
        render(
            <MainFooter menuItems={[{url: testItemUrl, text: testItemText}]}/>
        );
        expect(screen.getByText(testItemText)).toBeVisible();
        expect(screen.getByText(testItemText).href).toEqual(testItemUrl);
    });

    it ('renders social media links with given slugs', () => {
        const testItemType = 'facebook';
        const testItemSlug = 'fake-slug';
        render(
            <MainFooter socialMenuItems={[{type: testItemType, slug: testItemSlug}]}/>
        );
        expect(screen.getByText('Facebook')).toBeVisible();
        expect(screen.getByText('Facebook').href).toEqual('https://facebook.com/' + testItemSlug);
    });

    it ('renders a chat with us button with given text prompt', () => {
        const testText = 'Fake Prompt!';
        render(
            <MainFooter chatButtonText={testText}/>
        );
        expect(screen.getByText(testText)).toBeVisible();
    });
});
