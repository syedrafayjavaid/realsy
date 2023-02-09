import Colors from "styles/colors";
import Fonts from "styles/fonts";
import Dimensions from "styles/dimensions";
import {createUseStyles} from "react-jss";

export const mainFooterStyles = {
    mainFooter: {
        backgroundColor: Colors.darkBlue,
        color: Colors.offWhite,
        textAlign: 'left',
        fontFamily: Fonts.mainSansFont,
        fontSize: '18px',

        '& ul': {
            lineHeight: '1.5em',
            listStyle: 'none',
            padding: 0
        },

        '& a': {
            color: Colors.offWhite,
            textDecoration: 'none',
            transition: Colors.defaultTransitionTime,

            '&:hover': {
                color: Colors.yellow,
            }
        },
    },

    logo: {
        fill: Colors.offWhite,
        transition: Colors.defaultTransitionTime,

        '&:hover': {
            fill: Colors.yellow
        }
    },

    links: {
        padding: `40px ${Dimensions.defaultPageMargin} 0`,
    },

    [`@media (min-width: ${Dimensions.breakpointSmall})`]: {
        mainFooter: {
            display: 'grid',
            gridTemplateColumns: 'auto auto',
            alignItems: 'start',
            justifyItems: 'start',
            gridGap: '50px',
            padding: `80px 30px`,

            '& ul': {
                margin: 0,
                padding: 0
            },
        },

        links: {
            padding: 0,
            display: 'grid',
            gridGap: 80,
            gridTemplateColumns: 'auto auto auto',
        }
    },
};

export const useMainFooterStyles = createUseStyles(mainFooterStyles);
