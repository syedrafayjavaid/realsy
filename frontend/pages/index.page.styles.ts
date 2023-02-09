import {createUseStyles} from "react-jss";
import Fonts from "styles/fonts";

export const homePageStyles = {
    homePage: {
        ...Fonts.bodyDefaults,
        textAlign: 'center',

        '& .cms-text': {
            textAlign: 'center',
            maxWidth: 750,
            margin: '50px auto 80px'
        }
    },
};

export const useHomePageStyles = createUseStyles(homePageStyles);
