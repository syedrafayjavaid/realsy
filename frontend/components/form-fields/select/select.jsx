import React from 'react';
import {any, array, bool, func, object, string} from "prop-types";
import ReactSelect from 'react-select';
import ArrowDownIcon from "components/icons/arrow-down";
import Fonts from 'styles/fonts';
import Colors from "styles/colors";
import Color from 'color';
import {ToolTip} from "components/tool-tip/tool-tip";

/**
 * A dropdown selection menu
 */
const Select = props => {
    return (
        <>
            {props.label && <label style={{display: 'inline'}}>{props.label}</label>}
            {props.tooltip && <>{' '}<ToolTip htmlContent={props.tooltip}/></>}
            <ReactSelect
                placeholder={props.placeholder}
                isDisabled={props.disabled}
                required={props.required}
                options={props.options}
                value={props.options.filter(option => option.value === props.value)[0]}
                onChange={props.onChange}
                styles={{
                    control: (defaultStyles, controlProps) => ({
                        ...defaultStyles,
                        borderColor: controlProps.isFocused ? `${Colors.darkBlue} !important` : `${Colors.defaultInputBorderColor} !important`,
                        backgroundColor: props.backgroundColor,
                        fontFamily: Fonts.mainSansFont,
                        fontSize: 16,
                        padding: props.padding,
                        height: props.dynamicHeight ? 'initial' : '100%',
                        color: Colors.defaultInputTextColor,
                        boxShadow: null,
                        cursor: 'pointer',
                        '@media (min-width: 800px)': {
                            fontSize: 14,
                        },
                        ...controlProps.controlStyles
                    }),
                    option: (defaultStyles, optionProps) => ({
                        ...defaultStyles,
                        fontSize: 16,
                        '@media (min-width: 800px)': {
                            fontSize: 14,
                        },
                        cursor: 'pointer',
                        backgroundColor: optionProps.isSelected
                            ? Colors.mediumBlue
                            : (optionProps.isFocused ? Color(Colors.lightBlue).lighten(0.99).hex() : '#fff'),
                        '&:active': {
                            backgroundColor: Color(Colors.lightBlue).lighten(0.85).hex()
                        },
                    }),
                    singleValue: defaultStyles => ({
                        ...defaultStyles,
                        color: Colors.defaultInputTextColor
                    }),
                    menu: defaultStyles => ({
                        ...defaultStyles,
                        zIndex: 9,
                        marginTop: 0,
                        overflow: 'hidden',
                        width: 'auto',
                        minWidth: '100%',
                        fontFamily: Fonts.mainSansFont,
                        fontSize: 16,
                        '@media (min-width: 800px)': {
                            fontSize: 14,
                        },
                        color: Colors.defaultInputTextColor,
                    }),
                    menuList: providedStyles => ({
                        ...providedStyles,
                        padding: 0
                    })
                }}
                isSearchable={props.searchable}
                components={{
                    DropdownIndicator: () => <ArrowDownIcon style={{fill: Colors.lightBlue, marginRight: 7}}/>,
                    IndicatorSeparator: () => null
                }}
            />
        </>
    );
};

/**
 * Props
 */
Select.propTypes = {
    value: any,
    onChange: func,
    options: array.isRequired,
    label: string,
    required: bool,
    className: string,
    backgroundColor: string,
    padding: string,
    controlStyles: object,
    disabled: bool,
    tooltip: string,
    dynamicHeight: bool,
    placeholder: string,
    searchable: bool,
};

Select.defaultProps = {
    required: false,
    onChange: () => {},
    className: '',
    padding: '8px 0',
    backgroundColor: '#fff',
    controlStyles: {},
    disabled: false,
    dynamicHeight: false,
    placeholder: '',
    searchable: false,
};

export default Select;
