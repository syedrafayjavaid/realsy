import Colors from 'styles/colors';
import Fonts from 'styles/fonts';
import {createUseStyles} from "react-jss";
import Dimensions from "styles/dimensions";

/**
 * Styles for offer creation form
 */
export const rawStyles = {
    form: {
        backgroundColor: Colors.offWhite,
        boxShadow: Colors.defaultShadow,
        borderRadius: 5,
        margin: '20px 0',

        '& input, & textarea': {
            backgroundColor: '#fff',
            marginBottom: 25
        },

        '& label, & legend': {
            fontSize: '18px'
        },

        '& fieldset': {
            '& label': {
                fontFamily: Fonts.mainSansFont,
                fontWeight: 'normal',
                fontSize: '15px'
            },
            '& input': {
                marginBottom: 8
            }
        }
    },

    userGuide: {
        color: '#fff',
        backgroundColor: Colors.mediumBlue,
        padding: `12px ${Dimensions.defaultPageMargin}`,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        '& *': {
            color: '#fff'
        }
    },

    mainInputs: {
        padding: `20px 20px 0`,
        lineHeight: '1.8em',

        '& label': {
            color: '#666',
        },

    },

    pagerControls: {
        padding: 20,
        '& button': {
            marginRight: 15,
        },
    },
}

export const useStyles = createUseStyles(rawStyles);
