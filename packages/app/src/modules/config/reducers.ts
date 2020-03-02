import { Reducer } from 'redux';
import { merge } from 'lodash-es';
import * as actions from './actions';
import { LeadCapConfig } from './types';
import configState from './state';

// Types
type ConfigActions = ActionUnion<typeof actions>;

// Reducer
const configReducer: Reducer<Partial<LeadCapConfig>, ConfigActions> = (state = configState, action) => {
  switch (action.type) {
    case 'CONFIG__SET':
      return merge({}, state, action.payload);
    case 'CONFIG__FEATURE_TOGGLES_SET':
      return {
        ...state,
        featureToggles: {
          ...state.featureToggles,
          ...action.payload.featureToggles,
        },
      };
    default:
      return state;
  }
};

export default configReducer;
