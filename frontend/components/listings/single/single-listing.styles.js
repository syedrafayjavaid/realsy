import Colors from 'styles/colors';
import Fonts from 'styles/fonts';
import {createUseStyles} from "react-jss";

export const singleListingStyles = {
    singleListing: {
        maxWidth: 1900,
        boxSizing: 'border-box',
        '& .hide-mobile': {
            display: 'none'
        }
    },

    wrapper: {
        margin: '30px 20px 20px',
        borderRadius: 5,
        overflow: 'hidden'
    },

    mobileTabMenu: {
        marginTop: 20,
        marginBottom: '10px !important',
    },

    details: {
        ...Fonts.bodyDefaults
    },

    activeSection: {
        ...Fonts.bodyDefaults,
        '& h2': {
            fontFamily: Fonts.mainSerifFont,
            fontSize: 20,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 9,
            '@media (min-width: 800px)': {
                fontSize: 28,
            }
        }
    },

    listingSummary: {
        backgroundColor: Colors.offWhite,
        borderRadius: 5,
        overflow: 'hidden',
        boxShadow: Colors.defaultShadow,
    },

    activeImage: {
        width: '100%',
    },

    detailsNav: {
        display: 'none',
    },

    thumbnails: {
        margin: '18px 0',
        height: 80,
        overflowX: 'scroll'
    },

    thumbnail: {
        cursor: 'pointer',
        height: '100%',
        width: 'auto',
        marginRight: 10
    },

    toDoList: {
        backgroundColor: Colors.mediumBlue,
        color: '#fff',
        padding: '10px 30px 20px',
        '& h2': {
            fontFamily: Fonts.mainSerifFont,
        },
        '& label': {
            color: Colors.yellow,
        }
    },

    toDoChecks: { },

    '@media (min-width: 1024px)': {
        singleListing: {
            '& .hide-mobile': {
                display: 'initial'
            }
        },
        mobileTabMenu: {
            display: 'none',
        },
        wrapper: {
            display: 'grid',
            gridTemplateColumns: '60% 40%',
            gridGap: 40,
            paddingRight: 90,
        },

        detailsNav: {
            display: 'block',
            listStyle: 'none',
            borderBottom: '1px solid #aaa',
            margin: 0,
            padding: 0,
            paddingTop: 10,
            whiteSpace: 'nowrap',
            overflowX: 'auto',

            '& li': {
                cursor: 'pointer',
                padding: 10,
                color: '#aaa',
                display: 'inline-block',
                fontWeight: 'bold',
                fontFamily: Fonts.mainSerifFont,

                '&.active': {
                    fontWeight: 'bold',
                    color: Colors.mediumBlue,
                    borderBottom: `1px solid ${Colors.mediumBlue}`
                }
            }
        },

        toDoChecks: {
            display: 'grid',
            gridTemplateColumns: '200px 200px 200px',
            gridTemplateRows: 'auto auto'
        },
    },

    userControls: {
        paddingTop: 20,
        '& button': {
            marginBottom: 10,
            width: '100%',
        },

        '@media (min-width: 500px)': {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridGap: 10,
        }
    },

    chatSelectLabel: {
        marginBottom: -15,
        marginTop: 12,
        paddingTop: 12,
        '@media (max-width: 1020px)': {
            borderTop: '1px solid #eee',
        },
    }
}

export const useSingleListingStyles = createUseStyles(singleListingStyles);
