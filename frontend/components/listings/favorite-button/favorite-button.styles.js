import Colors from "styles/colors";
import {createUseStyles} from "react-jss";

const size = 30;

export const favoriteButtonStyles = {
    button: {
        backgroundColor: Colors.darkBlue,
        border: 'none',
        borderRadius: '0 5px 0 5px',
        cursor: 'pointer',
        float: 'right',
        position: 'relative',
        zIndex: 8,
        marginBottom: -size,
        marginLeft: -size,
        height: size,
        width: size,
        boxSizing: 'border-box',
        outline: 'none',
        padding: 0,

        '& svg': {
            fill: '#fff',
            width: '60%',
            margin: '6px auto',
            height: 'auto',
            transition: Colors.defaultTransitionTime
        },

        '&:hover svg': {
            fill: Colors.lightBlue,
        },

        '&.active svg': {
            fill: Colors.pink
        },

        '&[disabled] svg': {
            fill: Colors.mediumGray
        },
    }
};

export const useFavoriteButtonStyles = createUseStyles(favoriteButtonStyles);
