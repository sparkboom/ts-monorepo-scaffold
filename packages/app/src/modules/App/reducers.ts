import { Reducer } from 'redux';
import * as actions from './actions';
import { status } from '../Logging/actions';
import { App } from './types';
import appState from './state';

// Types
type AppActions = ActionUnion<typeof actions> | ReturnType<typeof status> | { type: ''; payload: null };

// Reducer
const appReducer: Reducer<App, AppActions> = (state = appState, action) => {
  switch (action.type) {
    case 'API__INIT_STATUS': {
      const newStatus = action.payload.details.status === 'IN_PROGRESS' ? 'APP_CHECK__IN_PROGRESS' : 'APP_CHECK__INIT';
      return {
        ...state,
        checks: {
          ...state.checks,
          jwt: {
            status: newStatus,
          },
        },
      };
    }
    case 'API__INIT_SUCCESS': {
      return {
        ...state,
        checks: {
          ...state.checks,
          jwt: {
            status: 'APP_CHECK__SUCCESS',
          },
        },
      };
    }
    case 'API__INIT_FAIL': {
      return {
        ...state,
        checks: {
          ...state.checks,
          jwt: {
            status: 'APP_CHECK__FAIL',
          },
        },
      };
    }
    case 'CONFIG__LOAD_STATUS': {
      const newStatus = action.payload.details.status === 'IN_PROGRESS' ? 'APP_CHECK__IN_PROGRESS' : 'APP_CHECK__INIT';
      return {
        ...state,
        checks: {
          ...state.checks,
          config: {
            status: newStatus,
          },
        },
      };
    }
    case 'CONFIG__LOAD_SUCCESS': {
      return {
        ...state,
        checks: {
          ...state.checks,
          config: {
            status: 'APP_CHECK__SUCCESS',
          },
        },
      };
    }
    case 'CONFIG__LOAD_FAIL': {
      return {
        ...state,
        checks: {
          ...state.checks,
          config: {
            status: 'APP_CHECK__FAIL',
          },
        },
      };
    }
    default:
      return state;
  }
};

export default appReducer;
