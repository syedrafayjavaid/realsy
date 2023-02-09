import Colors from "styles/colors";
import {createUseStyles} from "react-jss";

export const activityRecordThumbnailStyles = {
  activityRecord: {
    borderRadius: 5,
    overflow: 'hidden',
    boxShadow: Colors.defaultShadow,
  },

  top: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr',
  },

  image: {
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },

  body: {
    padding: 20,

    '& p': {
      margin: 0,
      padding: 0
    }
  },

  title: {
    fontSize: '22px !important',
    color: `${Colors.mediumBlue} !important`,
    marginTop: 0,
    marginBottom: -2
  },

  date: {
    color: Colors.lightBlue,
    fontWeight: 'bold',
    fontSize: '15px',
  },

  footer: {
    backgroundColor: Colors.mediumBlue,
    color: '#fff',
    fontWeight: 300,
    fontSize: '13px',
    padding: '5px 16px',
    display: 'grid',
    gridTemplateColumns: '1fr auto',
  },

  footerButtonContainer: {
    justifyContent: 'end'
  }
}

export const useActivityRecordThumbnailStyles = createUseStyles(activityRecordThumbnailStyles);
