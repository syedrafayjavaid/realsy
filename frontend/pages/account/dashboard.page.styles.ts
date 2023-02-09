import {createUseStyles} from "react-jss";
import Colors from "styles/colors";
import Fonts from "styles/fonts";

export const dashboardPageStyles = {
    alert: {
        width: '100%',
        backgroundColor: Colors.pink,
        color: '#fff',
        padding: '20px 20px 4px',
        boxSizing: 'border-box',
        borderRadius: '0 0 5px 5px',
        marginTop: 0,
        marginBottom: 30,
        maxHeight: '100vh',
        transition: '300ms',
        overflow: 'hidden',
        cursor: 'pointer',

        '&:hover': {
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
            paddingTop: 25,
        },

        '&.hidden': {
            maxHeight: 0,
            padding: 0,
        },
        '& h3': {
            color: '#fff',
            marginBottom: 10,
        },
        '@media (min-width: 750px)': {
            marginTop: -50,
        },

        '& a': {
            '&:hover': {
                fontWeight: 200,
            }
        }
    },

    alertHideButton: {
        float: 'right',
        marginTop: 20,
        color: '#fff',
        textDecoration: 'none',
        fontSize: '22px',
        border: 'none',
        background: 'none',
        outline: 'none',
        cursor: 'pointer',
        transition: 'color 300ms',

        '&:hover': {
            color: Colors.lightBlue,
        },
    },

    userDashboard: {
        maxWidth: '100%',

        '@media (min-width: 1200px)': {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridGap: 30,
        },
    },

    savingsCard: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',

        '& div': {
            padding: 20,
            textAlign: 'center',
            fontFamily: Fonts.mainSerifFont,
            color: Colors.lightBlue,

            '& span': {
                display: 'block',
                padding: '8px 10px',

                '&:first-of-type': {
                    fontSize: 22,
                    borderBottom: `1px solid ${Colors.lightBlue}`,
                },

                '&:nth-of-type(2)': {
                    padding: '18px 10px',
                    fontSize: 48,
                    color: Colors.mediumBlue,
                    borderBottom: `1px solid ${Colors.lightBlue}`,
                },

                '&:nth-of-type(3)': {
                    fontFamily: Fonts.mainSansFont,
                    fontSize: 14,
                },
            },

            '&:nth-of-type(2)': {
                backgroundColor: Colors.lightBlue,
                color: '#fff',

                '& span': {
                    '&:first-of-type': {
                        borderColor: '#fff',
                    },

                    '&:nth-of-type(2)': {
                        color: '#fff',
                        borderColor: '#fff',
                    },
                },
            },
        },
    },
};

export const useDashboardPageStyles = createUseStyles(dashboardPageStyles);
