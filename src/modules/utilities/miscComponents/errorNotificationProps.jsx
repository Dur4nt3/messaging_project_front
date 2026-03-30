import { CircleX } from 'lucide-react';

import './stylesheets/ErrorNotification.css';

const errorNotificationProps = (title, message) => ({
    title,
    message,
    position: 'top-center',
    autoClose: false,
    classNames: {
        root: 'error-notification-root',
        icon: 'error-notification-icon',
        body: 'error-notification-body',
        title: 'error-notification-title',
        description: 'error-notification-description',
        closeButton: 'error-notification-close',
    }
});

export default errorNotificationProps;
