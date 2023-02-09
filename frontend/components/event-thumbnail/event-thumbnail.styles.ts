import Colors from "styles/colors";
import {createUseStyles} from "react-jss";

export const eventThumbnailStyles = {
    container: {
        backgroundColor: Colors.offWhite,
        borderRadius: 5,
        overflow: 'hidden',
        boxShadow: Colors.defaultShadow,
        marginTop: 20,
        marginBottom: 20,
    },
    bodyWrapper: {
        display: 'grid',
        gridTemplateColumns: '120px 1fr'
    },
    image: {
        width: 120,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    },
    body: {
        padding: 20
    },
    date: {
        margin: '0',
    },
    time: {
        color: Colors.lightBlue,
        fontWeight: 'bold',
        margin: 0,
        marginBottom: '0 !important',
    },
    footer: {
        backgroundColor: Colors.mediumBlue,
        color: '#fff',
        padding: 10,
        display: 'grid',
        gridTemplateColumns: '1fr auto'
    },
    button: {
        padding: '5px 12px'
    }
}

export const useEventThumbnailStyles = createUseStyles(eventThumbnailStyles);
