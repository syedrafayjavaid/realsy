import Colors from "styles/colors";
import Fonts from 'styles/fonts';
import {createUseStyles} from "react-jss";

export const offerThumbnailStyles = {
    container: {
        borderRadius: 5,
        overflow: 'hidden',
        boxShadow: Colors.defaultShadow,
        backgroundColor: Colors.offWhite,
        margin: '20px 0 20px',

        '&.blue': {
            backgroundColor: Colors.mediumBlue
        },
    },
    status: {
        float: 'right',
        backgroundColor: props => {
            if (props.offer.status === 'pending_lister') return Colors.pink;
            else if (props.offer.status === 'countered') return Colors.yellow;
            else if (props.offer.status === 'accepted') return Colors.successGreen;
            else if (props.offer.status === 'declined') return '#ccc';
        },
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
        marginTop: -2,
        padding: '4px 10px',
        borderRadius: '0 0 0 5px',
    },
    bodyWrapper: {
        display: 'grid',
        gridTemplateColumns: '125px 1fr'
    },
    userImage: {
        width: 120,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
    },
    mainBody: {
        padding: '30px 10px'
    },
    date: {
        marginBottom: 0,
        '.blue &': {
            color: '#ccc',
        }
    },
    amount: {
        marginTop: -30,
        color: Colors.mediumBlue,
        fontFamily: Fonts.mainSerifFont,
        fontSize: '34px',
        fontWeight: 'bold',
        '.blue &': {
            color: '#fff',
        }
    },
    footer: {
        backgroundColor: Colors.mediumBlue,
        color: '#fff',
        padding: '5px 10px',
        overflow: 'hidden',
        display: 'grid',
        alignItems: 'center',
        gridTemplateColumns: '1fr 170px',
        '.blue &': {
            backgroundColor: Colors.darkBlue
        }
    },
    button: {
        padding: '5px 0'
    }
};

export const useOfferThumbnailStyles = createUseStyles(offerThumbnailStyles);
