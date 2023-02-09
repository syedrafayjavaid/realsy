import {createUseStyles} from "react-jss";
import Colors from "styles/colors";
import Fonts from "styles/fonts";

export const chatLauncherStyles = {
    chatLauncher: {
        zIndex: 2,
        display: 'block',
        position: 'fixed',
        right: '5px',
        margin: 0,
        padding: 0,
        bottom: 0,
        backgroundColor: Colors.yellow,
        color: Colors.mediumBlue,
        cursor: 'pointer',
        fontFamily: Fonts.mainSerifFont,
        fontWeight: 'bold',
        borderRadius: '5px 5px 0 0',
        boxShadow: Colors.defaultShadow,
        overflow: 'hidden',
        height: '32px',

        '& img': {
            backgroundColor: Colors.mediumBlue,
            height: '100%',
            padding: '9px 17px 5px',
            width: 'auto',
            display: 'inline-block',
            boxSizing: 'border-box',
        },

        '& span': {
            height: '100%',
            padding: '12px 22px',
            marginTop: '-5px',
            display: 'block',
            float: 'right',
        },

        '@media (min-width: $breakpointSmall)': {
            right: '20px'
        }
    }
};

export const useChatLauncherStyles = createUseStyles(chatLauncherStyles);
