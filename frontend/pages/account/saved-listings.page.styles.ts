import {createUseStyles} from "react-jss";

/**
 * Styles for the user's saved listings page
 */
export const savedListingsPagedStyles = {
    thumbnails: {
        display: 'grid',
        gridGap: 20,
        paddingBottom: 30,

        '@media (min-width: 850px)': {
            display: 'grid',
            gridTemplateColumns: '300px 300px',
        },

        '@media (min-width: 1300px)': {
            gridTemplateColumns: '330px 330px 330px',
        }
    },
};

export const useSavedListingsPageStyles = createUseStyles(savedListingsPagedStyles);
