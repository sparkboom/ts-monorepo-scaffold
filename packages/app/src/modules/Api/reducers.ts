import { Reducer } from 'redux';
import * as actions from './actions';
import { Api } from './types';
import apiState from './state';

// Types
type ApiActions = ActionUnion<typeof actions>;

// Reducer
const apiReducer: Reducer<Api, ApiActions> = (state = apiState, action) => {
  switch (action.type) {
    case 'API__SET_TOKEN':
      return {
        ...state,
        token: action.payload,
      };

    default:
      return state;
  }
};

export default apiReducer;
