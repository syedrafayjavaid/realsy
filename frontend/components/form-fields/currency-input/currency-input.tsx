import React, {FC} from 'react'
import Cleave from "cleave.js/react";
import {ToolTip} from "components/tool-tip/tool-tip";

/**
 * A text input formatted for currency values
 */

export type CurrencyInputProps = {
    label?: string,
    value?: number,
    onChange?: (newValue: number) => any,
    tooltip?: string,
    name?: string,
    required?: boolean,
};

export const CurrencyInput: FC<CurrencyInputProps> = (props) => {
    return (
        <label
            style={{display: 'inline'}}
            // click needs to be disabled, as otherwise focusing the input hides tooltips immediately after opening
            onClick={e => e.preventDefault()}
        >
            {props.label}
            {props.tooltip &&
                <ToolTip htmlContent={props.tooltip}/>
            }

            <Cleave
                name={props.name}
                value={props.value?.toString()}
                options={{
                    numeral: true,
                    numeralThousandsGroupStyle: "thousand",
                    prefix: '$',
                }}
                onChange={e =>  props.onChange?.(parseInt(e.target.rawValue.replace('$', '')))}
                required={props.required}
            />
        </label>
    );
};
