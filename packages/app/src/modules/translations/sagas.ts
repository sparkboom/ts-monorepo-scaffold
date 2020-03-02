import { takeEvery, takeLatest, call, select, apply, PutEffect, SelectEffect, CallEffect, ForkEffect } from 'redux-saga/effects';
import flat from 'flat';
import { isEmpty } from 'lodash-es';
import { updateIntl } from 'react-intl-redux';
import IntlMessageFormat from 'intl-messageformat';
import { Action } from 'redux';
import { ClientWebApi } from '@adstudio-leadcap/api';
import { setTranslations } from './actions';
import { fail, warn } from '../Logging/actions';
import { putContext } from '../Logging/effects';
import { getWebApi } from '../Api/sagas';
import {
  substituteTranslationsSelector,
  fallbackLocaleSelector,
  availableLocalesSelector,
  currentLocaleSelector,
  downloadedLocalesSelector,
  textsSelector,
  messagesSelector,
} from './selectors';
import { Locale, TextsDict, TextsCollection, TextEntry } from './types';

// NOTE:  Official cultures translated in Marketing Cloud are de, en, es-xl, es, fr-ca, fr, it, ja, pt,  and dev language

// Constants
const LOG_CTX = 'CONTENT.SAGAS';

// Types
type MatchLocaleSaga = Generator<SelectEffect | PutEffect<Action<any>>, any, unknown>;
type LoadTranslationsSaga = Generator<SelectEffect | CallEffect<any> | PutEffect<Action<any>>, void, unknown>;
type UseTranslationsSaga = Generator<SelectEffect | PutEffect<Action<any>>, void, unknown>;
type GetTextSaga = Generator<SelectEffect | PutEffect<Action<any>>, string[], any>;
type TranslateSaga = Generator<ForkEffect<never>, void, unknown>;

// Sagas
export function* matchLocaleSaga(action: Action<any>): MatchLocaleSaga {
  const put = putContext(action, LOG_CTX);

  // Prep culture code
  const cultureCode = `${action.payload.cultureCode}`.toLowerCase() as Locale;
  if (!cultureCode || cultureCode.match(/^[a-z]{2}(-[a-z]{2})?$/g) === null) {
    yield put.fail(`Could not fetch translations as culture code '${cultureCode}' is invalid`, { cultureCode });
    return null;
  }

  // Get available locales
  const availableLocales = (yield select(availableLocalesSelector)) as Locale[];
  if (isEmpty(availableLocales)) {
    yield put.fail(`There are no available locales ${availableLocales}`, { availableLocales });
    return null;
  }

  // Return if a direct match is found
  if (availableLocales.includes(cultureCode)) {
    return cultureCode;
  }

  // Return if language family matches
  const cultureCodes = cultureCode.split('-');
  if (cultureCodes.length > 1 && availableLocales.includes(cultureCodes[0])) {
    yield put.warn(`The desired locale '${cultureCode}' is not available, but a proposed match was found '${cultureCodes[0]}'.`, {
      availableLocales,
      cultureCode,
    });
    return cultureCodes[0];
  }

  // Otherwise propose the fallback language
  const fallbackLocale = yield select(fallbackLocaleSelector);
  yield put.warn(`The desired locale '${cultureCode}' is not available, fallback locale '${fallbackLocale}' proposed instead`, { cultureCode, fallbackLocale });

  return fallbackLocale;
}

export function* loadTranslationsSaga(action: Action<any>): LoadTranslationsSaga {
  const put = putContext(action, LOG_CTX);

  const { cultureCode } = action.payload;

  const matchedLocale = (yield call(matchLocaleSaga, action)) as Locale;
  if (matchedLocale === null) {
    yield put.fail(`No locale matched the culture code '${cultureCode}'`);
    return;
  }

  const currentLocale = yield select(currentLocaleSelector);
  if (matchedLocale === currentLocale) {
    yield put.warn(`The desired locale '${matchedLocale}' is currently being used`);
    return;
  }

  const downloadedLocales = (yield select(downloadedLocalesSelector)) as Locale[];
  if (downloadedLocales && downloadedLocales.includes(matchedLocale)) {
    yield put.warn(`The desired locale '${matchedLocale}' has already been downloaded`);
    return;
  }

  const webApi = (yield call(getWebApi, action)) as ClientWebApi;
  if (!webApi) {
    return;
  }
  const translations = (yield apply(webApi, webApi[`${matchedLocale}Texts`])) as Record<string, any> | undefined;
  if (isEmpty(translations)) {
    yield put.fail(`Empty translation set was returned for locale '${matchedLocale}'. Was the API call successful.`);
    return;
  }

  const substituteTexts = (yield select(substituteTranslationsSelector)) as Record<string, any>;
  const flatTexts = flat(translations);
  const texts = {
    ...substituteTexts,
    ...flatTexts,
  };
  yield put(setTranslations(matchedLocale, texts));
}

export function* useTranslationSaga(action: AppAction<string, any>): UseTranslationsSaga {
  const put = putContext(action, LOG_CTX);

  const { locale } = action.payload;
  const texts = (yield select(textsSelector)) as TextsCollection;
  const messages = texts[locale];
  if (!messages) {
    yield put.fail(`The locale '${locale}' has not been loaded`);
    return;
  }
  yield put(updateIntl({ locale, messages }));
}

export function* getTextSaga(texts: TextEntry[], action: Action<any>): GetTextSaga {
  const messageDict = (yield select(messagesSelector)) as TextsDict;
  const locale = (yield select(currentLocaleSelector)) as Locale;
  const unmatchedTexts: string[] = [];
  const messages = texts.map(text => {
    const textTemplate = messageDict[text.key];
    if (!textTemplate) {
      unmatchedTexts.push(text.key);
      return '';
    }
    const formattedMessage = new IntlMessageFormat(textTemplate, locale).format(text.values || {});
    return formattedMessage;
  });
  if (!isEmpty(unmatchedTexts)) {
    yield putContext(action, LOG_CTX).logWarn(`${unmatchedTexts.length} text entry key(s) were not matched the texts dictionary with locale ${locale}`, {
      unmatchedTexts,
    });
  }

  return messages;
}

function* translationsSaga(): TranslateSaga {
  yield takeEvery('TRANSLATIONS__USE', useTranslationSaga);
  yield takeLatest('TRANSLATIONS__LOAD', loadTranslationsSaga);
}

export default translationsSaga;
