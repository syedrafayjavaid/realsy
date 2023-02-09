import React, {FC} from "react";
import Select from 'components/form-fields/select';

/**
 * TimeSelect inner component
 */

export type TimeSelectProps = {
    disabled?: boolean,
    value?: string,
    minValue?: string,
    onChange?: (newValue: string) => any,
    selectColor?: string,
}

export const TimeSelect: FC<TimeSelectProps> = (props) => {
    const options = [
        {value: '07:00:00', isDisabled: props.minValue && timeBefore('07:00:00', props.minValue), label: '7am'},
        {value: '08:00:00', isDisabled: props.minValue && timeBefore('08:00:00', props.minValue), label: '8am'},
        {value: '09:00:00', isDisabled: props.minValue && timeBefore('09:00:00', props.minValue), label: '9am'},
        {value: '10:00:00', isDisabled: props.minValue && timeBefore('10:00:00', props.minValue), label: '10am'},
        {value: '11:00:00', isDisabled: props.minValue && timeBefore('11:00:00', props.minValue), label: '11am'},
        {value: '12:00:00', isDisabled: props.minValue && timeBefore('12:00:00', props.minValue), label: '12pm'},
        {value: '13:00:00', isDisabled: props.minValue && timeBefore('13:00:00', props.minValue), label: '1pm'},
        {value: '14:00:00', isDisabled: props.minValue && timeBefore('14:00:00', props.minValue), label: '2pm'},
        {value: '15:00:00', isDisabled: props.minValue && timeBefore('15:00:00', props.minValue), label: '3pm'},
        {value: '16:00:00', isDisabled: props.minValue && timeBefore('16:00:00', props.minValue), label: '4pm'},
        {value: '17:00:00', isDisabled: props.minValue && timeBefore('17:00:00', props.minValue), label: '5pm'},
        {value: '18:00:00', isDisabled: props.minValue && timeBefore('18:00:00', props.minValue), label: '6pm'},
        {value: '19:00:00', isDisabled: props.minValue && timeBefore('19:00:00', props.minValue), label: '7pm'},
        {value: '20:00:00', isDisabled: props.minValue && timeBefore('20:00:00', props.minValue), label: '8pm'},
        {value: '21:00:00', isDisabled: props.minValue && timeBefore('21:00:00', props.minValue), label: '9pm'},
        {value: '22:00:00', isDisabled: props.minValue && timeBefore('22:00:00', props.minValue), label: '10pm'},
    ];

    return (
        <div style={{width: '75px', display: 'inline-block', position: 'relative', top: -5}}>
            <Select
                padding={'0'}
                disabled={props.disabled}
                backgroundColor={props.selectColor}
                value={props.value}
                onChange={selectedOption => props.onChange?.(selectedOption.value)}
                options={options}
                controlStyles={{padding: 0, width: 75}}
                searchable={false}
            />
        </div>
    );
};

/**
 * Compares time strings to determine which is earlier
 * Used to disable "end times" later than the start times
 */
function timeBefore(lhs: string, rhs: string) {
    if (lhs === undefined || rhs === undefined) return false;
    return (new Date('1/1/1970 ' + lhs) < new Date('1/1/1970 ' + rhs));
}
