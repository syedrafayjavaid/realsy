import React, {useEffect, useState} from 'react';
import {arrayOf, func, number, object} from "prop-types";
import Fonts from "styles/fonts";
import Colors from "styles/colors";
import CreatableSelect from "components/form-fields/select/creatable-select";
import Select from "components/form-fields/select";
import {Button} from "components/button";
import {useMobileFiltersFormStyles} from "components/listings/map/mobile-filters-form/mobile-filters-form.styles";
import {formatCurrency} from "util/format-currency";
import {arrayForRange} from "util/array-for-range";
import {numericCharsOnly} from "util/numeric-chars-only";

/**
 * The filters form for mobile resolutions
 */
const MobileFiltersForm = (props) => {
    const styleClasses = useMobileFiltersFormStyles();
    const [minPrice, setMinPrice] = useState(props.initialState.minPrice ?? null);
    const [maxPrice, setMaxPrice] = useState(props.initialState.maxPrice ?? null);
    const [bedroomCountFilter, setBedroomCountFilter] = useState(props.initialState.bedroomCountFilter ?? `bedroomCount_gte=1`);
    const [bathroomCountFilter, setBathroomCountFilter] = useState(props.initialState.bathroomCountFilter ?? `bathroomCount_gte=1`);
    const [minPriceOptions, setMinPriceOptions] = useState(props.minPriceOptions);
    const [maxPriceOptions, setMaxPriceOptions] = useState(props.maxPriceOptions);

    const minPriceOptionsWithAny = [{value: null, label: 'Any'}].concat(
        minPriceOptions.map(price => (
            {
                value: price,
                label: formatCurrency(price, {omitDecimal: true}),
                isDisabled: maxPrice && maxPrice <= price,
            }
        ))
    );
    if (minPrice && !minPriceOptions.includes(minPrice)) {
        minPriceOptionsWithAny.push({value: minPrice, label: formatCurrency(minPrice, {omitDecimal: true})});
    }
    const maxPriceOptionsWithAny = maxPriceOptions.map(price => (
        {
            value: price,
            label: formatCurrency(price, {omitDecimal: true}),
            isDisabled: minPrice && minPrice >= price,
        }
    ));
    if (maxPrice && !maxPriceOptions.includes(maxPrice)) {
        maxPriceOptionsWithAny.push({value: maxPrice, label:  formatCurrency(maxPrice, {omitDecimal: true}), isDisabled: false});
    }
    maxPriceOptionsWithAny.push({value: null, label: 'Any', isDisabled: false});

    /**
     * On min price set
     */
    useEffect(() => {
        if (minPrice > 0) {
            setMaxPriceOptions([
                minPrice + 25000,
                minPrice + 50000,
                minPrice + 75000,
                minPrice + 100000,
                minPrice + 125000,
                minPrice + 150000,
            ]);
        }
        if (!minPrice && !maxPrice) {
            setMinPriceOptions(props.minPriceOptions);
            setMaxPriceOptions(props.maxPriceOptions);
        }
    }, [minPrice]);

    /**
     * On max price set
     */
    useEffect(() => {
        if (maxPrice > 0) {
            const newOptions = [
                maxPrice - 150000,
                maxPrice - 125000,
                maxPrice - 100000,
                maxPrice - 75000,
                maxPrice - 50000,
                maxPrice - 25000,
            ];
            setMinPriceOptions(newOptions.filter(option => option > 0));
        }
        if (!minPrice && !maxPrice) {
            setMinPriceOptions(props.minPriceOptions);
            setMaxPriceOptions(props.maxPriceOptions);
        }
    }, [maxPrice]);

    return (
        <form
            className={styleClasses.mobileFiltersForm}
            onSubmit={e => {
                e.preventDefault();
                props.onComplete({
                    minPrice,
                    maxPrice,
                    bedroomCountFilter,
                    bathroomCountFilter,
                });
            }}
        >
            <h2 style={{...Fonts.defaultHeading, color: Colors.mediumBlue}}>Filters</h2>
            <CreatableSelect
                label={'Min Price'}
                value={minPrice}
                options={minPriceOptionsWithAny}
                onChange={selected => {
                    setMinPrice(selected.value);
                }}
                onCreateNew={newInput => {
                    setMinPrice(parseInt(numericCharsOnly(newInput)));
                }}
                onTextChange={newValue => {
                    if (newValue) {
                        return formatCurrency(numericCharsOnly(newValue), {omitDecimal: true})
                    }
                }}
            />
            <br/>
            <CreatableSelect
                label={'Max Price'}
                value={maxPrice}
                options={maxPriceOptionsWithAny}
                onChange={selected => {
                    setMaxPrice(selected.value);
                }}
                onCreateNew={newInput => {
                    setMaxPrice(parseInt(numericCharsOnly(newInput)));
                }}
                onTextChange={newValue => {
                    if (newValue) {
                        return formatCurrency(numericCharsOnly(newValue), {omitDecimal: true})
                    }
                }}
            />
            <br/>
            <Select
                label={'Bedrooms'}
                value={bedroomCountFilter}
                onChange={selected => setBedroomCountFilter(selected.value)}
                options={arrayForRange(props.minBedroomCount, props.maxBedroomCount).map(option => (
                    {value: `bedroomCount_gte=${option}`, label: `${option}+`}
                ))}
            />
            <br/>
            <Select
                label={'Bathrooms'}
                value={bathroomCountFilter}
                onChange={selected => setBathroomCountFilter(selected.value)}
                options={arrayForRange(props.minBathroomCount, props.maxBathroomCount).map(option => (
                    {value: `bathroomCount_gte=${option}`, label: `${option}+`}
                ))}
            />
            <Button className={styleClasses.doneButton}>Done</Button>
        </form>
    )
}

/**
 * Props
 */
MobileFiltersForm.propTypes = {
    onComplete: func,
    initialState: object,
    minPriceOptions: arrayOf(number),
    maxPriceOptions: arrayOf(number),
    minBedroomCount: number,
    maxBedroomCount: number,
    minBathroomCount: number,
    maxBathroomCount: number,
};

MobileFiltersForm.defaultProps = {
    onComplete: () => {},
    initialState: {
        minPrice: null,
        maxPrice: null,
        bedroomCountFilter: null,
        bathroomCountFilter: null,
    },
    minPriceOptions: [
        100000,
        200000,
        300000,
        400000,
        500000,
        600000,
    ],
    maxPriceOptions: [
        500000,
        600000,
        700000,
        800000,
        900000,
        1000000,
        1250000,
        1500000,
    ],
    minBedroomCount: 1,
    maxBedroomCount: 8,
    minBathroomCount: 1,
    maxBathroomCount: 4,
};

export default MobileFiltersForm;
