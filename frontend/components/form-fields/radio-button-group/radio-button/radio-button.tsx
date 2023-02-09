import React, {FC} from 'react';
import {bool, func, string} from "prop-types";
import {useRadioButtonStyles} from './radio-button.styles';
import Colors from "styles/colors";

/**
 * A radio input button
 */

export type RadioButtonProps = {
    name?: string,
    checked?: boolean,
    label?: string,
    value?: string,
    onChange?: (value: string) => any,
    buttonBackgroundColor?: string,
    buttonColor?: string,
};

const defaultProps: RadioButtonProps = {
    buttonBackgroundColor: '#fff',
    buttonColor: Colors.mediumBlue
}

export const RadioButton: FC<RadioButtonProps> = (props) => {
    const styleClasses = useRadioButtonStyles(props);

    return (
        <label className={styleClasses.radioButton}>
            <input
                type='radio'
                value={props.value || props.label}
                checked={props.checked}
                onChange={e => props.onChange?.(e.target.value)}
            />
            <span className={styleClasses.checkIndicator}/>
            {props.label}
        </label>
    );
};

RadioButton.defaultProps = defaultProps;

