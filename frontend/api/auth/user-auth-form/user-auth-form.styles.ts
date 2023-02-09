import Colors from 'styles/colors';
import Fonts from 'styles/fonts';
import {createUseStyles} from "react-jss";

const BUTTON_STACK_WIDTH = 450; // view width at which buttons move from stack to side-by-side

export const userAuthFormStyles = {
    userAuthForm: {
        lineHeight: '1.7em',
        textAlign: 'left',
        fontSize: '16px',
        boxSizing: 'border-box',
        padding: 0,
        width: 580,
        maxWidth: '100%',

        '& ul': {
            borderBottom: '1px solid #ccc',
            listStyle: 'none',
            margin: '0 0 30px',
            padding: '0',
            whiteSpace: 'nowrap',

            '& li': {
                display: 'inline-block',

                '& a': {
                    marginRight: 10,
                },

                '&.active button': {
                    color: Colors.darkBlue,
                    borderBottom: `2px solid ${Colors.darkBlue}`,
                }
            }
        },

        '& button': {
            cursor: 'pointer'
        }
    },

    mobileHeader: {
        margin: '45px 0 -10px',
        textAlign: 'center',
    },

    headerLogo: {
        fill: Colors.mediumBlue,
    },

    tabButton: {
        fontSize: '16px !important',
        fontFamily: Fonts.mainSerifFont,
        display: 'block',
        padding: 10,
        margin: 0,
        color: Colors.lightGray,
        cursor: 'pointer',
        outline: 'none',
        border: 'none',
        background: 'none',
    },

    emailSignIn: {
        boxSizing: 'border-box',
        padding: '30px 15px 15px',
        width: '100%',

        '& form': {
            width: '100%',
            maxWidth: 'none'
        }
    },

    registerContainer: {
        marginBottom: 40,
    },

    oAuthLogin: {
        backgroundColor: Colors.offWhite,
        borderTop: '1px solid #666',
        textAlign: 'center',
        marginTop: 20,
        paddingBottom: 30,

        '& p': {
            backgroundColor: Colors.offWhite,
            border: '1px solid #666',
            borderBottom: 'none',
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            width: 60,
            height: 30,
            padding: 8,
            boxSizing: 'border-box',
            margin: '-30px auto 30px',
            fontFamily: Fonts.mainSerifFont,
            fontWeight: 'bold',
            color: Colors.mediumBlue,
        },

        [`@media (min-width: ${BUTTON_STACK_WIDTH}px)`]: {
            marginTop: 0,
        },
    },

    oAuthButtons: {
        [`@media (min-width: ${BUTTON_STACK_WIDTH}px)`]: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridGap: 20,
            padding: '0 40px',
        }
    },

    oAuthButton: {
        backgroundColor: Colors.mediumBlue,
        color: '#fff',
        borderRadius: 5,
        textDecoration: 'none',
        fontSize: '16px',
        padding: '12px 25px',
        fontFamily: Fonts.mainSerifFont,
        boxSizing: 'border-box',
        margin: `0 10px 10px`,
        display: 'block',
        whiteSpace: 'nowrap',
        [`@media (min-width: ${BUTTON_STACK_WIDTH}px)`]: {
            margin: 0
        }
    },

    [`@media (min-width: ${BUTTON_STACK_WIDTH}px)`]: {
        userAuthForm: {
            textAlign: 'left',
            fontSize: '18px',
        },
        tabButton: {
            fontSize: '28px !important',
            padding: 20,
        },
        emailSignIn: {
            padding: '20px 40px',
        }
    }
}

export const useUserAuthFormStyles = createUseStyles(userAuthFormStyles);
