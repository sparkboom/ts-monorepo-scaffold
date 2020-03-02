import {
  call,
  delay,
  apply,
  select,
  take,
  SimpleEffect,
  TakeEffectDescriptor,
  PutEffectDescriptor,
  SelectEffectDescriptor,
  CallEffectDescriptor,
  takeLatest,
  ForkEffectDescriptor,
} from 'redux-saga/effects';
import { Action } from 'redux';
import { get } from 'lodash-es';
import { ClientCmdApi, ClientQueryApi, ClientWebApi } from '@%%APP_NAME%%/api';
import { apiSetToken } from './actions';
import { querySelector, commandApiSelector, queryApiSelector, webApiSelector } from './selectors';
import { putContext } from '../Logging/effects';
import { NOTIFICATION__XTRA_LONG_EXPIRY_MS, NOTIFICATION__LONG_EXPIRY_MS } from '../Notification/actions';
import { DetailedError } from '../../common/detailedError';
import { isToken } from './types';
import { notifySaga } from '../Notification/sagas';

// Constants
export const LOG_CTX = 'API.SAGAS';
export const MIN_QUEUE_MSECS = 10000;
export const JWT_EXPIRY_BUFFER_SECS = 300;
export const MS_IN_SECONDS = 1000;
export const OBFUSCATE_TOKEN_VISIBLE_CHARS = 8;
export const ERR__TOKEN_REFRESH_TERMINATED = 'Token refresh cycle permenantly terminated.';

