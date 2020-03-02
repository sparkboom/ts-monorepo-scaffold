import { Reducer } from 'redux';
import { setTranslations } from './actions';
import translationState from './state';

// Types
type AllTranslationActions = ReturnType<typeof setTranslations>;

// Reducer
const translationsReducer: Reducer<typeof translationState, AllTranslationActions> = (state = translationState, action) => {
  switch (action.type) {
    case 'TRANSLATIONS__SET':
      return {
        ...state,
        texts: {
          ...state.texts,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export default translationsReducer;
