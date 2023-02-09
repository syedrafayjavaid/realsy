import {createUseStyles} from "react-jss";
import Fonts from "styles/fonts";
import Colors from "styles/colors";

/**
 * Styles for the user Pre-Approval modal form
 */
export const preApprovalModalStyles = {
    preApprovalModal: {
        ...Fonts.bodyDefaults,
        padding: '10px 70px 50px',
        '& h2': {
            fontSize: 28,
            paddingBottom: 10,
            borderBottom: `1px solid ${Colors.mediumBlue}`
        },
        '& select': {
            backgroundColor: Colors.offWhite,
            maxWidth: 350,
            display: 'block'
        },
        '& .heading': {
            marginTop: 20,
            fontSize: '16px',
            fontWeight: 'bold'
        },
        '& input': {
            maxWidth: 350,
            display: 'block',
        },
        '& input[type="radio"]': {
            display: 'inline !important'
        },
        '& .side-by-side': {
            display: 'grid',
            gridTemplateColumns: '120px 120px'
        },
        '& .pre-approval-amount': {
            maxHeight: '100vh',
            overflow: 'hidden',
            transition: '300ms',
            '&.hidden': {
                maxHeight: 0,
            }
        }
    },


};

export const usePreApprovalModalStyles = createUseStyles(preApprovalModalStyles);
