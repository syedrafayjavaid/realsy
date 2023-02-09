import Colors from "styles/colors";
import Fonts from "styles/fonts";
import {createUseStyles} from "react-jss";

/**
 * Account sidebar styles
 */
export const accountSidebarStyles = {
    accountSidebar: {
        backgroundColor: Colors.offWhite,
        boxShadow: Colors.defaultShadow,

        '& .profile-snapshot': {
            backgroundColor: Colors.mediumBlue,
            color: '#fff',
            textAlign: 'center',
            paddingTop: 20,
            paddingLeft: 15,
            paddingRight: 15,
            wordBreak: 'break-all',

            '& img': {},

            '& h1': {
                color: '#fff',
                fontSize: 32,
                fontWeight: 'bold',
                margin: '7px 0 -2px',
                padding: 0,
                '& a': {
                    textDecoration: 'none'
                }
            },

            '& p': {
                margin: '2px 0 0',
                paddingBottom: 20,
            },
            '& a': {
                color: '#fff'
            }
        },

        '& ul': {
            padding: 0,
            margin: 0,

            '& li': {
                listStyle: 'none',
                borderBottom: '1px solid #ccc',

                '&:last-of-type': {
                    border: 'none',
                },

                '& a': {
                    display: 'block',
                    color: '#717161',
                    fontSize: '22px',
                    padding: '12px 25px 18px',
                    textDecoration: 'none',
                    fontFamily: Fonts.mainSerifFont,
                    transition: Colors.defaultTransitionTime,

                    '&:hover': {
                        backgroundColor: Colors.yellow,
                        color: '#fff',

                        '& svg': {
                            fill: '#fff',

                            '&.dashboard-icon, &.heart-icon': {
                                stroke: '#fff',
                                fill: 'none'
                            }
                        }
                    },

                    '& svg': {
                        fill: Colors.yellow,
                        marginTop: 8,
                        marginBottom: -8,
                        marginRight: 10,
                        height: 30,
                        width: 'auto',

                        '&.dashboard-icon, &.heart-icon': {
                            stroke: Colors.yellow,
                            fill: 'none'
                        }
                    },

                    '@media (max-width: 760px)': {
                        fontSize: '17px'
                    },
                },

                '&.active': {
                    backgroundColor: Colors.yellow,
                    '& a': {
                        color: '#fff',
                        '& svg': {
                            fill: '#fff !important',
                            '&.dashboard-icon, &.heart-icon': {
                                stroke: '#fff !important',
                                fill: 'none !important'
                            }
                        }
                    }
                },
            },
        },

        '@media (max-width: 600px)': {
            display: 'none'
        },
    },

    userPhoto: {
        borderRadius: '50%',
        border: '2px solid #fff',
        backgroundColor: '#fff',
        width: 95,
        height: 95,
        margin: '0 auto 0',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    },

    notification: {
        float: 'right',
        fontSize: 16,
        color: '#fff',
        backgroundColor: Colors.pink,
        borderRadius: 10,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        marginRight: -25,
        marginTop: -34,
        padding: '7px 18px 7px 20px',
    },
};

export const useAccountSidebarStyles = createUseStyles(accountSidebarStyles);
