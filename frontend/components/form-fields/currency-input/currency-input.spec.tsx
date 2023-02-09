import React from 'react';
import {fireEvent, render, screen} from "@testing-library/react";
import {CurrencyInput} from "components/form-fields/currency-input/currency-input";
import '@testing-library/jest-dom';

/**
 * @group unit
 */
describe ('Current Input', () => {
    it ('renders its value formatted as currency', () => {
        render(<CurrencyInput value={123456789}/>);
        expect(screen.getByDisplayValue('$123,456,789')).toBeVisible();
    });

    it ('passes its value to a given callback when changed', () => {
        const label = 'fake';
        let receivedValue = null;
        render(
            <CurrencyInput
                label={label}
                onChange={newValue => receivedValue = newValue}
            />
        );
        fireEvent.change(screen.getByLabelText(label), {target: {value: '123456789'}});
        expect(receivedValue).toEqual(123456789)
    });
});
