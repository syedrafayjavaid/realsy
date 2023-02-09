import Fonts from "styles/fonts";
import {createUseStyles} from "react-jss";

export const availabilityFieldsStyles = {
    availabilityFields: {
        lineHeight: '2.4em',

        '& label': {
            display: 'inline-block',
            marginTop: -8,
            width: 80,
            fontFamily: Fonts.mainSansFont,
            fontWeight: 'normal',
            color: '#666',
        },
    }
}

export const useAvailabilityFieldsStyles = createUseStyles(availabilityFieldsStyles);
