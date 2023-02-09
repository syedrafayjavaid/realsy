import Dimensions from "styles/dimensions";
import Colors from "styles/colors";
import {createUseStyles} from "react-jss";

export const userGuideBoxStyles = {
    userGuideBox: {
        backgroundColor: Colors.offWhite,
        borderRadius: 5,
        overflow: 'hidden',
        boxShadow: Colors.defaultShadow,
        margin: `20px ${Dimensions.defaultPageMargin}`,

        '& .user-guide-body': {
            padding: 20,
            textAlign: 'left',
            fontSize: 20,

            '& h2': {
                fontSize: '30px',
                margin: 0
            },

            '& ul': {
                padding: 0,
                listStylePosition: 'inside',
                marginBottom: 40,

                '& li': {
                    marginBottom: 15,
                    lineHeight: 1.3,
                    listStylePosition: 'outside',
                    marginLeft: 18,
                    fontSize: 17,
                }
            }
        },
    },
    image: {
        height: 200,
        width: '100%',
        backgroundColor: Colors.darkBlue,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    },

    [`@media (min-width: ${Dimensions.breakpointMedium})`]: {
        userGuideBox: {
            width: 500,
            margin: 50,
            display: 'grid',
            gridTemplateColumns: '40% 60%',
            alignItems: 'center',

            '&:first-child': {
                justifySelf: 'end',
            },
            '&:nth-child(2)': {
                justifySelf: 'start',
            },

            '& img': {
                width: 200
            }
        },
        image: {
            height: '100%',
            width: '100%',
        },
    }
};

export const useUserGuideBoxStyles = createUseStyles(userGuideBoxStyles);
