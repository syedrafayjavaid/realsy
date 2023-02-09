import Colors from "styles/colors";
import Fonts from "styles/fonts";
import Dimensions from "styles/dimensions";
import {createUseStyles} from "react-jss";

/**
 * Styles for the main header
 */
export const mainHeaderStyles = {
    headerContainer: {
        zIndex: 2,
        position: 'sticky',
        left: 0,
        top: 0,
    },

    mainHeader: {
        fontFamily: Fonts.mainSerifFont,
        backgroundColor: Colors.offWhite,
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
        width: '100%',
        height: Dimensions.mobileHeaderHeight,
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        alignItems: 'center',
        justifyItems: 'left',

        '& a': {
            marginLeft: 10,
            display: 'block',
            padding: '18px 16px',
            textDecoration: 'none',
        },
    },

    mainLogo: {
        width: 'auto',
        '& svg': {
            height: 25,
            width: 'auto',
            fill: Colors.mediumBlue,
            transition: Colors.defaultTransitionTime
        },
        '&:hover svg': {
            fill: Colors.lightBlue
        },
        '&.nolink:hover svg': {
            fill: Colors.mediumBlue
        }
    },

    mainMenu: {
        '& svg': {
            fill: Colors.yellow,
            marginTop: '8px',
            marginBottom: '-8px',
            marginRight: '10px',
            height: '30px',
            width: 'auto',
        }
    },

    activeMenuItem: {
        backgroundColor: Colors.yellow,
        cursor: 'default',
        '&:hover': {
            backgroundColor: `${Colors.yellow} !important`
        }
    },

    strokedIcon: {
        stroke: Colors.yellow,
        fill: 'none',
    },
    mainMenuButton: {},
    accountMenuItem: {
        cursor: 'pointer',
    },
    accountMenuMobileButton: {},
    accountMenu: {},
    menu: {
        overflowY: 'scroll'
    },
    userPhoto: {},
    notification: {
        backgroundColor: Colors.pink,
        color: '#fff',
        padding: '20px',
        fontFamily: Fonts.mainSerifFont,
        fontSize: '20px',
        fontWeight: 'bold',
        cursor: 'pointer',
        backgroundPosition: '10px center',
        backgroundRepeat: 'no-repeat',
    },
    notificationSubhead: {
        fontFamily: Fonts.mainSansFont,
        fontWeight: 'normal',
        fontSize: '12px',
        display: 'inline-block',
        marginLeft: 20
    },

    /**
     * Small resolution
     */
    [`@media (max-width: 716px)`]: {
        mainMenuButton: {
            '& svg': {
                width: '20px',
                height: '23px',
            }
        },

        accountMenuMobileButton: {
            height: '100%',
            padding: 0,
            width: '70px',
            textAlign: 'center',
            backgroundColor: Colors.mediumBlue,
        },

        menu: {
            paddingBottom: 70,
            overflowY: 'auto',
            overflowX: 'visible',
            paddingTop: Dimensions.mobileHeaderHeight + 20,
            position: 'fixed',
            zIndex: -1,
            top: 0,
            right: -1,
            width: 0,
            height: '100%',
            backgroundColor: '#fff',
            listStyle: 'none',
            padding: 0,
            margin: 0,
            transition: '0.5s',
            transitionTimingFunction: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
            borderLeft: `1px solid ${Colors.lightGray}`,
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',

            '& li': {
                margin: '0 20px',
                padding: 0,
                borderBottom: '1px solid #ccc',
                textAlign: 'left',

                '& a': {
                    textDecoration: 'none',
                    color: Colors.mainTextColor,
                    margin: 0,
                }
            },

            '&.shown': {
                right: 0,
                width: '100%'
            }
        },

        accountMenuItem: {
            borderBottom: 'none !important',
        },

        accountMenu: {
            paddingTop: 82,
        },
    },

    /**
     * Medium and above resolution
     */
    [`@media (min-width: 718px)`]: {
        mainHeader: {
            padding: 0,
            position: 'initial',
        },

        mainMenuButton: {
            display: 'none',
        },

        mainMenu: {
            position: 'initial',
            display: 'block',
            width: 'auto',
            height: 'auto',
            margin: 0,
            justifySelf: 'right',
            paddingLeft: 0,

            '& li': {
                display: 'inline-block',
            },

            '& a': {
                textDecoration: 'none',
                color: '#333',
                fontSize: '24px',
                padding: '24px 30px',
                margin: 0,
                transition: Colors.defaultTransitionTime,

                '&:hover': {
                    backgroundColor: Colors.lightYellow,
                    color: Colors.mediumBlue
                },
            },
        },

        userPhoto: {
            width: '33px',
            height: '33px',
            display: 'inline-block',
            position: 'relative',
            float: 'left',
            top: -2,
            right: 11,
            borderRadius: '50%',
            border: '1px solid #fff',
            backgroundColor: '#fff',
            backgroundPosition: 'center',
            backgroundSize: 'cover',

            '.with-notification &': {
                '&:after': {
                    content: '""',
                    backgroundColor: Colors.pink,
                    display: 'block',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    position: 'relative',
                    left: 23,
                    top: -2
                }
            }
        },

        accountMenuItem: {
            '& a': {
                backgroundImage: `linear-gradient(to right, ${Colors.yellow} 50%, ${Colors.mediumBlue} 50%)`,
                backgroundSize: '200% 100%',
                color: '#fff',
                transition: 'background-position 0.2s ease',
                backgroundPosition: 'right',
                paddingRight: 40,
                paddingLeft: 50,
            },
            '&:hover': {
                '& .account-menu-link': {
                    backgroundPosition: '0 -100%',
                    color: Colors.mediumBlue
                }
            }
        },

        accountMenu: {
            position: 'absolute',
            right: 0,
            backgroundColor: '#fff',
            zIndex: '999',
            listStyle: 'none',
            padding: 0,
            width: '300px',
            margin: 0,
            display: 'block',
            boxShadow: Colors.defaultShadow,
            borderRadius: '0 0 5px 5px',
            overflow: 'hidden',
            transition: '0.5s ease',
            visibility: 'hidden',
            maxHeight: '0',

            '&.shown': {
                visibility: 'visible',
                maxHeight: '100vh'
            },

            '& li': {
                width: '100%',
            },

            '& a': {
                margin: 0,
                padding: '8px 20px 22px',
                fontSize: '16px',
                backgroundImage: 'none',
                color: Colors.mainTextColor,
                transition: Colors.defaultTransitionTime,

                '&:hover': {
                    backgroundColor: Colors.mediumBlue,
                    color: '#fff',
                },

                '& .heart-icon, & .dashboard-icon': {
                    fill: 'none',
                    stroke: Colors.yellow
                }
            }
        },
    }
};

export const useMainHeaderStyles = createUseStyles(mainHeaderStyles);
