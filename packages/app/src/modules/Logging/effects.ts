import { Action } from 'redux';
import { put, SimpleEffect, PutEffectDescriptor } from 'redux-saga/effects';
import { correlate } from '../../middleware/correlate-redux-middleware';
import { submitError, submitLog, success, warn, status, fail } from './actions';
import { get } from 'lodash-es';

// Types
type PutEffect<T extends Action<any>> = SimpleEffect<'PUT', PutEffectDescriptor<T>>;
interface ErrorLogPut {
  (messageError: string | Error, details?: any): PutEffect<Action<any>>;
}
interface LogPut {
  (messageError: string, details?: any): PutEffect<Action<any>>;
}
interface SuccessPut {
  (): PutEffect<Action<any>>;
}
interface FailWarnPut {
  (message?: string, details?: any): PutEffect<Action<any>>;
}
interface StatusPut {
  (statusValue: string): PutEffect<Action<any>>;
}
type PutContext = {
  (action: Action<any>): PutEffect<Action<any>>;
  error: LogPut;
  errorWarn: ErrorLogPut;
  logWarn: ErrorLogPut;
  logInfo: LogPut;
  logDebug: LogPut;
  success: SuccessPut;
  status: StatusPut;
  warn: FailWarnPut;
  fail: FailWarnPut;
};

// Effects

/**
 * `putContext` creates a selection of effects that extends redux-saga's `put` effect
 *
 * When dispatching actions with a `put` effect it is often desirable to append a
 * correlationId using the same value to an earlier action driving the current saga
 * ( the action matched by the earlier 'take' effect ). Correlating actions is
 * a similar convention used to associate log entries in logging systems.
 *
 * Typically a put effect is performed like this:
 * ```
 * const myNewAction = performAction(...actionArgs);
 * myNewAction.correlationId = action.correlationId;
 * yield put(myNewAction);
 * ```
 * Where `action` has an existing correlationId already, and is the action
 * matched earlier by a 'take' saga effect driving the current saga.
 * .
 * There is a `correlate` helper function to reduce the verbosity of this code
 * ```
 * yield put(correlate(performAction(...actionArgs), action));
 * ```
 *
 * Dispatching logs can be very verbose too.
 * ```
 * if (errorCondition === true) {
 *  yield put(
 *   correlate(
 *    submitError('WARN', LOG_CTX, 'Descriptive log message describing the unexpected situation that just happened', { variousDetails, details, moreDetails }),
 *    action,
 *   )
 *  );
 *  return;
 * }
 * ```
 *
 * This convention can be cumbersome for every put effect, this function provides a means
 * to create an equivalent put effect function that automatically correlates the action to an earlier action
 * originally driving the saga flow.
 *
 * @example
 * ```
 * // putContext used for many put effects
 * const put = putContext(action);
 * ...
 * yield put(myNewAction(...actionArgs));
 * ...
 * yield put(anotherNewAction());
 * ```
 * @example
 * ```
 * // putContext used for a single put effect
 * yield putContext(action)(myNewAction(...actionArgs));
 * ```
 * @example
 * ```
 * // syntactic sugar for logging
 * const put = putContext(action, 'LOG.SAGAS');
 * ...
 * yield put.error('Descriptive log message describing the unexpected situation that just happened', { variousDetails, details, moreDetails });
 * ```
 *
 * @param correlatedAction - is an existing action with a correlationId already, and is the action
 * matched earlier by a 'take' saga effect.
 * @param logContext - a string that represents the context for the log - typically something the resembles the filename i.e. 'TASKS.SAGAS'
 *
 * @returns an equivalent 'put' saga effect function that automatically assigns the same correlationId provided by the action argument. The
 * function also contains helper properties for creation of put effects for logging.
 */
