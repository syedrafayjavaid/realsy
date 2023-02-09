import React, {FC} from 'react'
import Cleave from "cleave.js/react";

/**
 * An input formatted for a US phone number
 */

export type PhoneInputProps = {
    label?: string,
    value?: string,
    onChange?: (newValue: string) => any,
    disabled?: boolean,
    required?: boolean,
    style?: any,
    name?: string,
};

export const PhoneInput: FC<PhoneInputProps> = (props) => {
    return (
        <label
            // click needs to be disabled, as otherwise focusing the input hides tooltips immediately after opening
            onClick={e => e.preventDefault()}
        >
            {props.label}

            <Cleave
                name={props.name}
                value={props.value}
                onChange={e => props.onChange?.(e.target.rawValue)}
                options={{
                    numericOnly: true,
                    blocks:[0, 3, 0, 3, 4],
                    delimiters: ['(', ')', ' ', '-'],
                }}
                disabled={props.disabled}
                required={props.required}
                style={{...props.style}}
            />
        </label>
    );
};
