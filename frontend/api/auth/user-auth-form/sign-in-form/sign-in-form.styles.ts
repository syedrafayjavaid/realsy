import Colors from "styles/colors";
import {createUseStyles} from "react-jss";

export const signInFormStyles = {
    forgotPassword: {
        '& span': {
            cursor: 'pointer',
            color: Colors.mediumBlue,
            transition: `color ${Colors.defaultTransitionTime}`,
            '&:hover': {
                color: Colors.lightBlue
            }
        }
    },

    forgotPasswordBody: {
        maxHeight: 0,
        overflow: 'hidden',
        transition: 'max-height 500ms',
        '&.shown': {
            maxHeight: '100vh'
        }
    },
};

export const useSignInFormStyles = createUseStyles(signInFormStyles);
