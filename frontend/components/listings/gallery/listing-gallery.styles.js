import {createUseStyles} from "react-jss";

export const listingGalleryStyles = {
    listingGallery: {
        marginBottom: 20,
    },

    largeImage: {
        width: '100%',
        height: 300,
        backgroundPosition: 'center',
        backgroundSize: 'cover',

        '@media (min-width: 800px)': {
            height: 500,
        }
    },

    status: {
        position: 'relative',
        float: 'right',
        top: -70,
        padding: '8px 25px',
        textAlign: 'right',
        color: '#fff',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.4)',
        marginBottom: -70,
    },
}

export const useListingGalleryStyles = createUseStyles(listingGalleryStyles);
