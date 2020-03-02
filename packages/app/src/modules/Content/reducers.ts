import { Reducer } from 'redux';
import { setContent } from './actions';
import { Content } from './types';
import contentState from './state';

// Types
type AllContentActions = ReturnType<typeof setContent>;

// Reducer
const contentReducer: Reducer<Content, AllContentActions> = (state = contentState, action) => {
  switch (action.type) {
    case 'CONTENT__SET':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default contentReducer;
