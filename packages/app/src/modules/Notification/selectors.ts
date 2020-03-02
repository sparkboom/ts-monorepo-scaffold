import { NotificationState } from './types';

// Selectors
export const notificationSelector = (state: RootState): NotificationState => state.notification;
