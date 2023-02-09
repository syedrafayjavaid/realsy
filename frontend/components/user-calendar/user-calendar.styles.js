import Colors from "styles/colors";
import Fonts from "styles/fonts";
import {createUseStyles} from "react-jss";

export const userCalendarStyles = {
    wrapper: { },
    calendar: {
        backgroundColor: Colors.offWhite,
        padding: 16,
        boxShadow: Colors.defaultShadow,
        marginBottom: 30,

        // every "piece" of the calendar is a button
        '& button': {
            background: 'none',
            border: 'none',
            outline: 'none',
        },

        // the current month label
        '& .react-calendar__navigation__label': {
            fontFamily: Fonts.mainSerifFont,
            fontSize: '32px',
            color: Colors.mediumBlue,
            width: 'auto',
            cursor: 'pointer'
        },

        // the previous/next month arrows
        '& .react-calendar__navigation__arrow': {
            fontSize: '64px',
            color: Colors.yellow,
            cursor: 'pointer',
        },

        // the weekday labels
        '& .react-calendar__month-view__weekdays': {
            borderBottom: '1px solid #444',
                color: '#aaa',
                textAlign: 'center',
                padding: 10,
                '& abbr': {
                textDecoration: 'none'
            }
        },

        // the "day" buttons
        '& .react-calendar__month-view__days__day': {
            boxSizing: 'border-box',
            paddingTop: 20,
            paddingBottom: 20,
            color: '#444',
            '&:focus': {
                outline: 'none'
            },
            '.condensed &': {
                paddingTop: 10,
                paddingBottom: 10,
            }
        },

        // the "today" date
        '& .react-calendar__tile--now': {
            '& abbr': {
                backgroundColor: Colors.yellow,
                width: 35,
                height: 35,
                borderRadius: '50%',
                display: 'inline-block'
            }
        },

        // "neighbouring month" days (in view, but outside of current month)
        '& .react-calendar__month-view__days__day--neighboringMonth': {
            color: '#ccc'
        }
    },
    sidebar: {},

    calendarEventDotContainer: {
        position: 'relative',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        cursor: 'pointer',
    },

    calendarEventDot: {
        width: 10,
        height: 10,
        backgroundColor: Colors.pink,
        borderRadius: '50%',
        cursor: 'pointer',
        textAlign: 'center',
        top: -26,
        right: '15%',
        position: 'absolute',
        zIndex: 99,
    },

    filterSelect: {
        marginBottom: 20,
    },

    '@media (min-width: 1100px)': {
        wrapper: {
            '&.with-sidebar': {
                display: 'grid',
                gridTemplateColumns: '65% 35%',
            }
        },
        calendar: {
            padding: 40,

            // the "day" buttons
            '& .react-calendar__month-view__days__day': {
                paddingTop: 30,
                paddingBottom: 30,

                '.condensed &': {
                    paddingTop: 15,
                    paddingBottom: 15,
                }
            },

            // the "today" date
            '& .react-calendar__tile--now': {
                '& abbr': {
                    padding: 10,
                }
            },
        },
        sidebar: {
            paddingLeft: 30,
        }
    }
}

export const useUserCalendarStyles = createUseStyles(userCalendarStyles);
