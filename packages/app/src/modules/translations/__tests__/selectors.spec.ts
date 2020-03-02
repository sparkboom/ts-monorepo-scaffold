import * as selectors from '../selectors';
import { translationsState, translationsStateWithEsDict, frIntlLocaleState, sampleState, englishDicts, españolDicts } from '../__fixtures__/state';

describe('Translations > Selectors', () => {
  describe('currentLocaleSelector', () => {
    it('should return the current locale', () => {
      // Arrange
      // Act
      const result = selectors.currentLocaleSelector(frIntlLocaleState);

      // Assert
      expect(result).toEqual('fr');
    });
  });

  describe('messagesSelector', () => {
    it('should return messages for the current locale', () => {
      // Arrange
      // Act
      const result = selectors.messagesSelector(frIntlLocaleState);

      // Assert
      expect(result).toEqual({
        key: 'Voici la traduction',
      });
    });
  });

  describe('defaultLocaleSelector', () => {
    it('should return the default locale', () => {
      // Arrange
      // Act
      const result = selectors.defaultLocaleSelector(sampleState);

      // Assert
      expect(result).toEqual('es-XL');
    });
  });

  describe('fallbackLocaleSelector', () => {
    it('should return the fallback locale', () => {
      // Arrange
      // Act
      const result = selectors.fallbackLocaleSelector(sampleState);

      // Assert
      expect(result).toEqual('es');
    });
  });

  describe('substituteLocaleSelector', () => {
    it('should return the substitute locale', () => {
      // Arrange
      // Act
      const result = selectors.substituteLocaleSelector(sampleState);

      // Assert
      expect(result).toEqual('es');
    });
  });

  describe('availableLocalesSelector', () => {
    it('should return the substitute locale', () => {
      // Arrange
      // Act
      const result = selectors.availableLocalesSelector(sampleState);

      // Assert
      expect(result).toEqual(['en', 'es', 'es-XL']);
    });
  });

  describe('textsSelector', () => {
    it('should return the downloaded texts', () => {
      // Arrange
      // Act
      const result = selectors.textsSelector(sampleState);

      // Assert
      expect(result).toEqual({ en: englishDicts });
    });
  });

  describe('downloadedLocalesSelector', () => {
    it('should return list of translations when both English and Spanish texts have been loaded', () => {
      // Arrange
      // Act
      const result = selectors.downloadedLocalesSelector(translationsStateWithEsDict);

      // Assert
      expect(result).toEqual(['en', 'es']);
    });

    it('should return list of translations when only English texts have been loaded', () => {
      // Arrange
      // Act
      const result = selectors.downloadedLocalesSelector(translationsState);

      // Assert
      expect(result).toEqual(['en']);
    });
  });

  describe('substituteTranslationsSelector', () => {
    it('should return substitution translations ', () => {
      // Arrange
      // Act
      const result = selectors.substituteTranslationsSelector(translationsStateWithEsDict);

      // Assert
      expect(result).toEqual(españolDicts);
    });
  });
});
