import React from 'react';
import {any, array, bool, func, number, object, string} from "prop-types";
import ArrowDownIcon from "components/icons/arrow-down";
import Fonts from 'styles/fonts';
import Colors from "styles/colors";
import Color from 'color';
import {ToolTip} from "components/tool-tip/tool-tip";
import Creatable from "react-select/creatable";

/**
 * A dropdown selection menu with the option to type in a custom value
 */
const CreatableSelect = props => {
    return (
        <>
            {props.label && <label style={{display: 'inline'}}>{props.label}</label>}
            {props.tooltip && <>{' '}<ToolTip htmlContent={props.tooltip}/></>}
            <Creatable
                placeholder={props.placeholder}
                isDisabled={props.disabled}
                required={props.required}
                options={props.options}
                value={props.options.filter(option => option.value === props.value)[0]}
                onChange={props.onChange}
                onInputChange={props.onTextChange}
                formatCreateLabel={props.createNewLabel}
                onCreateOption={props.onCreateNew}
                styles={{
                    control: (defaultStyles, controlProps) => ({
                        ...defaultStyles,
                        borderColor: controlProps.isFocused ? `${Colors.darkBlue} !important` : `${Colors.defaultInputBorderColor} !important`,
                        backgroundColor: props.backgroundColor,
                        fontFamily: Fonts.mainSansFont,
                        fontSize: 16,
                        '@media (min-width: 800px)': {
                            fontSize: 14,
                        },
                        padding: props.padding,
                        height: props.height,
                        color: Colors.defaultInputTextColor,
                        boxShadow: null,
                        cursor: 'pointer',
                        ...controlProps.controlStyles
                    }),
                    option: (defaultStyles, optionProps) => ({
                        ...defaultStyles,
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
                    }),
                    input: defaultStyles => ({
                        ...defaultStyles,
                        marginBottom: -10,
                    }),
                }}
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
CreatableSelect.propTypes = {
    value: any,
    onChange: func,
    onTextChange: func,
    options: array.isRequired,
    label: string,
    required: bool,
    className: string,
    backgroundColor: string,
    padding: string,
    controlStyles: object,
    disabled: bool,
    tooltip: string,
    height: string,
    placeholder: string,
    createNewLabel: func,
    onCreateNew: func,
};

CreatableSelect.defaultProps = {
    required: false,
    onChange: () => {},
    className: '',
    padding: '8px 0',
    backgroundColor: '#fff',
    controlStyles: {},
    disabled: false,
    height: '100%',
    placeholder: '',
    createNewLabel: (newLabel) => newLabel,
};

export default CreatableSelect;
