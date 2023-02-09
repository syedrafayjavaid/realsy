import React from 'react';
import {act, render, screen} from "@testing-library/react";
import {PhoneInput} from "components/form-fields/phone-input/phone-input";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";

/**
 * @group unit
 */
describe ('Phone Input Component', () => {
    it ('renders an input with a label', () => {
        const label = 'fake label';
        render(<PhoneInput label={label}/>);
        expect(screen.getByLabelText(label)).toBeVisible();
    });

    it ('formats its value as a phone number', () => {
        render(<PhoneInput value={'1231231234'}/>);
        expect(screen.getByDisplayValue('(123) 123-1234')).toBeVisible();
    });

    it ('passes its value to a given callback when changed', () => {
        const label = 'fake';
        let receivedValue = null;
        const inputValue = '9879879876';

        render(
            <PhoneInput
                label={label}
                onChange={newValue => receivedValue = newValue}
            />
        );
        userEvent.type(screen.getByLabelText(label), inputValue);

        expect(receivedValue).toEqual(inputValue);
        expect(screen.getByDisplayValue('(987) 987-9876')).toBeVisible();
    });

    it ('refuses non-numeric character', () => {
        render(<PhoneInput label={'input'}/>);
        userEvent.type(screen.getByLabelText('input'), 'abcd');
        expect(screen.getByLabelText('input')).toHaveValue('');
    });
});
