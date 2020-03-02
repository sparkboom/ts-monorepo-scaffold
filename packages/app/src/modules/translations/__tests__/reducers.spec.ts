import reducer from '../reducers';
import * as actions from '../actions';
import { emptyAction } from '../__fixtures__/actions';
import { translationsStateWithSampleEnDict, translationsStateWithEsDict, translationsState, englishDicts, españolDicts } from '../__fixtures__/state';

describe('Translations > Reducers', () => {
  describe('Initial State', () => {
    it('should return the initial state', () => {
      // Arrange
      // Act
      const newState = reducer(translationsState.translations, emptyAction);

      // Assert
      expect(newState).toEqual(translationsState.translations);
    });
  });

  describe('Set Translations', () => {
    it('should apply new translations from scratch', () => {
      // Arrange
      const setTranslationsAction = actions.setTranslations('es', españolDicts);

      // Act
      const newState = reducer(translationsState.translations, setTranslationsAction);

      // Assert
      expect(newState).toMatchObject(translationsStateWithEsDict.translations);
    });

    it('should re-apply translations from scratch', () => {
      // Arrange
      const setTranslationsAction = actions.setTranslations('en', englishDicts);

      // Act
      const newState = reducer(translationsState.translations, setTranslationsAction);

      // Assert
      expect(newState).toMatchObject(translationsStateWithSampleEnDict.translations);
    });
  });
});
