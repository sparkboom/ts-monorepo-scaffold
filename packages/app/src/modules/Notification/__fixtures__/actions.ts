import { showNotification, resetNotification } from '../actions';

export const showNotificationAction = showNotification('An error has occured', 'Scenario details here', 'ERROR', 1575163851945);

export const resetNotificationAction = resetNotification();