export function putContext(correlatedAction: Action<any>, logContext = 'NOT_PROVIDED'): PutContext {
  function allEffects(action: Action<any>): PutEffect<Action<any>> {
    return put(correlate(action, correlatedAction));
  }
  /**
   * error
   * This function creates an error put effect, using the action and context provided in putContext
   * This effect is used for logging (i.e. to browser console or submit to remote log).
   * @param {Error|string} errMessage optional message or Error object to describe the error
   * @param {Object} details optional object that contains arbirtrary key-values relating to the error
   * @returns Put effect that expresses the error when handling an action
   */
  const error: ErrorLogPut = (errMessage, details) =>
    put(correlate(submitError('ERROR', logContext, errMessage, { ...details, ...get(errMessage, 'details') }), correlatedAction));
  /**
   * errorWarn
   * This function creates an warn put effect, using the action and context provided in putContext
   * This effect is used for logging (i.e. to browser console or submit to remote log).
   * @param {Error|string} errMessage optional message or Error object to describe the warning
   * @param {Object} details optional object that contains arbirtrary key-values relating to the warning
   * @returns Put effect that expresses a warning when handling an action
   */
  const errorWarn: ErrorLogPut = (errMessage, details) => put(correlate(submitError('WARN', logContext, errMessage, { ...details, ...get(errMessage, 'details') }), correlatedAction));
  /**
   * logWarn
   * This function creates an log put effect, using the action and context provided in putContext
   * This effect is used for logging (i.e. to browser console or submit to remote log).
   * @param {string} message optional message object to describe the warning
   * @param {Object} details optional object that contains arbirtrary key-values relating to the warning
   * @returns Put effect that expresses a warning when handling an action
   */
  const logWarn: LogPut = (message, details) => put(correlate(submitLog('WARN', logContext, message, details), correlatedAction));
  /**
   * logInfo
   * This function creates an log put effect, using the action and context provided in putContext
   * This effect is used for logging (i.e. to browser console or submit to remote log).
   * @param {string} message optional message object to describe the event
   * @param {Object} details optional object that contains arbirtrary key-values relating to the event
   * @returns Put effect that expresses some useful information when handling an action
   */
  const logInfo: LogPut = (message, details) => put(correlate(submitLog('INFO', logContext, message, details), correlatedAction));
  /**
   * logDebug
   * This function creates an log put effect, using the action and context provided in putContext
   * This effect is used for logging (i.e. to browser console or submit to remote log).
   * @param {string} message optional message object to describe the event
   * @param {Object} details optional object that contains arbirtrary key-values relating to the event
   * @returns Put effect that expresses some verbose information when handling an action
   */
  const logDebug: LogPut = (message, details) => put(correlate(submitLog('DEBUG', logContext, message, details), correlatedAction));
  /**
   * success
   * This function creates a success put effect, using the action provided in putContext
   * @returns Put effect that expresses the successful completion of an action
   */
  const successEffect: SuccessPut = () => put(success(correlatedAction));
  /**
   * status
   * This function creates a status put effect, using the action provided in putContext
   * @param {any} statusValue any custom value that would describe the status or progress of an action's process
   * @returns Put effect that expresses the status/progress of an action
   */
  const statusEffect: StatusPut = statusValue => put(status(correlatedAction, statusValue));
  /**
   * warn
   * This function creates a warn put effect, using the action provided in putContext
   * @param {any} message optional message to describe the reason for the warning
   * @param {Object} details optional object that contains arbirtrary key-values relating to the warning
   * @returns Put effect that expresses a warning of an action
   */
  const warnEffect: FailWarnPut = (message, details) => put(warn(correlatedAction, message, details));
  /**
   * fail
   * This function creates a fail put effect, using the action provided in putContext
   * @param {any} message optional message to describe the reason for the failure of the action
   * @param {Object} details optional object that contains arbirtrary key-values relating to the failure
   * @returns Put effect that expresses a failure of an action
   */
  const failEffect: FailWarnPut = (message, details) => put(fail(correlatedAction, message, details));

  Object.assign(allEffects, {
    error,
    errorWarn,
    logWarn,
    logInfo,
    logDebug,
    success: successEffect,
    status: statusEffect,
    warn: warnEffect,
    fail: failEffect,
  });

  return allEffects as PutContext;
}
