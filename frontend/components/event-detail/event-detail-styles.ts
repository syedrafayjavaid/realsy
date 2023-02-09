import {createUseStyles} from "react-jss";
import Fonts from "styles/fonts";
import Colors from "styles/colors";

export const eventDetailStyles = {
    container: {
        padding: '15px 40px 30px'
    },
    heading: {
        borderBottom: '1px solid #999',
        ...Fonts.defaultHeading,
        fontSize: '36px',
        color: Colors.mediumBlue
    },
    time: {
        display: 'inline-block',
        marginLeft: 20,
        fontWeight: 'bold',
        fontSize: '16px',
        fontFamily: Fonts.mainSansFont,
        color: Colors.lightBlue
    }
};

export const useEventDetailStyles = createUseStyles(eventDetailStyles);
