export type NotificationLevel = 'ERROR' | 'INFO' | 'SUCCESS' | 'WARNING';

export interface NotificationState {
  heading: string | null;
  details: string | null;
  level: NotificationLevel | null;
  expiryTime: number | null;
}
