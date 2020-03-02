import { createLogger } from 'redux-logger';
import { Action } from 'redux';

const options = {
  collapsed: true,
  predicate: (getState: Function, action: Action<any>): boolean => action.type !== 'LOGGING__SUBMIT',
};

export const middleware = createLogger(options);
