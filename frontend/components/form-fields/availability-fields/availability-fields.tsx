import React, {FC, useEffect, useState} from 'react';
import {Checkbox} from "components/form-fields/checkbox";
import Colors from "styles/colors";
import {useAvailabilityFieldsStyles} from "./availability-fields.styles";
import {TimeSelect} from "components/form-fields/availability-fields/time-select";

/**
 * Input fields for a user's time availability
 *
 * Accepts and returns entire availability objects (with all days and times),
 * to prevent having to handle all of them separately every place these inputs are used
 */

export type AvailabilityFieldsProps = {
    onChange: ((newAvailability: any) => any),
    initialAvailability: any,
    checkboxColor?: string,
    selectColor?: string,
    disabled?: boolean,
};

const defaultProps = {
    onChange: () => {},
    initialAvailability: {},
    checkboxColor: Colors.offWhite,
    selectColor: Colors.offWhite,
    disabled: false
};

export const AvailabilityFields: FC<AvailabilityFieldsProps> = (props) => {
    const styleClasses = useAvailabilityFieldsStyles();

    /**
     * Component state
     */
    const [availableSunday, setAvailableSunday] = useState(
        props.initialAvailability.availableSundayStart !== undefined
        &&props.initialAvailability.availableSundayStart !== null
    );
    const [availableSundayStart, setAvailableSundayStart] = useState(props.initialAvailability.availableSundayStart || '07:00:00');
    const [availableSundayEnd, setAvailableSundayEnd] = useState(props.initialAvailability.availableSundayEnd || '22:00:00');
    const [availableMonday, setAvailableMonday] = useState(
        props.initialAvailability.availableMondayStart !== undefined
        && props.initialAvailability.availableMondayStart !== null
    );
    const [availableMondayStart, setAvailableMondayStart] = useState(props.initialAvailability.availableMondayStart || '07:00:00');
    const [availableMondayEnd, setAvailableMondayEnd] = useState(props.initialAvailability.availableMondayEnd || '22:00:00');
    const [availableTuesday, setAvailableTuesday] = useState(
        props.initialAvailability.availableTuesdayStart !== undefined
        && props.initialAvailability.availableTuesdayStart !== null
    );
    const [availableTuesdayStart, setAvailableTuesdayStart] = useState(props.initialAvailability.availableTuesdayStart || '07:00:00');
    const [availableTuesdayEnd, setAvailableTuesdayEnd] = useState(props.initialAvailability.availableTuesdayEnd || '22:00:00');
    const [availableWednesday, setAvailableWednesday] = useState(
        props.initialAvailability.availableWednesdayStart !== undefined
        && props.initialAvailability.availableWednesdayStart !== null
    );
    const [availableWednesdayStart, setAvailableWednesdayStart] = useState(props.initialAvailability.availableWednesdayStart || '07:00:00');
    const [availableWednesdayEnd, setAvailableWednesdayEnd] = useState(props.initialAvailability.availableWednesdayEnd || '22:00:00');
    const [availableThursday, setAvailableThursday] = useState(
        props.initialAvailability.availableThursdayStart !== undefined
        && props.initialAvailability.availableThursdayStart !== null
    );
    const [availableThursdayStart, setAvailableThursdayStart] = useState(props.initialAvailability.availableThursdayStart || '07:00:00');
    const [availableThursdayEnd, setAvailableThursdayEnd] = useState(props.initialAvailability.availableThursdayEnd || '22:00:00');
    const [availableFriday, setAvailableFriday] = useState(
        props.initialAvailability.availableFridayStart !== undefined
        && props.initialAvailability.availableFridayStart !== null
    );
    const [availableFridayStart, setAvailableFridayStart] = useState(props.initialAvailability.availableFridayStart || '07:00:00');
    const [availableFridayEnd, setAvailableFridayEnd] = useState(props.initialAvailability.availableFridayEnd || '22:00:00');
    const [availableSaturday, setAvailableSaturday] = useState(
        props.initialAvailability.availableSaturdayStart !== undefined
        && props.initialAvailability.availableSaturdayStart !== null
    );
    const [availableSaturdayStart, setAvailableSaturdayStart] = useState(props.initialAvailability.availableSaturdayStart || '07:00:00');
    const [availableSaturdayEnd, setAvailableSaturdayEnd] = useState(props.initialAvailability.availableSaturdayEnd || '22:00:00');

    /**
     * Passes entire state to change handler when one field changes
     */
    useEffect(
        () => {
            props.onChange({
                availableSundayStart: availableSunday ? availableSundayStart : null,
                availableSundayEnd: availableSunday ? availableSundayEnd : null,
                availableMondayStart: availableMonday ? availableMondayStart : null,
                availableMondayEnd: availableMonday ? availableMondayEnd : null,
                availableTuesdayStart: availableTuesday ? availableTuesdayStart : null,
                availableTuesdayEnd: availableTuesday ? availableTuesdayEnd : null,
                availableWednesdayStart: availableWednesday ? availableWednesdayStart : null,
                availableWednesdayEnd: availableWednesday ? availableWednesdayEnd : null,
                availableThursdayStart: availableThursday ? availableThursdayStart : null,
                availableThursdayEnd: availableThursday ? availableThursdayEnd : null,
                availableFridayStart: availableFriday ? availableFridayStart : null,
                availableFridayEnd: availableFriday ? availableFridayEnd : null,
                availableSaturdayStart: availableSaturday ? availableSaturdayStart : null,
                availableSaturdayEnd: availableSaturday ? availableSaturdayEnd : null,
            });
        }, [
            availableSunday, availableSundayStart, availableSundayEnd,
            availableMonday, availableMondayStart, availableMondayEnd,
            availableTuesday, availableTuesdayStart, availableTuesdayEnd,
            availableWednesday, availableWednesdayStart, availableWednesdayEnd,
            availableThursday, availableThursdayStart, availableThursdayEnd,
            availableFriday, availableFridayStart, availableFridayEnd,
            availableSaturday, availableSaturdayStart, availableSaturdayEnd,
        ]
    );

    /**
     * Render
     */
    return (
        <div className={styleClasses.availabilityFields}>
            <Checkbox
                label={'Sun'}
                disabled={props.disabled}
                backgroundColor={props.checkboxColor}
                checked={availableSunday}
                onChange={checked => setAvailableSunday(checked)}
            />
            {availableSunday && <>
                <TimeSelect
                    disabled={props.disabled}
                    value={availableSundayStart}
                    onChange={newTime => {
                        if (newTime > availableSundayEnd) {
                            setAvailableSundayEnd(newTime);
                        }
                        setAvailableSundayStart(newTime);
                    }}
                />
                <span> to </span>
                <TimeSelect disabled={props.disabled} value={availableSundayEnd} minValue={availableSundayStart} onChange={newTime => {
                    if (newTime < availableSundayStart) {
                        setAvailableSundayStart(newTime);
                    }
                    setAvailableSundayEnd(newTime);
                }} />
            </>}
            <br/>

            <Checkbox
                label={'Mon'} checked={availableMonday}
                disabled={props.disabled}
                backgroundColor={props.checkboxColor}
                onChange={checked => setAvailableMonday(checked)}
            />
            {availableMonday && <>
                <TimeSelect disabled={props.disabled} value={availableMondayStart} onChange={newTime => {
                    if (newTime > availableMondayEnd) {
                        setAvailableMondayEnd(newTime);
                    }
                    setAvailableMondayStart(newTime);
                }} />
                <span> to </span>
                <TimeSelect disabled={props.disabled} value={availableMondayEnd} minValue={availableMondayStart} onChange={newTime => {
                    if (newTime < availableMondayStart) {
                        setAvailableMondayStart(newTime);
                    }
                    setAvailableMondayEnd(newTime);
                }} />
            </>}
            <br/>

            <Checkbox
                label={'Tues'}
                disabled={props.disabled}
                backgroundColor={props.checkboxColor}
                checked={availableTuesday}
                onChange={checked => setAvailableTuesday(checked)}
            />
            {availableTuesday && <>
                <TimeSelect disabled={props.disabled} value={availableTuesdayStart} onChange={newTime => {
                    if (newTime > availableTuesdayEnd) {
                        setAvailableTuesdayEnd(newTime);
                    }
                    setAvailableTuesdayStart(newTime);
                }} />
                <span> to </span>
                <TimeSelect disabled={props.disabled} value={availableTuesdayEnd} minValue={availableTuesdayStart} onChange={newTime => {
                    if (newTime < availableTuesdayStart) {
                        setAvailableTuesdayStart(newTime);
                    }
                    setAvailableTuesdayEnd(newTime);
                }} />
            </>}
            <br/>

            <Checkbox
                label={'Wed'}
                disabled={props.disabled}
                backgroundColor={props.checkboxColor}
                checked={availableWednesday}
                onChange={checked => setAvailableWednesday(checked)}
            />
            {availableWednesday && <>
                <TimeSelect disabled={props.disabled} value={availableWednesdayStart} onChange={newTime => {
                    if (newTime > availableWednesdayEnd) {
                        setAvailableWednesdayEnd(newTime);
                    }
                    setAvailableWednesdayStart(newTime);
                }} />
                <span> to </span>
                <TimeSelect disabled={props.disabled} value={availableWednesdayEnd} minValue={availableWednesdayStart} onChange={newTime => {
                    if (newTime < availableWednesdayStart) {
                        setAvailableWednesdayStart(newTime);
                    }
                    setAvailableWednesdayEnd(newTime);
                }} />
            </>}
            <br/>

            <Checkbox
                label={'Thurs'}
                disabled={props.disabled}
                backgroundColor={props.checkboxColor}
                checked={availableThursday}
                onChange={checked => setAvailableThursday(checked)}
            />
            {availableThursday && <>
                <TimeSelect disabled={props.disabled} value={availableThursdayStart} onChange={newTime => {
                    if (newTime > availableThursdayEnd) {
                        setAvailableThursdayEnd(newTime);
                    }
                    setAvailableThursdayStart(newTime);
                }} />
                <span> to </span>
                <TimeSelect disabled={props.disabled} value={availableThursdayEnd} minValue={availableThursdayStart} onChange={newTime => {
                    if (newTime < availableThursdayStart) {
                        setAvailableThursdayStart(newTime);
                    }
                    setAvailableThursdayEnd(newTime);
                }} />
            </>}
            <br/>

            <Checkbox
                label={'Fri'}
                disabled={props.disabled}
                backgroundColor={props.checkboxColor}
                checked={availableFriday}
                onChange={checked => setAvailableFriday(checked)}
            />
            {availableFriday && <>
                <TimeSelect disabled={props.disabled} value={availableFridayStart} onChange={newTime => {
                    if (newTime > availableFridayEnd) {
                        setAvailableFridayEnd(newTime);
                    }
                    setAvailableFridayStart(newTime);
                }} />
                <span> to </span>
                <TimeSelect disabled={props.disabled} value={availableFridayEnd} minValue={availableFridayStart} onChange={newTime => {
                    if (newTime < availableFridayStart) {
                        setAvailableFridayStart(newTime);
                    }
                    setAvailableFridayEnd(newTime);
                }} />
            </>}
            <br/>

            <Checkbox
                label={'Sat'}
                disabled={props.disabled}
                backgroundColor={props.checkboxColor}
                checked={availableSaturday}
                onChange={checked => setAvailableSaturday(checked)}
            />
            {availableSaturday && <>
                <TimeSelect disabled={props.disabled} value={availableSaturdayStart} onChange={newTime => {
                    if (newTime > availableSaturdayEnd) {
                        setAvailableSaturdayEnd(newTime);
                    }
                    setAvailableSaturdayStart(newTime);
                }} />
                <span> to </span>
                <TimeSelect disabled={props.disabled} value={availableSaturdayEnd} minValue={availableSaturdayStart} onChange={newTime => {
                    if (newTime < availableSaturdayStart) {
                        setAvailableSaturdayStart(newTime);
                    }
                    setAvailableSaturdayEnd(newTime);
                }} />
            </>}
        </div>
    );
};

AvailabilityFields.defaultProps = defaultProps;
