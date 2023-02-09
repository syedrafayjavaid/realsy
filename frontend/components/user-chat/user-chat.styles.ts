import Colors from "styles/colors";
import {createUseStyles} from "react-jss";

export const useChatStyles =  {
    container: {
        height: 500,
        borderRadius: 5,
        backgroundColor: Colors.offWhite,
        boxShadow: Colors.defaultShadow,
        overflow: 'hidden',
        display: 'grid',
        gridTemplateRows: '1fr 160px',
    },

    chatMessage: {
        display: 'grid',
        gridTemplateColumns: 'auto 60px',
        gridGap: 10,
        alignItems: 'top',
        padding: '0 20px',
        '&.received': {
            gridTemplateColumns: '60px auto',
        }
    },

    messageBody: {
        margin: '15px 0 0',
        color: '#fff',
        borderRadius: 5,
        backgroundColor: Colors.mediumGray,
        marginBottom: '20px !important',
        marginRight: 10,
        '&:before': {
            float: 'right',
            display: 'block',
            content: '""',
            position: 'relative',
            right: -15,
            top: 0,
            width: 0,
            height: 0,
            borderRadius: 8,
            borderLeft: '20px solid transparent',
            borderRight: '20px solid transparent',
            borderTop: `20px solid ${Colors.mediumGray}`,
        },
        '& span': {
            display: 'block',
            padding: '8px 15px',
        },

        '.received &': {
            backgroundColor: Colors.lightBlue,
            '& span': {
            },
            '&:before': {
                float: 'left',
                display: 'block',
                content: '""',
                position: 'relative',
                marginRight: -25,
                left: -15,
                top: 0,
                width: 0,
                height: 0,
                borderRadius: 8,
                borderLeft: '20px solid transparent',
                borderRight: '20px solid transparent',
                borderTop: `20px solid ${Colors.lightBlue}`,
            }
        }
    },

    timestamp: {
        fontSize: 12,
        margin: 0,
        padding: 0,
        marginBottom: -22,
        color: '#ddd',
    },

    userImage: {
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: 50,
        height: 50,
        borderRadius: '50%',
    },

    messagesBody: {
        overflowY: 'scroll',
    },

    inputForm: {
        margin: '0 20px',
        '& p': {
            margin: 0,
            padding: 0,
            textAlign: 'right'
        },
        '& textarea': {
            backgroundColor: '#fff',
            height: 90
        }
    }
};

export const useUserChatStyles = createUseStyles(useChatStyles);
