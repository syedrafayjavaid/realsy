import {createUseStyles} from "react-jss";
import Colors from "styles/colors";
import {ModalProps} from "components/modal/modal";

/**
 * Styles for the modal component
 */
export const modalStyles = {
    '@global': {
        '.ReactModal__Overlay': {
            '& .ReactModal__Content': {
                opacity: 0,
                transform: 'translateY(-30px)',
                transition: 'all 300ms ease-in-out',
            },
        },

        '.ReactModal__Overlay--after-open': {
            '& .ReactModal__Content': {
                opacity: 1,
                transform: 'translateY(0px)',
            },
        },

        '.ReactModal__Overlay--before-close': {
            '& .ReactModal__Content': {
                opacity: 0,
                transform: 'translateY(-30px)',
            },
        },
    },

    modal: (props: ModalProps) => ({
        padding: 0,
        outline: 'none',
        background: '#fff',
        border: 'none',
        boxShadow: 'none',
        overflow: 'hidden',
        width: '100%',
        height: 'fit-content',
        maxHeight: '100%',
        maxWidth: '100%',
        position: 'absolute',
        overflowY: 'auto',

        [`@media (min-width: ${props.fullScreenBreakpoint})`]: {
            overflowY: 'hidden',
            position: 'initial',
            margin: '4vh auto',
            width: 'fit-content',
            maxHeight: '92vh',
            minWidth: 300,
            maxWidth: '95%',
            borderRadius: '5px',
        },
    }),

    modalContent: (props: ModalProps) => ({
        overflowY: 'auto',
        [`@media (max-width: ${props.fullScreenBreakpoint})`]: {
            transform: 'translateX(0)', // resets coordinates so that close button can be position absolute instead of fixed
        },
        [`@media (min-width: ${props.fullScreenBreakpoint})`]: {
            maxHeight: '92vh',
        },
    }),

    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },

    closeButton: {
        position: 'absolute',
        zIndex: 100,
        right: 0,
        top: 0,
        cursor: 'pointer',
        outline: 'none',
        border: 'none',
        width: 24,
        height: 32,
        display: 'inline-block',
        backgroundColor: Colors.mediumBlue,
        borderBottomLeftRadius: 5,
        transition: 'background-color 300ms',
        '&:hover': {
            backgroundColor: Colors.yellow,
        },
        '& svg': {
            position: 'relative',
            top: 1,
            right: -1,
            width: 20,
            height: 20,
            fill: '#fff',
        },
    },
};

export const useModalStyles = createUseStyles(modalStyles);
