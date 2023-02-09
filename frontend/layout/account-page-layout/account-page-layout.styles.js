import Fonts from "styles/fonts";
import Colors from "styles/colors";
import {createUseStyles} from "react-jss";
import Dimensions from "styles/dimensions";

/**
 * Styles for the account pages layout
 */
export const accountLayoutStyles = {
    accountPage: {
        marginLeft: 16,
        marginRight: 16,
        paddingBottom: 30,
        ...Fonts.bodyDefaults,

        '&.no-padding': {
            padding: 0,
            margin: 0
        },

        '@media (min-width: 600px)': {
            paddingBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            display: 'grid',
            gridTemplateColumns: '250px 1fr',
        },

        '@media (min-width: 760px)': {
            gridTemplateColumns: '300px 1fr'
        }
    },

    main: {
        padding: '15px 0',

        '&.no-padding': {
            padding: 0
        },

        '@media (min-width: 600px)': {
            padding: `30px ${Dimensions.defaultPageMargin}`,
        }
    },
};

export const useAccountLayoutStyles = createUseStyles(accountLayoutStyles);
