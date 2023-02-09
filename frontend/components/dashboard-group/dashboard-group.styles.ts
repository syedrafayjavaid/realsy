import {createUseStyles} from "react-jss";
import Colors from "styles/colors";

export const dashboardGroupStyles = {
    dashboardGroup: {
        maxWidth: '100%',
        borderRadius: 5,
        overflow: 'hidden',
        boxShadow: Colors.defaultShadow,
        marginBottom: 30,

        '& h2': {
            backgroundColor: Colors.mediumBlue,
            color: '#fff',
            fontSize: 16,
            margin: 0,
            padding: '10px 12px',
        },

        '& .dashboard-group-body': {
            padding: 15,
            backgroundColor: Colors.offWhite,
        },

        '&.interior-scroll': {
            '& .dashboard-group-body': {
                maxHeight: 390,
                overflowY: 'scroll',
            }
        },

        '&.no-padding': {
            '& .dashboard-group-body': {
                padding: 0
            },
        },

        '&.no-border': {
            border: 'none',
            boxShadow: 'none',
            overflow: 'visible',

            '& h2': {
                borderRadius: '5px 5px 0 0'
            }
        }
    }
};

export const useDashboardGroupStyles = createUseStyles(dashboardGroupStyles);
