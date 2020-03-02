import * as actions from '../actions';

describe('Translations > Actions', () => {
  describe('Load Transations', () => {
    let FAKE_LOCALE: 'za';

    beforeEach(() => {
      FAKE_LOCALE = 'za';
    });

    it('should create a simple load translations action', () => {
      // Arrange
      // Act
      const loadTranslationsAction = actions.loadTranslations(FAKE_LOCALE);

      // Assert
      expect(loadTranslationsAction).toMatchObject({
        type: 'TRANSLATIONS__LOAD',
        payload: {
          cultureCode: FAKE_LOCALE,
        },
      });
    });
  });

  describe('Set Transations', () => {
    let FAKE_LOCALE: 'en';
    let FAKE_DICT: any;

    beforeEach(() => {
      FAKE_LOCALE = 'en';
      FAKE_DICT = {
        TEXT_KEY_1: 'TEXT VALUE 1',
        TEXT_KEY_2: 'TEXT VALUE 2',
        TEXT_KEY_3: 'TEXT VALUE 3',
      };
    });

    it('should create a simple set translations action', () => {
      // Arrange
      // Act
      const setTranslationsAction = actions.setTranslations(FAKE_LOCALE, FAKE_DICT);

      // Assert
      expect(setTranslationsAction).toMatchObject({
        type: 'TRANSLATIONS__SET',
        payload: {
          [FAKE_LOCALE]: FAKE_DICT,
        },
      });
    });
  });

  describe('Use Transations', () => {
    let FAKE_LOCALE: 'es';

    beforeEach(() => {
      FAKE_LOCALE = 'es';
    });

    it('should create a simple reset notification action', () => {
      // Arrange
      // Act
      const resetNotificationAction = actions.useTranslations(FAKE_LOCALE);

      // Assert
      expect(resetNotificationAction).toMatchObject({
        type: 'TRANSLATIONS__USE',
        payload: {
          locale: FAKE_LOCALE,
        },
      });
    });
  });
});
