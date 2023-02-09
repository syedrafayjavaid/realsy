import React from 'react';
import {fireEvent, render, screen} from "@testing-library/react";
import {Checkbox} from "./checkbox";
import '@testing-library/jest-dom';

/**
 * @group unit
 */
describe ('Checkbox Component', () => {
    it ('renders with a given label', () => {
        const testLabel = 'Fake label';
        render(<Checkbox label={testLabel}/>);
        expect(screen.getByText(testLabel)).toBeVisible();
    });

    it ('can be marked checked and unchecked', () => {
        const label = 'fake label';
        render(<Checkbox label={label} checked={true}/>);
        expect(screen.getByLabelText(label)).toBeChecked();
        const label2 = 'fake label 2';
        render(<Checkbox label={label2} checked={false}/>);
        expect(screen.getByLabelText(label2)).not.toBeChecked();
    });

    it ('passes its checked state to a given callback when changed', () => {
        const label = 'fake label';

        let checked = false;
        render(
            <Checkbox
                label={label}
                checked={checked}
                onChange={nowChecked => checked = nowChecked}
            />
        );
        fireEvent.click(screen.getByLabelText(label));

        expect(checked).toBe(true);
    });

    it ('does not pass state to callback if disabled', () => {
        const label = 'fake label';

        let checked = false;
        render(
            <Checkbox
                disabled={true}
                label={label}
                checked={checked}
                onChange={nowChecked => checked = nowChecked}
            />
        );
        fireEvent.click(screen.getByLabelText(label));

        expect(checked).toBe(false);
    });
});
