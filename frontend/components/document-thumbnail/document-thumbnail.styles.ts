import Colors from "styles/colors";
import {createUseStyles} from "react-jss";

export const documentThumbnailStyles = {
    container: {
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: Colors.offWhite,
        boxShadow: Colors.defaultShadow,
        maxWidth: '100%',
        '&.no-float': {
            float: 'none'
        }
    },
    bodyWrapper: {
        display: 'grid',
        gridTemplateColumns: '100px 1fr',
        height: 90,
        overflow: 'hidden',
        '& a': {
            background: 'none',
            textDecoration: 'none',
            color: 'inherit'
        }
    },
    body: {
        '& h3': {
            margin: '15px 0 -15px',
        }
    },
    date: {
        color: Colors.lightBlue,
    },
    imageContainer: {
        width: 90,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    },
    footer: {
        backgroundColor: Colors.mediumBlue,
        color: '#fff',
        padding: 10,
        display: 'grid',
        gridTemplateColumns: '1fr auto',

        '& button': {
            marginRight: 8,
        },
    },
}

export const useDocumentThumbnailStyles = createUseStyles(documentThumbnailStyles);
