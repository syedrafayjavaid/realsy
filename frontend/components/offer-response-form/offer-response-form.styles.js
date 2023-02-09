import {createUseStyles} from "react-jss";
import Colors from "styles/colors";

/**
 * Styles for offer response form
 */
export const rawStyles = {
  container: {
    boxShadow: Colors.defaultShadow,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: Colors.offWhite,
  },

  wrapper: {
    backgroundColor: Colors.offWhite,
    padding: 20,
    '& input': {
      backgroundColor: '#fff'
    },
    '& textarea': {
      backgroundColor: '#fff'
    }
  },

  head: {
    textAlign: 'right'
  },

  agentNote: {
      backgroundColor: Colors.lightBlue,
      padding: '20px 20px 20px 10px',
      color: '#fff',
      float: 'left',
      borderRadius: 8,
      marginLeft: 20,
      '&:before': {
          float: 'left',
          display: 'block',
          content: '""',
          position: 'relative',
          marginRight: -30,
          left: -25,
          top: 0,
          width: 0,
          height: 0,
          borderRadius: 8,
          borderLeft: '20px solid transparent',
          borderRight: '20px solid transparent',
          borderTop: `20px solid ${Colors.lightBlue}`,
      }
  }
};

export const useStyles = createUseStyles(rawStyles);
