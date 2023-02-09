import React, {FC} from 'react';
import {RadioButton} from './radio-button';
import {useRadioButtonGroupStyles} from './radio-button-group.styles';
import Colors from "styles/colors";
import {ToolTip} from "components/tool-tip";

/**
 * A group of radio button inputs
 */

export type RadioButtonGroupProps = {
    label?: string,
    name?: string,
    value?: string,
    onChange?: (newValue: string) => any,
    inlineOptions?: boolean,
    buttonBackgroundColor?: string,
    buttonColor?: string,
    tooltipContent?: string,
    options: {label: string, value?: string}[],
}

const defaultProps: RadioButtonGroupProps = {
    buttonBackgroundColor: '#fff',
    buttonColor: Colors.mediumBlue,
    options: [],
};

export const RadioButtonGroup: FC<RadioButtonGroupProps> = (props) => {
    const styleClasses = useRadioButtonGroupStyles(props);

    return (
        <fieldset className={styleClasses.radioButtonGroup}>
            {props.label &&
                <legend>
                    {props.label}
                    {props.tooltipContent && <span> <ToolTip htmlContent={props.tooltipContent}/></span>}
                </legend>
            }
            {props.options.map((option, i) => (
                <div className={styleClasses.buttonContainer}>
                    <RadioButton
                        key={i}
                        name={props.name}
                        checked={option.value ? props.value === option.value : props.value === option.label}
                        onChange={value => props.onChange?.(value)}
                        label={option.label}
                        value={option.value || option.label}
                        buttonBackgroundColor={props.buttonBackgroundColor}
                        buttonColor={props.buttonColor}
                    />
                </div>
            ))}
        </fieldset>
    );
};

RadioButtonGroup.defaultProps = defaultProps;
