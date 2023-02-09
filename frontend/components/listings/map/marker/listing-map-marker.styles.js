import Colors from 'styles/colors';
import Fonts from 'styles/fonts';
import {createUseStyles} from "react-jss";

/**
 * Map marker styles
 */
export const rawStyles = {
    mapMarker: {
        display: 'inline-block',
        height: 18,
        backgroundColor: Colors.pink,
        padding: '4px 10px 8px',
        borderRadius: 8,
        color: '#fff',
        fontFamily: Fonts.mainSerifFont,
        fontSize: '14px',
        position: 'relative',
        zIndex: 8,
        cursor: 'pointer',

        '&:after': {
            content: '""',
            display: 'block',
            width: 12,
            height: 12,
            borderRadius: 2,
            transform: 'rotate(45deg)',
            backgroundColor: Colors.pink,
            position: 'relative',
            left: '35%',
            top: 0,
            zIndex: 0
        }
    }
}

export const useStyles = createUseStyles(rawStyles);
