import { NotificationState } from '../types';

export const nullState: NotificationState = {
  heading: null,
  details: null,
  level: null,
  expiryTime: null,
};

export const errorState: NotificationState = {
  heading: 'An error has occured',
  details: 'Scenario details here',
  level: 'ERROR',
  expiryTime: 1575163851945,
};

export const warnState: NotificationState = {
  heading: 'This is a warn heading',
  details: 'These are the warning details here',
  level: 'WARNING',
  expiryTime: 1575163851945,
};

export const successState: NotificationState = {
  heading: 'This is a success heading',
  details: 'These are the success details here',
  level: 'SUCCESS',
  expiryTime: 1575163851945,
};

export const infoState: NotificationState = {
  heading: 'This is an info heading',
  details: 'These are the info details here',
  level: 'INFO',
  expiryTime: 1575163851945,
};

export const noLevelState: NotificationState = {
  heading: 'This is a heading',
  details: 'These are the details here',
  level: null,
  expiryTime: 1575163851945,
};

export const infoNoHeadingState: NotificationState = {
  heading: null,
  details: 'These are the info details here',
  level: 'INFO',
  expiryTime: 1575163851945,
};
