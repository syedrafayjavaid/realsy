import {createUseStyles} from "react-jss";
import Colors from "styles/colors";
import Fonts from "styles/fonts";
import {RadioButtonProps} from "components/form-fields/radio-button-group/radio-button/radio-button";

export const radioButtonStyles = {
    radioButton: {
        display: 'inline',
        fontFamily: Fonts.mainSansFont,
        fontWeight: 'normal',
        fontSize: '14px',
        cursor: 'pointer',

        '& input': {
            position: 'absolute',
            opacity: 0,
            cursor: 'pointer',
            height: 0,
            width: 0,
        }
    },

    checkIndicator: {
        display: 'inline-block',
        position: 'relative',
        top: 5,
        boxSizing: 'border-box',
        height: 22,
        width: 22,
        marginRight: 6,
        backgroundColor: (props: RadioButtonProps) => props.buttonBackgroundColor,
        border: `1px solid ${Colors.defaultInputBorderColor}`,
        borderRadius: '50%',

        '&:after': {
            position: 'absolute',
            top: 3,
            left: 3,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: (props: RadioButtonProps) => props.buttonColor,
            display: 'block',
            opacity: 0,
            content: '""',
            transition: '200ms',
        },

        'input:checked ~ &:after': {
            opacity: 1,
        }
    }
};

export const useRadioButtonStyles = createUseStyles(radioButtonStyles);
