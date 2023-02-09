import Colors from 'styles/colors';
import Fonts from 'styles/fonts';
import {createUseStyles} from "react-jss";

/**
 * Listing Thumbnail styles
 */
export const rawStyles = {
    wrapper: (props) => {
        return {
            maxWidth: props.horizontalLayout ? 'none' : 350
        }
    },

    thumbnailContainer: (props) => {
        const horizontalProps = props.horizontalLayout
            ? {display: 'grid', gridTemplateColumns: '120px auto'}
            : {};

        return {
            borderRadius: 5,
            overflow: 'hidden',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            ...horizontalProps
        };
    },


    imageContainer: (props) => {
        const horizontalProps = props.horizontalLayout
            ? {height: '100%'}
            : {};

        return {
            width: '100%',
            height: 180,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            ...horizontalProps
        }
    },

    status: {
        position: 'relative',
        float: 'right',
        top: -60,
        marginBottom: -60,
        padding: '4px 15px',
        textAlign: 'right',
        color: '#fff',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.4)',
    },

    infoContainer: {
        color: Colors.mediumGray,
        textAlign: 'left',
    },

    mainInfo: {
        padding: 20,

        '& > p': {
            marginBottom: '12px'
        },

        '& img': {
            width: 10,
            height: 'auto'
        }
    },

    askingPrice: {
        color: Colors.mediumBlue,
        fontFamily: Fonts.mainSerifFont,
        fontSize: '32px',
        fontWeight: 'bold',
        margin: 0,
    },

    address: {
        backgroundImage: `url('/icon-location.svg')`,
        backgroundPosition: 'left top',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '12px auto',
        paddingLeft: 18,
        '& p': {
            margin: '5px 0',
        }
    },

    details: {
        display: 'grid',
        gridTemplateColumns: '1fr 0.8fr 1.1fr',
        alignItems: 'center',
        listStyle: 'none',
        backgroundColor: Colors.mediumBlue,
        color: '#fff',
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
            },

            '&:last-of-type': {
                justifySelf: 'end'
            }
        }
    }
};

export const useStyles = createUseStyles(rawStyles);
