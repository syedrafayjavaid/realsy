import {createUseStyles} from "react-jss";
import Colors from "styles/colors";
import Fonts from "styles/fonts";

/**
 * Styles for User Guide Headers
 */
export const userGuideHeaderStyles = {
  container: {
    padding: '40px 20px 30px',
    backgroundColor: Colors.mediumBlue,
    color: '#fff',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    '& h4': {
      fontFamily: Fonts.mainSerifFont,
      color: "#fff !important",
      fontWeight: 'bold',
      fontSize: '19px',
      margin: 0
    },
    '& p': {
      color: '#ccc',
      fontSize: '14px'
    }
  }
};

export const useUserGuideHeaderStyles = createUseStyles(userGuideHeaderStyles);
