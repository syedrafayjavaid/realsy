import Fonts from "styles/fonts";
import Dimensions from "styles/dimensions";
import {createUseStyles} from "react-jss";

/**
 * Dynamic CMS page styles
 */
export const rawStyles = {
  contentPage: {
    padding: `10px 0 40px`,
    ...Fonts.bodyDefaults,
    maxWidth: 650
  },
  title: {
    marginLeft: Dimensions.defaultPageMargin,
    marginRight: Dimensions.defaultPageMargin,
    marginBottom: 5
  }
};

export const useStyles = createUseStyles(rawStyles);
