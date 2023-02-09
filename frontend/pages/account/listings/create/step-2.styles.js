import Colors from "styles/colors";
import {rawStyles as step1Styles} from './step-1.styles';

export const rawStyles = {
  ...step1Styles,

  form: {
    '& h4': {
      margin: 0
    },
    '& h2': {
      margin: '10px 0'
    },
    '& dt': {
      color: Colors.lightBlue,
      fontWeight: 'bold'
    },
    '& dd': {
      margin: 0
    }
  },
  formWrapper: {},
  details: {},
  inputs: {},
  selectFields: {},

  '@media (min-width: 900px)': {
    formWrapper: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridGap: 20
    },
    cityStateZipInputs: {
      gridTemplateColumns: '1fr auto 150px',
    },

    inputs: {
      '& select': {
        width: '45%',
        backgroundColor: Colors.offWhite
      }
    },
    selectFields: {
      display: 'grid',
      gridTemplateColumns: '80px 80px',
      gridGap: 20,
      '& select': {
        width: '100%',
        display: 'block'
      }
    },
  },
}
