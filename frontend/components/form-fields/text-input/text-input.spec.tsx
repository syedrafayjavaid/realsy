import React from 'react';
import {act, fireEvent, render, screen} from "@testing-library/react";
import {TextInput} from "components/form-fields/text-input/text-input";
import '@testing-library/jest-dom';

describe ('Text Input Component', () => {
    it ('renders a labeled text input', () => {
        const testLabel = 'Fake Label';
        render(<TextInput label={testLabel}/>);
        expect(screen.getByLabelText(testLabel)).toBeVisible();
    });

    it ('can render a tooltip that can be clicked open/closed', () => {
        const testLabel = 'Fake Label';
        const testTooltip = 'Fake tooltip';

        render(
            <TextInput
                label={testLabel}
                tooltip={testTooltip}
            />
        );

        const tooltipIcon = screen.getByAltText('More info');
        expect(tooltipIcon).toBeVisible();
        expect(screen.queryByText(testTooltip)).toBeNull(); // starts hidden
        act(() => {
            fireEvent.click(tooltipIcon);
        });
        expect(screen.getByText(testTooltip)).toBeVisible(); // visible after click
        act(() => {
            fireEvent.click(tooltipIcon);
        });
        expect(screen.getByText(testTooltip)).not.toBeVisible(); // not visible after second click
    });
});
