/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action } from 'redux';
import { get } from 'lodash-es';
import { LogLevel } from './types';

// Types
type Details = any | null;
type ResponseType = 'STATUS' | 'FAIL' | 'WARN' | 'SUCCESS';
interface IssueAction<T extends string> {
  type: string;
  payload: {
    message: string | null;
    details: Details | null;
    relatedAction: Action<T>;
  };
  correlationId: string;
}
export interface SubmitLogAction {
  type: 'LOGGING__SUBMIT';
  payload: {
    level: LogLevel;
    context: string;
    message: string;
    date: Date;
    details: any[];
  };
}

export interface SubmitErrorAction {
  type: 'LOGGING__ERROR_SUBMIT';
  payload: {
    level: LogLevel;
    context: string;
    message: string | null;
    error: Error;
    date: Date;
    details: any[];
  };
}

// Sagas
const response = <T extends string>(type: ResponseType, relatedAction: Action<T>, message: string | null = null, details: Details = null): IssueAction<T> => ({
  type: `${relatedAction.type}_${type}`,
  payload: {
    message,
    details,
    relatedAction,
  },
  correlationId: `${get(relatedAction, 'correlationId')}`,
});

export const fail = <T extends string>(relatedAction: Action<T>, message = '', details: Details = null): IssueAction<T> =>
  response('FAIL', relatedAction, message, details);

export const warn = <T extends string>(relatedAction: Action<T>, message = '', details: Details = null): IssueAction<T> =>
  response('WARN', relatedAction, message, details);

export const success = <T extends string>(relatedAction: Action<T>, details: Details = null): IssueAction<T> =>
  response('SUCCESS', relatedAction, null, details);

export const status = <T extends string>(relatedAction: Action<T>, statusValue: string): IssueAction<T> =>
  response('STATUS', relatedAction, null, { status: statusValue });

export const submitError = (level: LogLevel, context: string, messageError: Error | string | null, ...details: any[]): SubmitErrorAction => {
  let error = null;
  let message = null;
  if (messageError && messageError instanceof Error) {
    error = messageError;
    message = messageError.message || 'Unknown error';
  } else {
    message = messageError || 'Unknown error';
    // We artificially create an Error object so that we can construct a stack trace later
    // This technique is supported by all browsers including IE11
    try {
      throw Error();
    } catch (err) {
      error = err;
    }
  }
  return {
    type: 'LOGGING__ERROR_SUBMIT',
    payload: {
      level,
      context,
      message,
      error,
      date: new Date(),
      details,
    },
  };
};

export const submitLog = (level: LogLevel, context: string, message: string, ...details: any[]): SubmitLogAction => ({
  type: 'LOGGING__SUBMIT',
  payload: {
    level,
    context,
    message,
    date: new Date(),
    details,
  },
});
