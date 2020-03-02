import flat from 'flat';
import { Locale, TextsDict } from './types';
import enRaw from '../../../static/texts/en.json';

// Types
export interface TranslationsState {
  defaultLocale: Locale;
  fallbackLocale: Locale;
  substituteLocale: Locale;
  availableLocales: [Locale];
  texts: {
    [key in Locale]?: TextsDict;
  };
}

// State
const en: TextsDict = flat(enRaw);
const translationsState: TranslationsState = {
  // the initial locale on load
  defaultLocale: 'en',
  // the locale to use if language is not supported
  fallbackLocale: 'en',
  // the locale to use if there are missing translations
  substituteLocale: 'en',
  // all locales that are in the texts folder. AVAILABLE_LOCALES is a global constant injected by webpack.
  availableLocales: WEBPACK__AVAILABLE_CULTURE_CODES as [Locale],
  // collections of translations loaded locally
  texts: {
    en,
  },
};

export default translationsState;
