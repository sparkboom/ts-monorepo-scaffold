/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/unbound-method */
import StackTrace from 'stacktrace-js';
import { call, SimpleEffect, CallEffectDescriptor, takeEvery, select, apply, SelectEffectDescriptor } from 'redux-saga/effects';
import { ClientCmdApi } from '@adstudio-leadcap/api';
import { SubmitLogAction, SubmitErrorAction } from './actions';
import { commandApiSelector } from '../Api/selectors';
import { LogLevel } from './types';

// Constants
const LOG_MAP = {
  NO_LOG: 1,
  ERROR: 2,
  WARN: 3,
  INFO: 4,
  DEBUG: 5,
};
const BROWSER_LOG_LEVEL = LOG_MAP.INFO;
const SERVICE_LOG_LEVEL = LOG_MAP.WARN;
const APP_CONTACT = 'LEADCAP';
const INITIAL_TIMESTAMP = new Date().getTime();
const MAX_STACK_TRACE_LENGTH = 4000;

// Types
type CallEffect = SimpleEffect<'CALL', CallEffectDescriptor<any>>;
type SelectEffect = SimpleEffect<'Select', SelectEffectDescriptor>;
type LogSaga = Generator<CallEffect | SelectEffect, void, StackTrace.StackFrame[] & ClientCmdApi>;
interface TimeStamp {
  longUtc: string;
  shortLocal: string;
  msSinceLaunch: string;
}
interface BrowserLogger {
  (
    timeStamp: TimeStamp,
    level: LogLevel,
    context: string,
    message: string | null,
    stackTrace: StackTrace.StackFrame[] | null,
    details: any[],
    logger?: ConsoleLogger,
  ): void;
}
interface ServiceLogger {
  (timeStamp: TimeStamp, level: LogLevel, context: string, message: string | null, stackTrace: StackTrace.StackFrame[] | null, details: any[]): Generator<
    any,
    any,
    any
  >;
}

/**
 * formatNumber
 *
 * Formats numbers using english/american format using a comma as dividing character.
 * Useful when formatting without locale requirements, such as logging.
 */
function formatNumber(num: number): string {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

/**
 * getTimeStamp
 *
 * Converts a passed date to various formats for logging
 * - long UTC is useful for logging to a service
 * - shortLocal is useful for logging to local browser console
 * - msSinceLaunch is useful for monitoring performance and sorting log entries
 */
export function getTimeStamp(date: Date = new Date()): TimeStamp {
  const dateStr = {
    longUtc: '',
    shortLocal: '',
    msSinceLaunch: '',
  };
  try {
    dateStr.longUtc = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}.${date.getUTCMilliseconds()}`;
    dateStr.shortLocal = `${date
      .getFullYear()
      .toString()
      .substring(2)}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
    dateStr.msSinceLaunch = `+${formatNumber(new Date().getTime() - INITIAL_TIMESTAMP)} ms`;
  } catch (err) {
    console.error('Could not format current date', date);
  }
  return dateStr;
}

/**
 * logToConsole
 *
 * Formats all arguments consistently to produce a console log, and provide a collapsed content to display further details
 */
export const logToConsole: BrowserLogger = (timeStamp, level, context, message, stackTrace, details, logger = console) => {
  const log = {
    ERROR: logger.error,
    WARN: logger.warn,
    INFO: logger.info,
    DEBUG: logger.debug,
  }[level];

  log(`${timeStamp.shortLocal} ${APP_CONTACT}.${context}: ${message}`, details, stackTrace);
};

/**
 * logToService
 *
 * Formats all arguments consistently to produce a console log, and provide a collapsed content to display further details
 */
// eslint-disable-next-line func-names
export const logToServiceSaga: ServiceLogger = function*(timeStamp, level, context, message, stackTrace, details) {
  const cmdApi = yield select(commandApiSelector);
  if (!cmdApi) {
    return;
  }
  try {
    const payload = {
      body: {
        message,
        context,
        level,
        timeStamp: timeStamp.longUtc,
        stackTrace: `${stackTrace}`.substring(0, MAX_STACK_TRACE_LENGTH),
        details,
      },
    };
    yield apply(cmdApi, cmdApi.saveFrontEndLog, [payload]);
  } catch (err) {
    // Fallback
    console.error(err);
  }
};

// Sagas

/**
 * loggingSaga
 *
 * A worker saga that will log to the console if the log level matches the BROWSER_LOG_LEVEL or higher
 * and also submits the log to the frontEndLog endpoint if the level matches the LOGGER_LOG_LEVEL or higher
 */
export function* logSaga(action: SubmitLogAction | SubmitErrorAction, browserLogLevel = BROWSER_LOG_LEVEL, serviceLogLevel = SERVICE_LOG_LEVEL): LogSaga {
  try {
    let stackTrace: StackTrace.StackFrame[] | null = null;
    if (action.type === 'LOGGING__ERROR_SUBMIT') {
      stackTrace = yield call([StackTrace, StackTrace.fromError], action.payload.error);
    }
    const { level, message, context, date, details } = action.payload;

    const logLevelScalar = LOG_MAP[level];
    const ts = yield call(getTimeStamp, date);

    if (logLevelScalar <= browserLogLevel) {
      yield call(logToConsole, ts, level, context, message, stackTrace, details);
    }

    if (logLevelScalar <= serviceLogLevel) {
      yield call(logToServiceSaga, ts, level, context, message, stackTrace, details);
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * loggingSaga
 *
 * The root saga for the Logging module
 */
export default function* loggingSaga() {
  yield takeEvery(['LOGGING__SUBMIT', 'LOGGING__ERROR_SUBMIT'], logSaga);
}
