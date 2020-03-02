import { Reducer } from 'redux';
import * as actions from './actions';
import { NotificationState } from './types';
import configState from './state';

// Types
type NotificationActions = ActionUnion<typeof actions>;

// Reducer
const notificationReducer: Reducer<NotificationState, NotificationActions> = (state = configState, action) => {
  switch (action.type) {
    case 'NOTIFICATION__RESET': {
      return {
        heading: null,
        details: null,
        level: null,
        expiryTime: null,
      };
    }
    case 'NOTIFICATION__SHOW': {
      return {
        ...action.payload,
      };
    }
    default:
      return state;
  }
};

export default notificationReducer;
