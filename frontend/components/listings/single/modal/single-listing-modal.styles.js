import {createUseStyles} from "react-jss";

export const singleListingModalStyles = {
    container: {
        '@media (min-width: 800px)': {
            width: '95%',
            maxWidth: 1350,
        },
    },
};

export const useSingleListingModalStyles = createUseStyles(singleListingModalStyles);
