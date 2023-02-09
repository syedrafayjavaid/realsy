import React, {FC, useState} from 'react';
import {formatCurrency} from "util/format-currency";
import {useSavingsSliderStyles} from "./savings-slider.styles";
import Listings from "api/listings";

/**
 * A box with an interactive slider showing what a user could save by using Realsy
 */

export type SavingsSliderProps = {
    currentValueLabel?: string,
    couldSaveLabel?: string,
    couldSaveLabelAfter?: string,
    minHomeValue?: number,
    maxHomeValue?: number,
    homeValueStep?: number,
    initialHomeValue?: number,
    savingsCalculationStrategy?: (homeValue: number) => number;
}

export const SavingsSlider: FC<SavingsSliderProps> = ({
    currentValueLabel = 'Your current home value',
    couldSaveLabel = 'You could save',
    couldSaveLabelAfter = 'Using Realsy instead of a traditional real estate agent',
    minHomeValue = 50000,
    maxHomeValue = 1000000,
    homeValueStep = 5000,
    initialHomeValue = 250000,
    savingsCalculationStrategy = (homeValue:number) => Listings.calculateSavings(homeValue),
}) => {
    const styleClasses = useSavingsSliderStyles();
    const [homeValue, setHomeValue] = useState<number>(initialHomeValue ?? 250000);

    return (
        <form className={styleClasses.savingsSlider}>
            <label>
                {currentValueLabel}
                <input
                    name={'home-value'}
                    type="range"
                    onChange={e => setHomeValue(parseInt(e.target.value))}
                    className={styleClasses.rangeInput}
                    value={homeValue}
                    min={minHomeValue}
                    max={maxHomeValue}
                    step={homeValueStep}
                />
                <output className={styleClasses.homeValue} data-testid={'home-value'}>
                    {formatCurrency(homeValue, {omitDecimal: true})}
                </output>
            </label>

            <label>
                <span>
                    {couldSaveLabel}
                </span>
                <output className='savings-amount'>
                    {formatCurrency(savingsCalculationStrategy(homeValue), {omitDecimal: true})}
                </output>
                <span style={{padding: '10px 20px 0', lineHeight: 1.4}}>
                    {couldSaveLabelAfter}
                </span>
            </label>
        </form>
    )
}
