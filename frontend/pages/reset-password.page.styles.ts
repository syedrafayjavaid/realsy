import {createUseStyles} from "react-jss";
import Dimensions from "styles/dimensions";

/**
 * Reset password page styles
 */
export const rawStyles = {
  container: {
    maxWidth: 400,
    padding: '20px ' + Dimensions.defaultPageMargin + ' 50px',
  }
};

export const useStyles = createUseStyles(rawStyles);
