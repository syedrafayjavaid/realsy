import React, {FC, HTMLProps} from 'react';
import Colors from "styles/colors";
import {ToolTip} from "components/tool-tip/tool-tip";
import {useTextInputStyles} from "components/form-fields/text-input/text-input.styles";

/**
 * A text input field
 */

export type TextInputProps = {
    type?: string,
    label?: string,
    value?: string,
    name?: string,
    onChange?: (newValue: string) => any,
    backgroundColor?: string,
    trimInput?: boolean,
    disableLeadingWhitespace?: boolean,
    maxLength?: number,
    numbersOnly?: boolean,
    allowDecimals?: boolean, // only effective if numbersOnly is true
    tooltip?: string,
    inputProps?: HTMLProps<HTMLInputElement>,
    disabled?: boolean,
    className?: string,
    required?: boolean,
};

const defaultProps: TextInputProps = {
    type: 'text',
    backgroundColor: Colors.offWhite,
    trimInput: true,
    disableLeadingWhitespace: true,
    maxLength: 128,
    numbersOnly: false,
    allowDecimals: false,
    inputProps: {},
    required: false,
};

export const TextInput: FC<TextInputProps> = (props) => {
    const styleClasses = useTextInputStyles(props);

    return (
        <>
            <label
                className={`${styleClasses.label} ${props.className}`}
                // click needs to be disabled, as otherwise focusing the input hides tooltips immediately after opening
                onClick={e => e.preventDefault()}
            >
                {props.label}
                {props.tooltip && <>{' '}<ToolTip htmlContent={props.tooltip}/></>}

                <input
                    disabled={props.disabled}
                    className={styleClasses.input}
                    style={{backgroundColor: props.backgroundColor}}
                    value={props.value}
                    type={props.type}
                    onChange={e => {
                        let value = e.target.value;
                        if (props.disableLeadingWhitespace) {
                            value = value.trimLeft();
                        }
                        if (props.numbersOnly) {
                            // strip out non-numeric chars
                            if (props.allowDecimals) {
                                value = value.replace(/[^\d.-]/g, '');
                            }
                            else {
                                value = value.replace(/\D/g, '');
                            }
                        }
                        props.onChange?.(value);
                    }}
                    name={props.name}
                    maxLength={props.maxLength}
                    required={props.required}
                    {...props.inputProps}
                />
            </label>
        </>
    );
};

TextInput.defaultProps = defaultProps;

