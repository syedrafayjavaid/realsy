import Colors from "styles/colors";
import Fonts from "styles/fonts";
import Dimensions from "styles/dimensions";
import {createUseStyles} from "react-jss";

export const singleListingPageStyles = {
    breadcrumbs: {
        boxSizing: 'border-box',
        textAlign: 'left !important',
        backgroundColor: Colors.offWhite,
        fontFamily: Fonts.mainSerifFont,
        fontWeight: 'bold',
        color: `${Colors.mediumBlue} !important`,
        padding: `20px 10px`,
        margin: '0 !important',
        width: '100%',
        '& p': {
            margin: '0 !important',
            padding: 0,
            paddingBottom: 6,
            borderBottom: '1px solid #999',
            textAlign: 'left !important'
        },
        '& a': {
            textDecoration: 'none',
            color: '#999',
        }
    },
    steps: {
        textAlign: 'center',
        fontFamily: Fonts.mainSerifFont,
    },
    macroStepsWrapper: {},
    macroStepsListWrapper: {
        padding: `30px ${Dimensions.defaultPageMargin}`,
        backgroundColor: Colors.lightBlue,
        color: '#fff'
    },
    macroSteps: {
        margin: 0,
        padding: 0,
        listStyle: 'none',
    },
    macroStep: {
        filter: 'drop-shadow(0 0 6px #777)',
        cursor: 'pointer',
        transition: 'filter 300ms',
        '&:hover': {
            filter: 'drop-shadow(0 0 6px #555)',
        }
    },
    statusMarker: {
        content: '""',
        display: 'block',
        backgroundColor: '#fff',
        width: '100%',
        height: 40,
        boxShadow: Colors.defaultShadow,
        position: 'relative',
        clipPath: 'polygon(0 0, 15px 50%, 0 100%, calc(100% - 15px) 100%, 100% 50%, calc(100% - 15px) 0)',

        '&.complete': {
            backgroundColor: Colors.darkBlue,
            backgroundImage: "url('/icon-check.svg')",
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '50% 50%'
        },
        '&.current': {
            backgroundColor: Colors.yellow
        },
        '&.first': {
            clipPath: 'polygon(0 0, 0 100%, calc(100% - 15px) 100%, 100% 50%, calc(100% - 15px) 0)',
        },
        '&.last': {
            clipPath: 'polygon(0 0, 15px 50%, 0 100%, 100% 100%, 100% 0)'
        }
    },
    stepNumber: {},
    stepName: {
        display: 'none',
        lineHeight: '1.3',
        marginTop: 8
    },
    microStepsHeading: {
        color: '#fff !important',
        fontWeight: 'bold !important',
        fontSize: '24px !important',
        margin: 0,
        marginTop: -1,
        paddingBottom: 20,
        textAlign: 'left',
        '& svg': {
            fill: '#fff',
            transition: '300ms',
            position: 'relative',
            left: 8,
            top: -4
        },
        '&.active svg': {
            transform: 'rotate(180deg)'
        }
    },
    microSteps: {
        textAlign: 'left',
        maxHeight: 0,
        transition: '300ms',
        overflow: 'hidden',
        color: '#fff',
        paddingBottom: 0,
        '&.shown': {
            maxHeight: '100vh',
            paddingBottom: 30,
        },
        '& span': {
            marginRight: 20,
            marginBottom: 5,
            color: '#ccc',
            display: 'block',
            '&:before': {
                display: 'inline-block',
                content: '""',
                width: 40,
                height: 40,
                marginRight: 15,
                borderBottom: '1px solid #ccc'
            },

            '&.complete': {
                color: '#fff',
                '&:before': {
                    borderColor: '#fff',
                    backgroundImage: 'url("/icon-check-white.svg")',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '20px'
                }
            }
        }
    },
    microStepsWrapper: {
        backgroundColor: Colors.lightBlue,
        padding: `0 ${Dimensions.defaultPageMargin}`
    },
    singleWrapper: {},

    '@media (min-width: 1275px)': {
        steps: {
            display: 'grid',
            gridTemplateColumns: '58% 42%',
            backgroundColor: Colors.offWhite,
            padding: 0,
        },
        step: {
            textAlign: 'center',

        },
        stepNumber: {
            display: 'none',
        },
        stepName: {
            display: 'block',
            color: '#333',
            fontFamily: Fonts.mainSerifFont,
            fontSize: '12px',
        },
        breadCrumbs: {
            padding: 0
        },
        macroStep: {
            filter: 'drop-shadow(0 0 6px #ddd)',
            '&:hover': {
                filter: 'drop-shadow(0 0 6px #ccc)',
            }
        },
        macroStepsWrapper: {
            padding: 40,
        },
        macroStepsListWrapper: {
            backgroundColor: Colors.offWhite,
            padding: 10
        },
        microStepsWrapper: {
            backgroundColor: Colors.lightBlue,
            padding: '30px 60px',
        },
        microStepsHeading: {
            marginLeft: 0,
            '& svg': {display: 'none'}
        },
        microSteps: {
            maxHeight: 'none',
            paddingBottom: 10,
            '& span': {
                margin: 0,
                width: '100%',
            }
        },
        singleWrapper: {
            padding: 20
        }
    }
};

export const useSingleListingPageStyles = createUseStyles(singleListingPageStyles);
