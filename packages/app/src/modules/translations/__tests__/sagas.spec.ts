import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as sagas from '../sagas';
import * as selectors from '../selectors';
import * as actions from '../actions';
import { correlate } from '../../../middleware/correlate-redux-middleware';
import { Locale } from '../types';
import { getWebApi } from '../../Api/sagas';

// Mocks
jest.mock('@adstudio-leadcap/api');

// Tests
describe('Translations > Sagas', () => {
  describe('matchLocaleSaga', () => {
    it('should fail with invalid culture code', () => {
      // Arrange
      const FAKE_INVALID_LOCALE_CODE = '-en' as Locale;
      const FAKE_ACTION = correlate(actions.loadTranslations(FAKE_INVALID_LOCALE_CODE), 'FAKE_CORRELATION_ID');
      const EXPECTED_EFFECT = {
        payload: {
          message: "Could not fetch translations as culture code '-en' is invalid",
        },
        correlationId: 'FAKE_CORRELATION_ID',
        type: 'TRANSLATIONS__LOAD_FAIL',
      };
      // Act
      // Assert
      return expectSaga(sagas.matchLocaleSaga, FAKE_ACTION)
        .put.like({ action: EXPECTED_EFFECT })
        .run();
    });

    it('should fail if there are no available locales', () => {
      // Arrange
      const FAKE_ACTION = correlate(actions.loadTranslations('es'), 'FAKE_CORRELATION_ID');
      const EXPECTED_EFFECT = {
        type: 'TRANSLATIONS__LOAD_FAIL',
        payload: {
          message: 'There are no available locales ',
        },
        correlationId: 'FAKE_CORRELATION_ID',
      };
      const FAKE_AVAILABLE_LOCALES: Locale[] = [];
      // Act
      // Assert
      return expectSaga(sagas.matchLocaleSaga, FAKE_ACTION)
        .provide([[matchers.select(selectors.availableLocalesSelector), FAKE_AVAILABLE_LOCALES]])
        .put.like({ action: EXPECTED_EFFECT })
        .run();
    });

    it('should return the locale if a complete match is found', () => {
      // Arrange
      const FAKE_ACTION = correlate(actions.loadTranslations('es'), 'FAKE_CORRELATION_ID');
      const FAKE_AVAILABLE_LOCALES: Locale[] = ['en', 'es'];
      // Act
      // Assert
      return expectSaga(sagas.matchLocaleSaga, FAKE_ACTION)
        .provide([[matchers.select(selectors.availableLocalesSelector), FAKE_AVAILABLE_LOCALES]])
        .returns('es')
        .run();
    });

    it("should return the primary matching locale 'es' if no direct one is found 'es-xl'", () => {
      // Arrange
      const FAKE_ACTION = correlate(actions.loadTranslations('es-xl'), 'FAKE_CORRELATION_ID');
      const FAKE_AVAILABLE_LOCALES: Locale[] = ['es'];
      // Act
      // Assert
      return expectSaga(sagas.matchLocaleSaga, FAKE_ACTION)
        .provide([[matchers.select(selectors.availableLocalesSelector), FAKE_AVAILABLE_LOCALES]])
        .returns('es')
        .run();
    });

    it('should return the fallback locale if no locale has been matched', () => {
      // Arrange
      const FAKE_ACTION = correlate(actions.loadTranslations('es-xl'), 'FAKE_CORRELATION_ID');
      const FAKE_AVAILABLE_LOCALES: Locale[] = ['en', 'de'];
      const FAKE_FALLBACK_LOCALE: Locale = 'en';
      // Act
      // Assert
      return expectSaga(sagas.matchLocaleSaga, FAKE_ACTION)
        .provide([
          [matchers.select(selectors.availableLocalesSelector), FAKE_AVAILABLE_LOCALES],
          [matchers.select(selectors.fallbackLocaleSelector), FAKE_FALLBACK_LOCALE],
        ])
        .returns('en')
        .run();
    });

    it('should match snapshot when a matching locale is found', async () => {
      // Arrange
      const FAKE_ACTION = correlate(actions.loadTranslations('es'), 'FAKE_CORRELATION_ID');
      const FAKE_AVAILABLE_LOCALES: Locale[] = ['en', 'es'];

      // Act
      const result = await expectSaga(sagas.matchLocaleSaga, FAKE_ACTION)
        .provide([[matchers.select(selectors.availableLocalesSelector), FAKE_AVAILABLE_LOCALES]])
        .run();

      // Assert
      expect(result.toJSON()).toMatchSnapshot();
    });

    it('should match snapshot when a fallback locale is used', async () => {
      // Arrange
      const FAKE_ACTION = correlate(actions.loadTranslations('es-xl'), 'FAKE_CORRELATION_ID');
      const FAKE_AVAILABLE_LOCALES: Locale[] = ['en', 'de'];
      const FAKE_FALLBACK_LOCALE: Locale = 'en';

      // Act
      const result = await expectSaga(sagas.matchLocaleSaga, FAKE_ACTION)
        .provide([
          [matchers.select(selectors.availableLocalesSelector), FAKE_AVAILABLE_LOCALES],
          [matchers.select(selectors.fallbackLocaleSelector), FAKE_FALLBACK_LOCALE],
        ])
        .run();

      // Assert
      expect(result.toJSON()).toMatchSnapshot();
    });
  });

  describe('loadTranslationsSaga', () => {
    it('should fail if no available locale matched the culture code', () => {
      // Arrange
      const FAKE_ACTION = correlate(actions.loadTranslations('es'), 'FAKE_CORRELATION_ID');
      const EXPECTED_EFFECT = {
        type: 'TRANSLATIONS__LOAD_FAIL',
        payload: {
          message: "No locale matched the culture code 'es'",
        },
        correlationId: 'FAKE_CORRELATION_ID',
      };
      // Act
      // Assert
      return expectSaga(sagas.loadTranslationsSaga, FAKE_ACTION)
        .provide([[matchers.call.fn(sagas.matchLocaleSaga), null]])
        .put.like({ action: EXPECTED_EFFECT })
        .returns(undefined)
        .run();
    });

    it('should warn if the desired locale is already being used', () => {
      // Arrange
      const FAKE_ACTION = correlate(actions.loadTranslations('es'), 'FAKE_CORRELATION_ID');
      const EXPECTED_EFFECT = {
        type: 'TRANSLATIONS__LOAD_WARN',
        payload: {
          message: "The desired locale 'es' is currently being used",
        },
        correlationId: 'FAKE_CORRELATION_ID',
      };
      // Act
      // Assert
      return expectSaga(sagas.loadTranslationsSaga, FAKE_ACTION)
        .provide([[matchers.call.fn(sagas.matchLocaleSaga), 'es'], [matchers.select(selectors.currentLocaleSelector), 'es']])
        .put.like({ action: EXPECTED_EFFECT })
        .returns(undefined)
        .run();
    });

    it('should warn if the desired locale has already been downloaded', () => {
      // Arrange
      const FAKE_ACTION = correlate(actions.loadTranslations('es'), 'FAKE_CORRELATION_ID');
      const EXPECTED_EFFECT = {
        type: 'TRANSLATIONS__LOAD_WARN',
        payload: {
          message: "The desired locale 'es' has already been downloaded",
        },
        correlationId: 'FAKE_CORRELATION_ID',
      };
      // Act
      // Assert
      return expectSaga(sagas.loadTranslationsSaga, FAKE_ACTION)
        .provide([
          [matchers.call.fn(sagas.matchLocaleSaga), 'es'],
          [matchers.select(selectors.currentLocaleSelector), 'en'],
          [matchers.select(selectors.downloadedLocalesSelector), ['en', 'es']],
        ])
        .put.like({ action: EXPECTED_EFFECT })
        .returns(undefined)
        .run();
    });

    it('should download the localized texts if they have not already been downloaded', () => {
      // Arrange
      const FAKE_ACTION = correlate(actions.loadTranslations('es'), 'FAKE_CORRELATION_ID');
      const FAKE_WEB_API = {
        esTexts: jest.fn(),
      };
      const EXPECTED_EFFECT = {
        type: 'TRANSLATIONS__LOAD_FAIL',
        payload: {
          message: "Empty translation set was returned for locale 'es'. Was the API call successful.",
        },
        correlationId: 'FAKE_CORRELATION_ID',
      };
      // Act
      // Assert
      return expectSaga(sagas.loadTranslationsSaga, FAKE_ACTION)
        .provide([
          [matchers.call.fn(sagas.matchLocaleSaga), 'es'],
          [matchers.select(selectors.currentLocaleSelector), 'en'],
          [matchers.select(selectors.downloadedLocalesSelector), ['en']],
          [matchers.call.fn(getWebApi), FAKE_WEB_API],
          [matchers.call.fn(FAKE_WEB_API.esTexts), null],
        ])
        .put.like({ action: EXPECTED_EFFECT })
        .returns(undefined)
        .run();
    });

    it('should fail if not translations are returned', () => {
      // Arrange
      const FAKE_ACTION = correlate(actions.loadTranslations('es'), 'FAKE_CORRELATION_ID');
      const FAKE_WEB_API = {
        esTexts: jest.fn(),
      };
      const EXPECTED_EFFECT = {
        type: 'TRANSLATIONS__LOAD_FAIL',
        payload: {
          message: "Empty translation set was returned for locale 'es'. Was the API call successful.",
        },
        correlationId: 'FAKE_CORRELATION_ID',
      };
      // Act
      // Assert
      return expectSaga(sagas.loadTranslationsSaga, FAKE_ACTION)
        .provide([
          [matchers.call.fn(sagas.matchLocaleSaga), 'es'],
          [matchers.select(selectors.currentLocaleSelector), 'en'],
          [matchers.select(selectors.downloadedLocalesSelector), ['en']],
          [matchers.call.fn(getWebApi), FAKE_WEB_API],
          [matchers.call.fn(FAKE_WEB_API.esTexts), null],
        ])
        .put.like({ action: EXPECTED_EFFECT })
        .returns(undefined)
        .run();
    });

    it('should store newly downloaded localized texts', () => {
      // Arrange
      const FAKE_ACTION = correlate(actions.loadTranslations('es'), 'FAKE_CORRELATION_ID');
      const FAKE_WEB_API = {
        esTexts: jest.fn(),
      };
      const FAKE_TEXTS = {
        label: 'botón cancelar',
      };
      const FAKE_SUBSTITUTION_TEXTS = {
        label: 'Cancel Button',
      };
      const EXPECTED_EFFECT = {
        type: 'TRANSLATIONS__SET',
        payload: {
          es: FAKE_TEXTS,
        },
        correlationId: 'FAKE_CORRELATION_ID',
      };
      // Act
      // Assert
      return expectSaga(sagas.loadTranslationsSaga, FAKE_ACTION)
        .provide([
          [matchers.call.fn(sagas.matchLocaleSaga), 'es'],
          [matchers.select(selectors.currentLocaleSelector), 'en'],
          [matchers.select(selectors.downloadedLocalesSelector), ['en']],
          [matchers.call.fn(getWebApi), FAKE_WEB_API],
          [matchers.call.fn(FAKE_WEB_API.esTexts), FAKE_TEXTS],
          [matchers.select(selectors.substituteTranslationsSelector), FAKE_SUBSTITUTION_TEXTS],
        ])
        .put.like({ action: EXPECTED_EFFECT })
        .returns(undefined)
        .run();
    });

    it('should store newly downloaded localized texts and use subtitutions if necessary', () => {
      // Arrange
      const FAKE_ACTION = correlate(actions.loadTranslations('es'), 'FAKE_CORRELATION_ID');
      const FAKE_WEB_API = {
        esTexts: jest.fn(),
      };
      const FAKE_TEXTS = {
        label: 'botón cancelar',
      };
      const FAKE_SUBSTITUTION_TEXTS = {
        label: 'Cancel Button',
        description: 'The is the subtitution for the description value',
      };
      const EXPECTED_EFFECT = {
        type: 'TRANSLATIONS__SET',
        payload: {
          es: {
            label: 'botón cancelar',
            description: 'The is the subtitution for the description value',
          },
        },
        correlationId: 'FAKE_CORRELATION_ID',
      };
      // Act
      // Assert
      return expectSaga(sagas.loadTranslationsSaga, FAKE_ACTION)
        .provide([
          [matchers.call.fn(sagas.matchLocaleSaga), 'es'],
          [matchers.select(selectors.currentLocaleSelector), 'en'],
          [matchers.select(selectors.downloadedLocalesSelector), ['en']],
          [matchers.call.fn(getWebApi), FAKE_WEB_API],
          [matchers.call.fn(FAKE_WEB_API.esTexts), FAKE_TEXTS],
          [matchers.select(selectors.substituteTranslationsSelector), FAKE_SUBSTITUTION_TEXTS],
        ])
        .put.like({ action: EXPECTED_EFFECT })
        .returns(undefined)
        .run();
    });

    it('should match snapshot', async () => {
      // Arrange
      const FAKE_ACTION = correlate(actions.loadTranslations('es'), 'FAKE_CORRELATION_ID');
      const FAKE_WEB_API = {
        esTexts: jest.fn(),
      };
      const FAKE_TEXTS = {
        label: 'botón cancelar',
      };
      const FAKE_SUBSTITUTION_TEXTS = {
        label: 'Cancel Button',
      };

      // Act
      const result = await expectSaga(sagas.loadTranslationsSaga, FAKE_ACTION)
        .provide([
          [matchers.call.fn(sagas.matchLocaleSaga), 'es'],
          [matchers.select(selectors.currentLocaleSelector), 'en'],
          [matchers.select(selectors.downloadedLocalesSelector), ['en']],
          [matchers.call.fn(getWebApi), FAKE_WEB_API],
          [matchers.call.fn(FAKE_WEB_API.esTexts), FAKE_TEXTS],
          [matchers.select(selectors.substituteTranslationsSelector), FAKE_SUBSTITUTION_TEXTS],
        ])
        .run();

      // Assert
      expect(result.toJSON()).toMatchSnapshot();
    });
  });

  describe('useTranslationSaga', () => {
    it('should fail if the locale does not match', () => {
      // Arrange
      const FAKE_LOCALE_CODE = 'en' as Locale;
      const FAKE_ACTION = correlate(actions.useTranslations(FAKE_LOCALE_CODE), 'FAKE_CORRELATION_ID');
      const FAKE_TEXTS_COLLECTION = {
        en: undefined,
      };
      const EXPECTED_EFFECT = {
        payload: {
          message: "The locale 'en' has not been loaded",
        },
        correlationId: 'FAKE_CORRELATION_ID',
        type: 'TRANSLATIONS__USE_FAIL',
      };
      // Act
      // Assert
      return expectSaga(sagas.useTranslationSaga, FAKE_ACTION)
        .provide([[matchers.select(selectors.textsSelector), FAKE_TEXTS_COLLECTION]])
        .put.like({ action: EXPECTED_EFFECT })
        .returns(undefined)
        .run();
    });

    it('should apply locale and messages if there is a match', () => {
      // Arrange
      const FAKE_LOCALE_CODE = 'en' as Locale;
      const FAKE_ACTION = correlate(actions.useTranslations(FAKE_LOCALE_CODE), 'FAKE_CORRELATION_ID');
      const FAKE_TEXTS_COLLECTION = {
        en: {},
      };
      const EXPECTED_EFFECT = {
        payload: {
          locale: 'en',
          messages: {},
        },
        correlationId: 'FAKE_CORRELATION_ID',
        type: '@@intl/UPDATE',
      };
      // Act
      // Assert
      return expectSaga(sagas.useTranslationSaga, FAKE_ACTION)
        .provide([[matchers.select(selectors.textsSelector), FAKE_TEXTS_COLLECTION]])
        .put.like({ action: EXPECTED_EFFECT })
        .returns(undefined)
        .run();
    });

    it('should match snapshot', async () => {
      // Arrange
      const FAKE_LOCALE_CODE = 'en' as Locale;
      const FAKE_ACTION = correlate(actions.useTranslations(FAKE_LOCALE_CODE), 'FAKE_CORRELATION_ID');
      const FAKE_TEXTS_COLLECTION = {
        en: {},
      };
      // Act
      const result = await expectSaga(sagas.useTranslationSaga, FAKE_ACTION)
        .provide([[matchers.select(selectors.textsSelector), FAKE_TEXTS_COLLECTION]])
        .run();

      // Assert
      expect(result.toJSON()).toMatchSnapshot();
    });
  });

  describe('getTextSaga', () => {
    it('should get single text item from texts dictionary', () => {
      // Arrange
      const FAKE_ACTION = { type: 'FAKE_ACTION' };
      const FAKE_TEXT_ENTRY = [
        {
          key: 'label',
          values: {},
        },
      ];
      const FAKE_LOCALE_CODE = 'en' as Locale;
      const FAKE_MESSAGES = {
        label: 'label',
      };
      const EXPECTED_STRINGS = ['[en]label {}'];
      // Act
      // Assert
      return expectSaga(sagas.getTextSaga, FAKE_TEXT_ENTRY, FAKE_ACTION)
        .provide([[matchers.select(selectors.messagesSelector), FAKE_MESSAGES], [matchers.select(selectors.currentLocaleSelector), FAKE_LOCALE_CODE]])
        .returns(EXPECTED_STRINGS)
        .run();
    });

    it('should get multiple text items from texts dictionary', () => {
      // Arrange
      const FAKE_ACTION = { type: 'FAKE_ACTION' };
      const FAKE_TEXT_ENTRY = [
        {
          key: 'label',
          values: {},
        },
        {
          key: 'label2',
          values: {},
        },
      ];
      const FAKE_LOCALE_CODE = 'en' as Locale;
      const FAKE_MESSAGES = {
        label: 'label',
        label2: 'label dos',
      };
      const EXPECTED_STRINGS = ['[en]label {}', '[en]label dos {}'];
      // Act
      // Assert
      return expectSaga(sagas.getTextSaga, FAKE_TEXT_ENTRY, FAKE_ACTION)
        .provide([[matchers.select(selectors.messagesSelector), FAKE_MESSAGES], [matchers.select(selectors.currentLocaleSelector), FAKE_LOCALE_CODE]])
        .returns(EXPECTED_STRINGS)
        .run();
    });

    it('should log warning if no text found', () => {
      // Arrange
      const FAKE_ACTION = { type: 'FAKE_ACTION' };
      const FAKE_TEXT_ENTRY = [
        {
          key: 'label',
          values: {},
        },
        {
          key: 'label2',
          values: {},
        },
      ];
      const FAKE_LOCALE_CODE = 'en' as Locale;
      const FAKE_MESSAGES = {
        label: 'label',
      };
      const EXPECTED_STRINGS = ['[en]label {}', ''];
      const EXPECTED_EFFECT = {
        type: 'LOGGING__SUBMIT',
        payload: {
          level: 'WARN',
          context: 'CONTENT.SAGAS',
          message: '1 text entry key(s) were not matched the texts dictionary with locale en',
        },
      };
      // Act
      // Assert
      return expectSaga(sagas.getTextSaga, FAKE_TEXT_ENTRY, FAKE_ACTION)
        .provide([[matchers.select(selectors.messagesSelector), FAKE_MESSAGES], [matchers.select(selectors.currentLocaleSelector), FAKE_LOCALE_CODE]])
        .put.like({ action: EXPECTED_EFFECT })
        .returns(EXPECTED_STRINGS)
        .run();
    });

    it('should match snapshot', async () => {
      // Arrange
      const FAKE_ACTION = { type: 'FAKE_ACTION' };
      const FAKE_TEXT_ENTRY = [
        {
          key: 'label',
          values: {},
        },
        {
          key: 'label2',
          values: {},
        },
      ];
      const FAKE_LOCALE_CODE = 'en' as Locale;
      const FAKE_MESSAGES = {
        label: 'label',
        label2: 'label dos',
      };
      // Act
      // Assert
      const result = await expectSaga(sagas.getTextSaga, FAKE_TEXT_ENTRY, FAKE_ACTION)
        .provide([[matchers.select(selectors.messagesSelector), FAKE_MESSAGES], [matchers.select(selectors.currentLocaleSelector), FAKE_LOCALE_CODE]])
        .run();

      // Assert
      expect(result.toJSON()).toMatchSnapshot();
    });
  });
});
