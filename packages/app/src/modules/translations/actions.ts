/* eslint-disable import/prefer-default-export */
import { Texts, Locale, TextsDict } from './types';

// Types
type SetTranslationsPayload = {
  [key in Locale]?: TextsDict;
};
type SetTranslations = (locale: Locale, dict: Texts) => AppAction<'TRANSLATIONS__SET', SetTranslationsPayload>;

// Actions
type LoadTranslations = (cultureCode: Locale) => AppAction<'TRANSLATIONS__LOAD', { cultureCode: Locale }>;
export const loadTranslations: LoadTranslations = cultureCode => ({
  type: 'TRANSLATIONS__LOAD',
  payload: {
    cultureCode,
  },
});

export const setTranslations: SetTranslations = (locale, dict) => ({
  type: 'TRANSLATIONS__SET',
  payload: {
    [locale]: dict,
  },
});

export const useTranslations = locale => ({
  type: 'TRANSLATIONS__USE',
  payload: {
    locale,
  },
});

// TODO: Use idiomatic fail, warn actions from logging
type LoadTranslationsFail = (message: string) => AppAction<'TRANSLATIONS__LOAD_FAIL', { message: string }>;
export const loadTranslationsFail: LoadTranslationsFail = message => ({
  type: 'TRANSLATIONS__LOAD_FAIL',
  payload: {
    message,
  },
});

type LoadTranslationsWarn = (message: string) => AppAction<'TRANSLATIONS__LOAD_WARN', { message: string }>;
export const loadTranslationsWarn: LoadTranslationsWarn = message => ({
  type: 'TRANSLATIONS__LOAD_WARN',
  payload: {
    message,
  },
});

type UseTranslationsFail = (message: string) => AppAction<'TRANSLATIONS__USE_FAIL', { message: string }>;
export const useTranslationsFail: UseTranslationsFail = message => ({
  type: 'TRANSLATIONS__USE_FAIL',
  payload: {
    message,
  },
});
