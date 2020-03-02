/* eslint-disable import/prefer-default-export */
import { Action } from 'redux';
import { NotificationState } from './types';

// Constants
export const NOTIFICATION__NORMAL_EXPIRY_MS = 6000;
export const NOTIFICATION__LONG_EXPIRY_MS = 12000;
export const NOTIFICATION__XTRA_LONG_EXPIRY_MS = 500000;

// Types
interface ShowNotification {
  (heading: string, details?: string | null, level?: NotificationState['level'], lifespanMs?: number, date?: Date): AppAction<
    'NOTIFICATION__SHOW',
    NotificationState
  >;
}

// Actions
export const showNotification: ShowNotification = (heading, details = null, level = 'INFO', lifespanMs = NOTIFICATION__NORMAL_EXPIRY_MS, date) => ({
  type: 'NOTIFICATION__SHOW',
  payload: {
    heading,
    details,
    level,
    expiryTime: (date || new Date()).getTime() + lifespanMs,
  },
});

export const resetNotification = (): Action<'NOTIFICATION__RESET'> => ({
  type: 'NOTIFICATION__RESET',
});
