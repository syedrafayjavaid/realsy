import {createUseStyles} from "react-jss";

export const mobileFiltersFormStyles = {
    mobileFiltersForm: {
        padding: '20px 30px 30px',
        width: '95%',
        maxWidth: 500,
        boxSizing: 'border-box',
    },

    doneButton: {
        width: '100%',
        boxSizing: 'border-box',
        marginTop: 20,
    },
}

export const useMobileFiltersFormStyles = createUseStyles(mobileFiltersFormStyles);
