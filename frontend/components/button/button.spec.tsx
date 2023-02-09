import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import {act, fireEvent, render, screen} from "@testing-library/react";
import {Button} from "./button";

/**
 * @group unit
 */
describe('Button Component', () => {
    it ('renders as a link if given an href property', () => {
        const testHref = '/fake-route';
        const {container} = render(<Button href={testHref}/>);
        const anchor = container.querySelector('a');
        expect(anchor).toBeDefined();
        expect(anchor).toHaveAttribute('href', testHref);
    });

    it ('renders children in a button element if no href property passed', () => {
        const testBody = 'Test Button';
        render(<Button children={testBody}/>);
        expect(screen.getByRole('button')).toHaveTextContent(testBody);
    });

    it ('passes the type property to the button element', () => {
        render(<Button type={'fake'}/>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'fake');
    });

    it ('Renders a spinner if loading property is true', async () => {
        render(<Button loading={true}/>);
        await act(async () => {
            // loader has delay before appearing, so we wait for it
            await(new Promise(resolve => {
                setTimeout(resolve, 300);
            }));
        });
        expect(screen.getByRole('status')).toBeDefined();
    });

    it ('calls the passed onClick function prop when clicked', () => {
        let clicked = false;
        render(<Button onClick={() => clicked = true}/>);
        act(() => {
            fireEvent.click(screen.getByRole('button'));
        });
        expect(clicked).toEqual(true);
    });

    it ('accepts a target prop on link buttons', () => {
        render(
            <Button
                href={'/account/dashboard'}
                target={'_new'}
            />
        );
        expect(screen.getByRole('link')).toHaveAttribute('target', '_new');
    });

    it ('ignores the target prop on non-link buttons', () => {
        render(<Button target={'_new'}/>);
        expect(screen.getByRole('button')).not.toHaveAttribute('target');
    });
});
