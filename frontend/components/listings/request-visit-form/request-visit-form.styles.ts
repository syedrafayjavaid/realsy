import Colors from "styles/colors";
import {createUseStyles} from "react-jss";

/**
 * Styles for the "request visit" user form
 */
export const requestVisitFormStyles = {
    container: {
        borderRadius: 5,
        overflow: 'hidden',
        boxShadow: Colors.defaultShadow,
        backgroundColor: Colors.offWhite
    },
    form: {
        padding: 20,
        '& button': {
            marginTop: 30
        }
    },
}

export const useRequestVisitFormStyles = createUseStyles(requestVisitFormStyles);
