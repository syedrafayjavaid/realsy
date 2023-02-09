import Colors from "styles/colors";
import {rawStyles as step1Styles} from './step-1.styles';

export const rawStyles = {
  ...step1Styles,

  formWrapper: {
    backgroundColor: Colors.offWhite,
    boxShadow: Colors.defaultShadow,
    padding: '15px 30px'
  },

  inputs: {
    '@media (min-width: 1200px)': {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    },
  },
}
