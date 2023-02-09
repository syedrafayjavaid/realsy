import Colors from 'styles/colors';
import Fonts from "styles/fonts";
import {createUseStyles} from "react-jss";

export const checkboxStyles = {
    checkbox: {
        display: 'inline-block',
        position: 'relative',
        paddingLeft: 32,
        '-webkit-user-select': 'none',
        '-moz-user-select': 'none',
        '-ms-user-select': 'none',
        userSelect: 'none',
        fontFamily: Fonts.mainSansFont,
        fontSize: '15px',
        fontWeight: 'normal',

        '& .fake-check': {
            position: 'absolute',
            top: '10%',
            left: 0,
            height: '24px !important',
            width: '24px !important',
            borderRadius: 5,
            border: `1px solid ${Colors.defaultInputBorderColor}`,
            transition: '200ms',
            boxSizing: 'border-box',

            '&:after': {
                content: "''",
                position: 'absolute',
                display: 'none',
                backgroundImage: `url('/icon-check.svg')`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                left: 5,
                top: 0,
                width: 12,
                height: 20,
            }
        },
    },

    input: {
        position: 'absolute',
        opacity: 0,
        height: 0,
        width: 0,

        '&:checked': {
            '& ~ .fake-check': {
                backgroundColor: `${Colors.mediumBlue} !important`,
                '&:after': {
                    display: 'block'
                }
            }
        }
    },
}

export const useCheckboxStyles = createUseStyles(checkboxStyles);
