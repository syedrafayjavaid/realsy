import * as React from 'react';
import PropTypes from 'prop-types';
import {useState} from 'react';
import CalendarView from 'react-calendar/dist/entry.nostyle';
import {Loader} from 'components/loader';
import {useEffect} from "react";
import {Button} from "components/button";
import Calendar from "api/calendar";
import {useAuthContext} from "api/auth/auth-context";
import {EventThumbnail} from "components/event-thumbnail";
import {EventDetail} from "components/event-detail";
import {useUserCalendarStyles} from './user-calendar.styles';
import {Modal} from "components/modal";

/**
 * A calendar (and optional sidebar) of a user's scheduled events
 */
const UserCalendar = (props) => {
    const authContext = useAuthContext();
    const styleClasses = useUserCalendarStyles();
    const [isLoadingCalendarEvents, setIsLoadingCalendarEvents] = useState(true);
    const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(true);
    const [isLoadingPendingEvents, setIsLoadingPendingEvents] = useState(false);
    const [events, setEvents] = useState([]);
    const [pendingEvents, setPendingEvents] = useState([]);
    const [eventDetailShown, setEventDetailShown] = useState(null);

    useEffect(() => {
        loadEvents();
    }, []);

    async function loadEvents() {
        setIsLoadingUpcoming(true);
        const earliestDate = new Date();
        const latestDate = new Date();
        latestDate.setDate(latestDate.getDate() + 90);

        const upcomingEventsResult = await Calendar.getScheduledEvents(
            authContext.apiToken,
            earliestDate,
            latestDate,
        );
        setEvents(upcomingEventsResult.events);

        setIsLoadingUpcoming(false);

        setIsLoadingPendingEvents(true);
        const pendingEventsResult = await Calendar.getPendingVisitRequests(authContext.apiToken);
        setPendingEvents(pendingEventsResult.visitRequests);

        setIsLoadingPendingEvents(false);
    }

    function firstEventForDate(date) {
        const filteredEvents = events.filter(event => {
            return new Date(event.datetime).toLocaleDateString() === date.toLocaleDateString()
        });
        return filteredEvents.length > 0 && filteredEvents[0];
    }

    function showEventForDate(date) {
        const event = firstEventForDate(date);
        if (event) {
            setEventDetailShown(event);
        }
    }

    return <>
        {eventDetailShown &&
            <Modal
                onClose={() => setEventDetailShown(null)}
            >
                <EventDetail event={eventDetailShown}/>
            </Modal>
        }

        <div className={`${styleClasses.wrapper} ${props.showSidebar ? 'with-sidebar' : ''} ${props.condensed ? 'condensed' : ''}`}>
            <CalendarView
                className={styleClasses.calendar}
                onActiveDateChange={param => console.log(param)} // should load events for new date range
                tileContent={(param) => {
                    const event = firstEventForDate(param.date);
                    return event
                        ? (
                            <div className={styleClasses.calendarEventDotContainer}>
                                <div
                                    className={styleClasses.calendarEventDot}
                                    onClick={() => showEventForDate(param.date)}
                                />
                            </div>
                        )
                        : <></>
                }}
                onClickDay={(p1, p2) => console.log(p1, p2)}
                onChange={(date) => showEventForDate(date)} // actually a "show date" option for our use
            />

            {props.showSidebar &&
                <div className={styleClasses.sidebar}>
                    <h4>Upcoming Events</h4>
                    {isLoadingUpcoming &&
                        <Loader/>
                    }
                    {!isLoadingUpcoming &&
                        <>
                            {events.length === 0 &&
                                <p>Nothing yet!</p>
                            }

                            {events.length > 0 &&
                                <>
                                    {events.map(event => <EventThumbnail event={event}/>)}
                                </>
                            }

                            <p>
                                <Button
                                    href={'/account/profile'}
                                    children={'Adjust my Availability'}
                                />
                            </p>
                        </>
                    }

                    {pendingEvents.length > 0 &&
                        <>
                            <h4 style={{marginTop: 50}}>
                                Pending Events
                            </h4>
                            <p style={{fontSize: 14, marginTop: -15}}>
                                We will be reaching out to you to schedule these events.
                            </p>
                            <ul style={{marginTop: -20, paddingLeft: 20}}>
                                {pendingEvents.map(event =>
                                    <li key={event.id} style={{fontSize: 15}}>
                                        {event.listing?.address} visit request
                                    </li>
                                )}
                            </ul>
                        </>
                    }
                </div>
            }
        </div>
    </>;
};

UserCalendar.propTypes = {
    showSidebar: PropTypes.bool.isRequired,
    condensed: PropTypes.bool.isRequired,
};

UserCalendar.defaultProps = {
    showSidebar: true,
    condensed: false
};

export default UserCalendar;
