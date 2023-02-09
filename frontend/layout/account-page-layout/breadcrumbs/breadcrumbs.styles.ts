import Colors from "styles/colors";
import Fonts from "styles/fonts";
import {createUseStyles} from "react-jss";

export const breadcrumbsStyles = {
    breadcrumbs: {
        paddingBottom: 10,
        borderBottom: '1px solid #999',
        color: Colors.mediumBlue,
        fontFamily: Fonts.mainSerifFont,
        fontWeight: 'bold',
        marginBottom: '10px !important',

        '& a': {
            textDecoration: 'none',
            color: '#999',
        },

        '@media (min-width: 1000px)': {
            marginBottom: '40px !important',
        },
    },
}

export const useBreadcrumbStyles = createUseStyles(breadcrumbsStyles);
