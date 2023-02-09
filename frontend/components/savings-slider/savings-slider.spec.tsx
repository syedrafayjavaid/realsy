import React from 'react';
import {fireEvent, render, screen} from "@testing-library/react";
import {SavingsSlider} from "components/savings-slider/savings-slider";
import '@testing-library/jest-dom';

/**
 * @group unit
 */
describe ('Saving Slider Component', () => {
    it ('displays given text if supplied in props', () => {
        const afterSavingsText = 'Fake after savings';
        const couldSaveText = 'fake could save';
        const currentValueText = 'fake current value';
        render(
            <SavingsSlider
                currentValueLabel={currentValueText}
                couldSaveLabel={couldSaveText}
                couldSaveLabelAfter={afterSavingsText}
            />
        );
        expect(screen.getByText(afterSavingsText)).toBeVisible();
        expect(screen.getByText(couldSaveText)).toBeVisible();
        expect(screen.getByText(currentValueText)).toBeVisible();
    });

    it ('displays the current home value', () => {
        const fakeLabel = 'Fake Label';
        render(<SavingsSlider currentValueLabel={fakeLabel} initialHomeValue={90000}/>);
        expect(screen.getByTestId('home-value')).toHaveTextContent('$90,000');
        fireEvent.change(screen.getByLabelText(fakeLabel), {target: {value: 500000}});
        expect(screen.getByTestId('home-value')).toHaveTextContent('$500,000');
    });

    it ('displays calculated savings for the current home value', () => {
        const fakeValueLabel = 'Fake Label';
        const fakeSavingsLabel = 'Fake savings';
        const fakeSavingsAfterLabel = 'Fake after';
        render(
            <SavingsSlider
                currentValueLabel={fakeValueLabel}
                couldSaveLabel={fakeSavingsLabel}
                couldSaveLabelAfter={fakeSavingsAfterLabel}
                savingsCalculationStrategy={(homeValue: number) => homeValue / 2}
            />
        );
        fireEvent.change(screen.getByLabelText(fakeValueLabel), {target: {value: 500000}});
        expect(screen.getByLabelText(fakeSavingsLabel + fakeSavingsAfterLabel)).toHaveTextContent('$250,000');
    });
});
