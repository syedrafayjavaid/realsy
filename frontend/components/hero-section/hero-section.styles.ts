import Colors from "styles/colors";
import Fonts from 'styles/fonts';
import Dimensions from "styles/dimensions";
import {createUseStyles} from "react-jss";
import {HeroSectionProps} from "components/hero-section/hero-section";

export const heroSectionStyles = {
    heroSection: {
        padding: '0 15px',
        backgroundColor: Colors.darkBlue,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: Fonts.mainSerifFont,
        textAlign: 'center',
        height: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: (props: HeroSectionProps) => `0 ${props.fullWidth === false ? Dimensions.defaultPageMargin : 0}`,

        '& a': {
            fontSize: '20px',
        },
    },

    heading: {
        color: '#fff !important',
        fontSize: '42px !important',
        fontWeight: 'normal',
        marginTop: -20,
        marginBottom: 50
    },

    button: {
        fontSize: 20,
    },

    [`@media (min-width: ${Dimensions.breakpointMedium})`]: {
        heading: {
            fontSize: '52px !important'
        }
    }
};

export const useHeroSectionStyles = createUseStyles(heroSectionStyles);