// Types
interface Token {
  jwt: string;
  expiryTimeStamp: number;
  expiresInSeconds: number;
}
interface TokenFromApi {
  authToken: string;
  expiresInSeconds: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GeneratorNextAny = any;
type TakeEffect = SimpleEffect<'TAKE', TakeEffectDescriptor>;
type PutEffect = SimpleEffect<'PUT', PutEffectDescriptor<any>>;
type CallEffect = SimpleEffect<'CALL', CallEffectDescriptor<any>>;
type SelectEffect = SimpleEffect<'SELECT', SelectEffectDescriptor>;
type ForkEffect = SimpleEffect<'FORK', ForkEffectDescriptor<never>>;
type ApiInitSaga = Generator<TakeEffect | PutEffect | CallEffect | SelectEffect, void, GeneratorNextAny>;
type ApiSaga = Generator<ForkEffect, void, unknown>;
type RefreshTokenSaga = Generator<SelectEffect | CallEffect | PutEffect, Token | null, GeneratorNextAny>;
type GetQueryApiSaga = Generator<SelectEffect | PutEffect, ClientQueryApi | null, GeneratorNextAny>;
type GetCommandApiSaga = Generator<SelectEffect | PutEffect, ClientCmdApi | null, GeneratorNextAny>;
type GetWebApiSaga = Generator<SelectEffect | PutEffect, ClientWebApi | null, GeneratorNextAny>;
type GetSessionTokenSaga = Generator<PutEffect, Token | null, unknown>;

// Helpers
export function createToken(jwt: string | null, expiresInSeconds: string | number, date: Date | undefined = new Date()): Token | null {
  if (!jwt) {
    return null;
  }
  const expiresInSecondsNum = Number(expiresInSeconds);
  const expiryDate = date;
  expiryDate.setSeconds(expiryDate.getSeconds() + (expiresInSecondsNum || 0));
  return {
    jwt,
    expiryTimeStamp: expiryDate.getTime(),
    expiresInSeconds: expiresInSecondsNum,
  };
}

/* we're passing optional DateTime so we can easily test the function */
/**
 * getSecondsRemaining calculates the time remaining in seconds, of the timestamp provided.
 *
 * @param expiryTimeStamp - represents the number of milliseconds since the Unix epoch. This value can represent the past, present or future.
 * @param DateTime - the Date class. This parameter promotes easier unit testing.
 * @returns total seconds difference between now and the expiryTimeStamp, a negative value represents reflects a timestamp in the past,
 * and a positive value representing a future time.
 */
export function getSecondsRemaining(expiryTimeStamp: number, DateTime = Date): number {
  const nowTimeStamp = new DateTime().getTime();
  const deltaMilliseconds = expiryTimeStamp - nowTimeStamp;
  return deltaMilliseconds / MS_IN_SECONDS;
}

// obfuscateToken is used for logging
function obfuscateToken(token: Token | null): { obfuscatedToken: Token; summary: string } | null {
  if (!token) {
    return null;
  }
  const obfuscatedToken = { ...token };
  const hiddenCharLength = Math.max(2, obfuscatedToken.jwt.length - OBFUSCATE_TOKEN_VISIBLE_CHARS);
  const visibleTokenChars = obfuscatedToken.jwt.substr(hiddenCharLength);
  obfuscatedToken.jwt = '*'.repeat(hiddenCharLength) + visibleTokenChars;
  const summary = `token=*${visibleTokenChars}, ts=${obfuscatedToken.expiryTimeStamp}, expires=${obfuscatedToken.expiresInSeconds}`;
  return {
    obfuscatedToken,
    summary,
  };
}
export const refreshTokenDelayMsFromExpiry = (expiresInSeconds: number): number =>
  Math.max(MIN_QUEUE_MSECS, (expiresInSeconds - JWT_EXPIRY_BUFFER_SECS) * MS_IN_SECONDS);

// Sagas
export function* refreshTokenSaga(action: Action<string>): RefreshTokenSaga {
  const put = putContext(action, LOG_CTX);
  try {
    yield put.logDebug(`Token refresh start`);

    // 1. Get Cmd API
    const cmdApi = (yield select(commandApiSelector)) as ClientCmdApi | null;
    if (!cmdApi) {
      throw new DetailedError('Token Refresh Failed. Command API unavailable', { cmdApi });
    }

    // 2. Refresh Token
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const rawToken: TokenFromApi | null = yield apply(cmdApi, cmdApi.authenticationRefreshToken, []);
    if (!rawToken) {
      throw new DetailedError('Token Refresh Failed. No valid token received from API refresh call.', { rawToken });
    }

    // 3. Transform Token
    const newToken: Token | null = yield call(createToken, rawToken.authToken, rawToken.expiresInSeconds);
    if (!newToken || !newToken.jwt) {
      throw new DetailedError('Token Refresh Failed. Token is possibly invalid.', { rawToken, newToken });
    }

    // 4. Store New Token
    yield put(apiSetToken(newToken.jwt, newToken.expiryTimeStamp));
    const obfuscatedToken = obfuscateToken(newToken);
    yield put.logInfo(`API Token successfully updated. ${obfuscatedToken && obfuscatedToken.summary}`, {
      token: obfuscatedToken && obfuscatedToken.obfuscatedToken,
    });
    if (sessionStorage) {
      sessionStorage.setItem('jwt', newToken.jwt);
      sessionStorage.setItem('expires', `${newToken.expiryTimeStamp}`);
    }

    return newToken;
  } catch (error) {
    yield put.errorWarn(error);
    yield call(
      notifySaga,
      action,
      'common.notifications.sessionRefreshFailed.heading',
      'common.notifications.sessionRefreshFailed.details',
      'ERROR',
      NOTIFICATION__XTRA_LONG_EXPIRY_MS,
    );
  }

  return null;
}

/**
 * getSessionTokenSaga obtains the available tokens from session storage, one from V1 FE app, the other from V2 FE app
 * It will compare the two and use the one that expires last, thus assuming it is the most recently retrieved token.
 *
 * When V1 FE has been retired, then we can remove this complication, and simply use 'yield select(tokenSelector)'
 *
 * @param action - triggering action for the saga
 * @param currentV2Token - we already have this value, so we'll pass it instead of retrieving it
 * @param global - typically represents the global window object. Providing the value as an argument allows this generator to be tested
 */
export function* getSessionTokenSaga(action: Action<string>, currentV2Token: Token | null, global: Window & typeof globalThis = window): GetSessionTokenSaga {
  const put = putContext(action, LOG_CTX);
  let preferredToken: Token | null = null;

  // 1. Construct V2 Token via redux-persist
  if (currentV2Token) {
    // eslint-disable-next-line no-param-reassign
    currentV2Token.expiresInSeconds = getSecondsRemaining(currentV2Token.expiryTimeStamp);
  }

  // 2. Get V1 Token via session storage if available and valid
  let currentV1Token: Token | null = null;
  const { sessionStorage } = global;
  if (sessionStorage) {
    const jwtV1 = sessionStorage.getItem('jwt');
    const expiresV1 = Number(sessionStorage.getItem('expires'));
    if (jwtV1 && expiresV1 && !Number.isNaN(expiresV1)) {
      currentV1Token = {
        jwt: jwtV1,
        expiryTimeStamp: expiresV1,
        expiresInSeconds: getSecondsRemaining(expiresV1),
      };
    }
  }

  // 3. Choose preferred token with the latter expiry
  if (!currentV1Token && currentV2Token) {
    preferredToken = currentV2Token;
  } else if (!currentV2Token && currentV1Token) {
    preferredToken = currentV1Token;
  } else if (currentV2Token && currentV1Token) {
    preferredToken = currentV1Token.expiryTimeStamp > currentV2Token.expiryTimeStamp ? currentV1Token : currentV2Token;
  } else {
    return null;
  }

  // 4. Ensure both V1 and V2 formats are the preferred token
  yield put(apiSetToken(preferredToken.jwt, preferredToken.expiryTimeStamp));
  if (sessionStorage) {
    sessionStorage.setItem('jwt', preferredToken.jwt);
    sessionStorage.setItem('expires', `${preferredToken.expiryTimeStamp}`);
  }

  return preferredToken;
}

export function* apiInitSaga(action: Action<string>, global: Window & typeof globalThis = window): ApiInitSaga {
  const put = putContext(action, LOG_CTX);
  try {
    // 1. Ensure redux-persist has rehydrated
    const persistState = yield take('persist/REHYDRATE');

    // 2. Set JWT app check to in-progress
    yield put.status('IN_PROGRESS');

    // 3. Choose token
    const searchQueries: Record<string, string> = yield select(querySelector);
    const queryToken = searchQueries ? createToken(searchQueries.jwt, searchQueries.expiresInSeconds) : null;
    let token: Token | null = null;

    debugger;

    if (isToken(queryToken)) {
      // 3a. Load token from query parameters
      // This token takes precedence, it happens on the initial redirect from the login endpoint

      // Store token in session storage in v1 & v2 format
      yield put(apiSetToken(queryToken.jwt, queryToken.expiryTimeStamp));
      if (sessionStorage) {
        sessionStorage.setItem('jwt', queryToken.jwt);
        sessionStorage.setItem('expires', `${queryToken.expiryTimeStamp}`);
      }

      // Remove query parameters, without pushing an entry in the browser navigation stack.
      const { history, document, location } = global;
      history.replaceState({}, document.title, location.origin + location.pathname);

      token = queryToken;
    } else {
      // 3b. Get most recent token from session storage - this could be v1 or v2 format
      // This happens when the user navigates using the back button, refreshes the frame, or redirects from the v1 app.
      const v2Token: Token | null = get(persistState, 'payload.api.token', null);
      token = yield* getSessionTokenSaga(action, v2Token);
    }

    // If there is no token in session storage, we cannot continue.
    if (!token) {
      throw new DetailedError('Session failed. No token found in querystring or session storage.');
    }

    // 4. Mark Token Check as success
    yield put.success();

    // 5. Token Refresh Cycle
    while (token !== null) {
      const refreshDelayMs = refreshTokenDelayMsFromExpiry(token.expiresInSeconds);
      yield put.logDebug(`Token refresh cycle started. Time until next refresh ${refreshDelayMs}ms`, {
        expiryTimeStamp: token.expiryTimeStamp,
        expiresInSeconds: token.expiresInSeconds,
      });

      yield delay(refreshDelayMs);
      token = (yield call(refreshTokenSaga, action)) as Token | null;
    }

    yield put.error(ERR__TOKEN_REFRESH_TERMINATED);
    yield call(
      notifySaga,
      action,
      'common.notifications.sessionTerminated.heading',
      'common.notifications.sessionTerminated.details',
      'ERROR',
      NOTIFICATION__LONG_EXPIRY_MS,
    );
  } catch (err) {
    yield put.error(err);
    yield call(
      notifySaga,
      action,
      'common.notifications.sessionFailed.heading',
      'common.notifications.sessionFailed.details',
      'ERROR',
      NOTIFICATION__XTRA_LONG_EXPIRY_MS,
    );
  } finally {
    yield put.fail();
  }
}

export function* getQueryApi(action: Action<any>): GetQueryApiSaga {
  const put = putContext(action, LOG_CTX);
  const queryApi: ClientQueryApi | null = yield select(queryApiSelector);

  if (!queryApi) {
    yield put.errorWarn('Query API could not be retrieved');
    return null;
  }

  return queryApi;
}

export function* getCommandApi(action: Action<any>): GetCommandApiSaga {
  const put = putContext(action, LOG_CTX);
  const commandApi: ClientCmdApi | null = yield select(commandApiSelector);

  if (!commandApi) {
    yield put.errorWarn('Command API could not be retrieved');
    return null;
  }

  return commandApi;
}

export function* getWebApi(action: Action<any>): GetWebApiSaga {
  const put = putContext(action, LOG_CTX);
  const webApi: ClientWebApi | null = yield select(webApiSelector);
  if (!webApi) {
    yield put.errorWarn('Web API could not be created');
    return null;
  }
  return webApi;
}

export default function* apiSaga(): ApiSaga {
  yield takeLatest('API__INIT', apiInitSaga);
}
