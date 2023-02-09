import {createUseStyles} from "react-jss";
import Colors from "styles/colors";

export const messagesPageStyles = {
    messagesHeader: {
        maxWidth: '100%',
        marginBottom: -20,
        paddingBottom: 20,
        borderBottom: '1px solid #eee',
    },

    selectContainer: {
        maxWidth: '100%',
        '@media (min-width: 800px)': {
            width: 350
        },
    },

    openListingButton: {
        fontSize: 14,
        cursor: 'pointer',
        color: Colors.mediumBlue,
        border: 'none',
        background: 'none',
        transition: 'color 300ms',
        outline: 'none',

        '&:hover': {
            color: Colors.lightBlue,
        },
    },
};

export const useMessagesPageStyles = createUseStyles(messagesPageStyles);
