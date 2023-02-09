import React, {FC, useState} from 'react';
import {Button, ButtonVariant} from "components/button";
import {EventDetail} from "components/event-detail";
import Listings from "api/listings";
import {Modal} from "components/modal";
import {useEventThumbnailStyles} from "./event-thumbnail.styles";
import {ScheduledEventDto} from "api/scheduled-events/scheduled-event.dto";
import {pushSoftQueryParams} from "util/push-soft-query-param";
import {useRouter} from "next/router";

/**
 * A short thumbnail view for a scheduled event
 */

export type EventThumbnailProps = {
    event: ScheduledEventDto,
};

export const EventThumbnail: FC<EventThumbnailProps> = (props) => {
    const styleClasses = useEventThumbnailStyles();
    const router = useRouter();
    const [showDetails, setShowDetails] = useState(false);
    const listing = props.event.listing;

    const eventDate = new Date(props.event.datetime ?? '');

    return <>
        {showDetails &&
        <Modal
            onClose={() => setShowDetails(false)}
        >
            <EventDetail event={props.event}/>
        </Modal>
        }
        <div className={styleClasses.container}>
            <div className={styleClasses.bodyWrapper}>
                <div className={styleClasses.image} style={{
                    backgroundImage: `url("${Listings.getListingMainPhotoUrl(props.event.listing?.id || props.event.listing, {format: 'thumbnail'})}")`}}
                />
                <div className={styleClasses.body}>
                    {props.event.datetime &&
                    <>
                        <h3 className={styleClasses.date}>
                            {eventDate.toLocaleString('default', {month: 'long'})}
                            <span> </span>
                            {eventDate.getDate()}
                        </h3>
                        <p className={styleClasses.time}>at {eventDate.toLocaleString('en-US', {
                            hour: 'numeric',
                            hour12: true
                        })}</p>
                        <div dangerouslySetInnerHTML={{__html: props.event.details ?? ''}}/>
                    </>
                    }
                </div>
            </div>
            <div className={styleClasses.footer}>
                {!listing && <span>Location not set</span>}
                {listing &&
                    <span
                        style={{cursor: 'pointer'}}
                        onClick={() => pushSoftQueryParams({viewedListingId: listing.id}, router)}
                    >
                        <img src='/icon-location-yellow.svg'/> {`${listing?.address} ${listing?.city}, ${listing?.state}`}
                    </span>
                }
                <Button
                    className={styleClasses.button}
                    variant={ButtonVariant.White}
                    onClick={() => setShowDetails(true)}
                    children={'See Details'}
                    padding={'0 10px'}
                />
            </div>
        </div>
    </>;
};
