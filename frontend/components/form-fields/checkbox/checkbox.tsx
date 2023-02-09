import React, {FC} from 'react';
import Colors from "styles/colors";
import {useCheckboxStyles} from "./checkbox.styles";

export type CheckboxProps = {
    label?: string,
    onChange?: (checked: boolean) => any,
    checked?: boolean,
    backgroundColor?: string,
    disabled?: boolean,
};

const defaultProps: CheckboxProps = {
    label: '',
    onChange: () => {},
    checked: false,
    backgroundColor: Colors.offWhite,
    disabled: false,
};

export const Checkbox: FC<CheckboxProps> = props => {
    const styleClasses = useCheckboxStyles(props);

    return (
        <label
            className={styleClasses.checkbox}
            style={{cursor: !props.disabled ? 'pointer' : 'initial'}}
        >
            <input
                className={styleClasses.input}
                type="checkbox"
                checked={props.checked}
                disabled={props.disabled}
                onChange={e => {
                    if (!props.disabled) {
                        props.onChange?.(e.target.checked)
                    }
                }}
            />

            {/* for styling, the real checkbox is hidden and replaced */}
            <span
                className={`fake-check`}
                style={{backgroundColor: props.backgroundColor}}
            />

            {props.label}
        </label>
    );
};

Checkbox.defaultProps = defaultProps;
