import { Locale } from '../types';
import { TranslationsState } from '../state';

// Types
interface TranslationStateFixture {
  translations: TranslationsState;
}

// Fixtures
export const englishDicts = {
  key: 'This is english',
};
export const españolDicts = {
  key: 'Esto es español',
};

export const translationsState: TranslationStateFixture = {
  translations: {
    defaultLocale: 'en',
    fallbackLocale: 'en',
    substituteLocale: 'es',
    availableLocales: ['en', 'es'],
    texts: {
      en: englishDicts,
    },
  },
};

export const translationsStateWithEsDict: TranslationStateFixture = {
  translations: {
    defaultLocale: 'en',
    fallbackLocale: 'en',
    substituteLocale: 'es',
    availableLocales: WEBPACK__AVAILABLE_CULTURE_CODES as [Locale],
    texts: {
      en: englishDicts,
      es: españolDicts,
    },
  },
};

export const translationsStateWithSampleEnDict: TranslationStateFixture = {
  translations: {
    defaultLocale: 'en',
    fallbackLocale: 'en',
    substituteLocale: 'es',
    availableLocales: WEBPACK__AVAILABLE_CULTURE_CODES as [Locale],
    texts: {
      en: englishDicts,
    },
  },
};

export const frIntlLocaleState = {
  intl: {
    locale: 'fr',
    messages: {
      key: 'Voici la traduction',
    },
  },
};

export const sampleState: TranslationStateFixture = {
  translations: {
    defaultLocale: 'es-XL',
    fallbackLocale: 'es',
    substituteLocale: 'es',
    availableLocales: ['en', 'es', 'es-XL'],
    texts: {
      en: englishDicts,
    },
  },
};
