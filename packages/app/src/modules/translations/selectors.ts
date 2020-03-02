import { createSelector } from 'reselect';
import { get } from 'lodash-es';
import { Locale, TextsDict } from './types';

/**
 * currentLocaleSelector provides the currently used locale string, i.e 'en'
 */
export const currentLocaleSelector = (state: Partial<RootState>): Locale => get(state, 'intl.locale') as Locale;

/**
 * messagesSelector provides the currently used locale string, i.e 'en'
 */
export const messagesSelector = (state: Partial<RootState>): TextsDict => get(state, 'intl.messages') as TextsDict;

/**
 * defaultLocaleSelector provides the default locale, i.e 'en', before the locale is loaded or changed
 */
export const defaultLocaleSelector = (state: Partial<RootState>): Locale => get(state, 'translations.defaultLocale') as Locale;

/**
 * fallbackLocaleSelector provides a locale code for the language to use if the current locale is not loaded
 */
export const fallbackLocaleSelector = (state: Partial<RootState>): Locale => get(state, 'translations.fallbackLocale') as Locale;

/**
 * substituteLocaleSelector provides a locale code for the language to use when there are no matching text keys
 */
export const substituteLocaleSelector = (state: Partial<RootState>): Locale => get(state, 'translations.substituteLocale') as Locale;

/**
 * availableLocalesSelector provides a list of all available locales that can be used
 */
export const availableLocalesSelector = (state: Partial<RootState>): [Locale] => get(state, 'translations.availableLocales') as [Locale];

/**
 * textsSelector provides an associative array of laoded text dictionaries by locale code
 */
export const textsSelector = (state: Partial<RootState>): TextsDict => get(state, 'translations.texts') as TextsDict;

/**
 * downloadedLocalesSelector provides an array of locales that have been downloaded
 */
export const downloadedLocalesSelector = createSelector(
  textsSelector,
  texts => Object.keys(texts),
);

/**
 * substituteTranslationsSelector provides a texts dictionary for the substitute texts
 */
export const substituteTranslationsSelector = createSelector(
  substituteLocaleSelector,
  textsSelector,
  (substituteLocale, texts) => texts[substituteLocale],
);
