import Colors from "./colors";

const notificationSyles = {
    padding: '10px 20px',
    borderRadius: 5,
    fontSize: '16px'
};

const Notifications = {
    errorMessage: {
        ...notificationSyles,
        backgroundColor: Colors.pink,
        color: '#fff',
        border: '1px solid #c00',
    },
    infoMessage: {
        ...notificationSyles,
        backgroundColor: '#dff0d8',
        color: '#3c763d',
        border: `1px solid #3c763d`
    }
};

export default Notifications;
