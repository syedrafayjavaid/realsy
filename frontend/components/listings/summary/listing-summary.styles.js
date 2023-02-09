import Colors from 'styles/colors';
import Fonts from 'styles/fonts';
import {createUseStyles} from "react-jss";

export const listingSummaryStyles = {
    listingSummary: {
        color: Colors.mediumGray,
        textAlign: 'left',
        backgroundColor: Colors.offWhite,
        borderRadius: 5,
        overflow: 'hidden',
        boxShadow: Colors.defaultShadow
    },

    mainInfo: {
        padding: 20,
        '& p': {
            margin: 0
        },
        '& img': {
            width: 10,
            height: 'auto'
        }
    },

    askingPrice: {
        color: Colors.mediumBlue,
        fontFamily: Fonts.mainSerifFont,
        fontSize: 32,
        fontWeight: 'bold',
        margin: '0 0 15px !important'
    },

    detailsContainer: {
        backgroundColor: Colors.mediumBlue,
        color: '#fff'
    },

    detailsList: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1.1fr',
        alignItems: 'center',
        listStyle: 'none',
        padding: '10px 20px',
        margin: 0,
        fontSize: '14px',

        '& li': {
            '& img': {
                display: 'inline-block',
                width: 20,
                marginRight: 4,
                height: 'auto'
            },

            '& sup': {
                fontSize: '8px',
                marginLeft: 3
            }
        }
    },

    address: {
        paddingLeft: 15,
        backgroundImage: "url('/icon-location.svg')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '0 5px',
        lineHeight: 1.3,
    },

    listingSummaryHorizontal: {
        display: 'grid',
        gridTemplateColumns: '1fr 160px',
        alignItems: 'center',

        '& $detailsContainer': {
            height: '100%',
        },

        '& $detailsList': {
            height: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gridTemplateRows: '1fr 1fr 1fr',

            '& li': {
                marginBottom: 0
            }
        }
    }
}

export const useListingSummaryStyles = createUseStyles(listingSummaryStyles);
