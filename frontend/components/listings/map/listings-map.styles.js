import Colors from 'styles/colors';
import Fonts from 'styles/fonts';
import Dimensions from "styles/dimensions";
import {createUseStyles} from "react-jss";

const SIDE_BY_SIDE_CUTOFF = '700px';
const DOUBLE_COLUMN_SIDEBAR_CUTOFF = '1200px';

export const listingsMapStyles = {
    listingsMapContainer: {
        display: 'flex',
        flexFlow: 'column nowrap',
        backgroundColor: '#c00',
        height:'100%',
    },

    autoCompleteResults: {
        border: '1px solid #999',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
    },

    mobileMapToggle: {
        position: 'fixed',
        zIndex: 99,
        bottom: 0,
        width: '100%',
        backgroundColor: Colors.darkBlue,
        color: '#fff',
        padding: 20,
        fontFamily: Fonts.mainSerifFont,
        textAlign: 'center',
        boxSizing: 'border-box',

        '& a': {
            padding: 10,
            cursor: 'pointer',
        },

        [`@media (min-width: ${SIDE_BY_SIDE_CUTOFF})`]: {
            display: 'none'
        },
    },

    searchBar: {
        boxSizing: 'border-box',
        paddingLeft: Dimensions.defaultPageMargin,
        paddingRight: Dimensions.defaultPageMargin,
        padding: 16,
        backgroundColor: Colors.darkBlue,
        color: '#fff',
        display: 'flex',
        flexFlow: 'row nowrap',
        position: 'absolute',
        width: '100%',
        zIndex: 10,

        '& select': {
            display: 'none'
        },

        [`@media (min-width: ${SIDE_BY_SIDE_CUTOFF})`]: {
            padding: '12px 22px',
        }
    },

    searchContainer: {
        width: '100%',

        [`@media (min-width: ${SIDE_BY_SIDE_CUTOFF})`]: {
            borderRadius: 5,
            width: 240,
            marginRight: 10,
            overflow: 'hidden',
            display: 'block',
        }
    },

    searchForm: {
        height: 40,
        display: 'flex',
        flexFlow: 'row nowrap',
        borderRadius: 5,
        overflow: 'hidden',

        '& input': {
            border: 'none',
            boxSizing: 'border-box',
            height: 40,
            borderRadius: 0,
            margin: 0,
            backgroundColor: "#fff",
            color: Colors.darkBlue,

            '&::placeholder': {
                color: '#333',
            },

            [`@media (min-width: ${SIDE_BY_SIDE_CUTOFF})`]: {
                fontSize: 14,
            },
        },

        '& button': {
            width: 50,
            height: 40,
            border: 'none',
            borderRadius: '0 5px 5px 0',
            backgroundColor: Colors.yellow,
            backgroundImage: "url('/icon-search.svg')",
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        },

        [`@media (min-width: ${SIDE_BY_SIDE_CUTOFF})`]: {
            borderRadius: 5,
            overflow: 'hidden',
            height: 40,
        }
    },

    searchInput: {
        width: '100%',
    },

    sortControlsContainer: {
        listStyle: 'none',
        boxShadow: Colors.defaultShadow,
        marginBottom: 0,
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',
        margin: 0,
        padding: `10px ${Dimensions.defaultPageMargin}`,

        '& li': {
            '&.sort-control-filters': {
                visibility: 'visible',

                '&:before': {
                    display: 'none'
                }
            },
        },

        [`@media (min-width: ${SIDE_BY_SIDE_CUTOFF})`]: {
            listStyle: 'none',
            borderBottom: '1px solid #333',
            padding: `20px ${Dimensions.defaultPageMargin}`,
            position: 'fixed',
            boxSizing: 'border-box',
            width: 340,
            zIndex: 2,
            backgroundColor: '#fff',
        },

        [`@media (min-width: ${DOUBLE_COLUMN_SIDEBAR_CUTOFF})`]: {
            justifyContent: 'start',
            width: 580
        }
    },

    sortControl: {
        visibility: 'hidden',
        display: 'flex',
        flexFlow: 'row nowrap',

        '&:before': {
            visibility: 'visible',
            display: 'block',
            content: '""',
            marginRight: 8,
            width: 18,
            height: 18,
            backgroundColor: Colors.mediumBlue,
            '-webkit-mask-size': '100% 100%',
            maskSize: '100% 100%'
        },

        '&.askingPrice:before': {
            '-webkit-mask-image': "url('/icon-money.svg')",
            maskImage: "url('/icon-money.svg')",
        },

        '&.bedroomCount:before': {
            '-webkit-mask-image': "url('/icon-bedroom.svg')",
            maskImage: "url('/icon-bedroom.svg')",
        },

        '&.squareFootage:before': {
            '-webkit-mask-image': "url('/icon-footage.svg')",
            maskImage: "url('/icon-footage.svg')",
        },

        [`@media (min-width: ${SIDE_BY_SIDE_CUTOFF})`]: {
            visibility: 'visible',
            color: Colors.darkBlue,
            fontFamily: Fonts.mainSerifFont,
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '12px',
            marginRight: 10,

            '&:before': {
                display: 'none !important'
            }
        },

        [`@media (min-width: ${DOUBLE_COLUMN_SIDEBAR_CUTOFF})`]: {
            fontSize: '16px',
        }
    },

    sortText: {
        display: 'none',
        [`@media (min-width: ${SIDE_BY_SIDE_CUTOFF})`]: {
            display: 'inline',
            marginRight: 8,
            float: 'left'
        }
    },

    sortArrows: {
        width: 20,
        display: 'flex',
        flexFlow: 'column nowrap',

        '& svg': {
            fill: Colors.lightBlue,
            opacity: 0.3,
            visibility: 'visible',

            '&:first-of-type': {
                marginBottom: 4,
            },

            '&.active': {
                opacity: 1.0,
            }
        },
    },

    fullResolutionPriceFilters: {
        display: 'grid',
        gridTemplateColumns: '140px 140px 95px 135px',
        gridGap: 10,

        [`@media (max-width: 840px)`]: {
            display: 'none'
        }
    },

    fullResolutionPriceFilter: {
    },

    filterButton: {
        padding: '2px 5px',
        border: 'none',
        [`@media (min-width: 840px)`]: {
            display: 'none'
        },
        [`@media (max-width: ${SIDE_BY_SIDE_CUTOFF})`]: {
            padding: '5px 15px',
        },
    },

    listingsMapBody: {
        flexGrow: 1,
        backgroundColor: '#fff',
        overflow: 'scroll',
        display: 'grid',

        [`@media (min-width: ${SIDE_BY_SIDE_CUTOFF})`]: {
            width: '100%',
            gridTemplateColumns: '340px 1fr',
        },

        [`@media (min-width: ${DOUBLE_COLUMN_SIDEBAR_CUTOFF})`]: {
            gridTemplateColumns: '580px 1fr',
        }
    },

    sidebar: {
        display: 'flex',
        flexFlow: 'column nowrap',

        [`@media (min-width: ${SIDE_BY_SIDE_CUTOFF})`]: {
            overflowX: 'hidden'
        },
    },

    thumbnails: {
        paddingLeft: Dimensions.defaultPageMargin,
        paddingRight: Dimensions.defaultPageMargin,
        flexGrow: 1,
        overflowY: 'auto',
        paddingTop: 30,
        paddingBottom: 70,
        display: 'grid',
        gridGap: 20,

        [`@media (min-width: 460px) and (max-width: ${SIDE_BY_SIDE_CUTOFF})`]: {
            gridTemplateColumns: '1fr 1fr',
        },

        [`@media (min-width: ${SIDE_BY_SIDE_CUTOFF})`]: {
            height: '100%',
            position: 'fixed',
            overflowY: 'auto',
            width: 340,
            boxSizing: 'border-box',
            paddingTop: 80,

            '& > div:last-child': {
                marginBottom: 170,
            },
        },

        '@media (min-width: 1200px)': {
            gridTemplateColumns: '1fr 1fr',
            width: 580
        }
    },

    listingsMap: {
        height: '100%',
        marginBottom: 200,

        [`@media (max-width: ${SIDE_BY_SIDE_CUTOFF})`]: {
            height: 'calc(100% - 58px)', // account for fixed footer on mobile
        },
    },
}

export const useListingsMapStyles = createUseStyles(listingsMapStyles);
