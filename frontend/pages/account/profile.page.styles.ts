import Colors from "styles/colors";
import {createUseStyles} from "react-jss";

export const rawStyles = {
    editProfileHeader: {
        textAlign: 'center',
        borderBottom: '1px solid #999',
        padding: '10px 10px',
        marginBottom: 50,

        '& h3': {
            fontSize: '22px',
            fontWeight: 'normal',
        },

        '& p': {
            marginBottom: 30
        }
    },

    editProfileMain: {},

    editPhotoLabel: {
        color: Colors.mediumBlue,
        textDecoration: 'underline',
        cursor: 'pointer',
        textAlign: 'center',

        '& div': {
            width: 190,
            height: 190,
            borderRadius: '50%',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            margin: '0 auto',
        }
    },

    mobilePreApproval: {
        display: 'block',
        borderTop: '1px solid #999',
        margin: '35px 0 -30px',
        paddingBottom: 0,
    },

    desktopPreApproval: {
        display: 'none',
    },

    '@media (min-width: 1000px)': {
        editProfileHeader: {
            border: 'none',
            padding: '30px 0',
        },

        editProfileMain: {
            display: 'grid',
            gridTemplateColumns: '220px 1fr',
            gridGap: 50,
        },

        mobilePreApproval: {
            display: 'none',
        },

        desktopPreApproval: {
            display: 'block',
        },
    }
}

export const useStyles = createUseStyles(rawStyles);
