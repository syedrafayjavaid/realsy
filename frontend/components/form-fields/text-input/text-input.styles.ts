import Fonts from "styles/fonts";
import Colors from "styles/colors";
import {createUseStyles} from "react-jss";

export const textInputStyles = {
    input: {
        padding: 15,
        marginBottom: 15,
        fontFamily: Fonts.mainSansFont,
        fontSize: 14,
        width: '100%',
        border: `1px solid ${Colors.defaultInputBorderColor}`,
        borderRadius: 5,
        boxSizing: 'border-box',
        backgroundColor: Colors.offWhite,
        outline: 0,

        '&[disabled]': {
            color: '#aaa'
        },
    },

    label: {
        display: 'inline',
        fontFamily: Fonts.mainSerifFont,
        fontWeight: 'bold',
    }
};

export const useTextInputStyles = createUseStyles(textInputStyles);
