import Fonts from "styles/fonts";
import Colors from "styles/colors";
import Color from "color";
import {createUseStyles} from "react-jss";

const sharedStyles = {
    display: 'inline-block',
    lineHeight: '1.4',
    maxHeight: '100%',
    border: 'none',
    borderRadius: '5px',
    fontFamily: Fonts.mainSerifFont,
    textDecoration: 'none',
    transition: 'background-color 300ms',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    '&:disabled': {
        cursor: 'auto'
    },

    '&:focus': {
        outline: 0
    },

    '& svg': {
        width: 'auto',
        marginRight: 10,
        marginLeft: -25,
        display: 'inline',
    },
};

export const buttonStyles = {
    buttonYellow: {
        backgroundColor: Colors.yellow,
        color: '#fff',
        ...sharedStyles,
        '&:hover': {
            color: '#fff',
            backgroundColor: Color(Colors.yellow).darken(0.1).hex(),
            '&:disabled': {
                backgroundColor: Colors.yellow,
            }
        }
    },

    buttonBlue: {
        ...sharedStyles,
        backgroundColor: Colors.mediumBlue,
        color: '#fff',
        '&:hover': {
            color: '#fff',
            backgroundColor: Color(Colors.mediumBlue).lighten(0.2).hex(),
            '&:disabled': {
                backgroundColor: Colors.mediumBlue,
            }
        }
    },

    buttonPink: {
        ...sharedStyles,
        backgroundColor: Colors.pink,
        color: '#fff',
        '&disabled=false]:hover': {
            backgroundColor: Color(Colors.pink).lighten(0.2).hex()
        }
    },

    buttonWhite: {
        ...sharedStyles,
        backgroundColor: Colors.offWhite,
        color: Colors.mediumBlue,
        transition: '200ms',
        '&:hover': {
            color: Colors.lightBlue
        }
    },

    loader: {
        display: 'inline-block',
        width: 15,
        height: 15,
    }
}

export const useButtonStyles = createUseStyles(buttonStyles);
