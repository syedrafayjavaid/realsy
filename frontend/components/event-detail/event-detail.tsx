import React, {FC} from 'react';
import {useEventDetailStyles} from "./event-detail-styles";
import {ScheduledEventDto} from "api/scheduled-events/scheduled-event.dto";

/**
 * A full event detail view
 */

export type EventDetailProps = {
    event: ScheduledEventDto;
};

export const EventDetail: FC<EventDetailProps> = props => {
    const styleClasses = useEventDetailStyles();

    const eventDate = new Date(props.event.datetime ?? '');

    return (
        <div className={styleClasses.container}>
            <h2 className={styleClasses.heading}>
                {props.event.datetime &&
                    <>
                        {eventDate.toLocaleString('default', {month: 'long'})} {eventDate.getDate()}
                        <span className={styleClasses.time}> at {eventDate.toLocaleString('en-US', {hour: 'numeric', hour12: true})}</span>
                    </>
                }
            </h2>
            <div dangerouslySetInnerHTML={{__html: props.event.details ?? ''}}/>
        </div>
    )
};
