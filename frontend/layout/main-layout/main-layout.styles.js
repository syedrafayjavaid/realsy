import Colors from "styles/colors";
import Fonts from "styles/fonts";
import Dimensions from "styles/dimensions";
import Forms from 'styles/forms';
import Notifications from "styles/notifications";
import React from "react";
import {createUseStyles} from "react-jss";

export const mainLayoutStyles = {
    '@global': {
        html: {
            height: '100%',
        },

        body: {
            backgroundColor: '#fff',
            color: Colors.mainTextColor,
            fontFamily: Fonts.mainSansFont,
            fontSize: '16px',
            height: '100%',
        },

        a: {
            color: Colors.mediumBlue,
            transition: 'color 300ms',
            '&:hover': {
                color: Colors.lightBlue
            }
        },

        '#__next': {
            minHeight: '100%',
            display: 'grid',
            gridTemplateRows: 'auto 1fr auto',
        },

        '*, *::before, *::after': {
            '-webkit-box-sizing': 'inherit',
            '-moz-box-sizing': 'inherit',
            boxSizing: 'inherit',
        },

        label: { ...Forms.defaultLabel },
        input: { ...Forms.defaultInput },
        select: { ...Forms.defaultSelect },
        textarea: { ...Forms.defaultTextArea, },
        fieldset: { ...Forms.defaultFieldset },

        '.notification-container': {
            zIndex: '999999999 !important',
        },

        '.error-message': {
            ...Notifications.errorMessage
        },

        '.info-message': {
            ...Notifications.infoMessage
        },

        '.popup-content': {
            borderRadius: '5px',
            overflow: 'hidden',
            overflowY: 'scroll',
            maxHeight: '92%',
            maxWidth: '95%',
            zIndex: '999999',
        },

        '.user-guide-boxes-wrapper': {
            marginTop: -70
        },

        // react-tagsinput styles
        '.react-tagsinput': {
            backgroundColor: '#fff',
            border: '1px solid #aaa',
            borderRadius: 5,
            overflow: 'hidden',
            paddingLeft: 10,
            paddingTop: 10,
        },
        '.react-tagsinput--focused': {
        },
        '.react-tagsinput-tag': {
            backgroundColor: Colors.lightBlue,
            borderRadius: 5,
            border: 'none',
            color: '#fff',
            display: 'inline-block',
            fontFamily: Fonts.mainSansFont,
            fontSize: '14px',
            fontWeight: 400,
            marginBottom: 5,
            marginRight: 5,
            padding: '2px 6px',
        },
        '.react-tagsinput-remove': {
            cursor: 'pointer',
            fontWeight: 'bold',
        },
        '.react-tagsinput-tag a::before': {
            content: " ×",
        },
        '.react-tagsinput-input': {
            background: 'transparent',
            border: 0,
            color: '#777',
            fontFamily: 'sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            marginBottom: 6,
            marginTop: 1,
            outline: 'none',
            padding: 5,
            width: 100,
        },

        [`@media (min-width: ${Dimensions.breakpointMedium})`]: {
            '.user-guide-boxes-wrapper': {
                display: 'grid',
                gridTemplateColumns: '1fr 1fr'
            }
        },
    },
    [`@media (max-width: ${Dimensions.breakpointSmall})`]: {
        '@global': {
            '.popup-content': {
                width: '92% !important'
            },
        }
    },
    mainContent: {
        zIndex: 1,

        '& h1, h2, h3, h4, h5, h6': {
            fontFamily: Fonts.mainSerifFont,
            color: Colors.mediumBlue,
        },
        '& h1': {
            fontSize: '32px',
        },
        '& h2': {
            fontSize: '24px',
        },
        '& h3': {
            fontSize: '20px'
        },
        '& h4': {
            fontSize: '16px'
        },

        '& hr': {
            margin: '40px 0'
        },

        '& .cms-text': {
            padding: `10px ${Dimensions.defaultPageMargin} 40px`,
            lineHeight: '150%'
        }
    },
    [`@media (min-width: ${Dimensions.breakpointMedium})`]: {
        mainContent: {
            '& h1': {
                fontSize: '42px',
            },
            '& h2': {
                fontSize: '35px',
            },
            '& h3': {
                fontSize: '22px'
            },
            '& h4': {
                fontSize: '18px'
            },
        }
    },
}

export const useMainLayoutStyles = createUseStyles(mainLayoutStyles);
