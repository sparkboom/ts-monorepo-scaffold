/* eslint-disable no-nested-ternary */
/**
 *  Correlate Redux Middleware
 *
 *  This middleware provides a means of associating actions together using an automatically-generated
 *  correlationId property
 *
 *  The middleware will generate and apply a correlation id if there isn't one automatically. Ideally this
 *  middleware should be positioned as early as possible in the Redux middleware chain
 *
 *  The correlate function is a helper function that decorates an existing action with a correlation id of a
 *  previously related action or correlation id (if it is a string). This can be used in sagas when using 'put'
 *  to associate subsequent actions with the previous influencing action.
 */
import { isString } from 'lodash-es';
import shortid from 'shortid';
import { Action } from 'redux';

// Types
export interface CorrelatedAction {
  correlationId?: string;
}

// Middleware

/**
 * createCorrelateMiddleware adds a correlation id to actions to help reasoning, debugging and development
 * @returns (Function) Curried store, next, and action middleware functions
 */
export const createCorrelateMiddleware = () => (/* store */) => next => action => {
  const newAction = {
    ...action,
    correlationId: action.correlationId || shortid.generate(),
  };
  return next(newAction);
};

// Helper Functions

/**
 * correlate appends a correlation id to the new action, from the correlated object if one exists
 * @param {*} newAction
 * @param {*} correlatedObject
 */
export const correlate = (newAction: Action<any>, correlatedObject: (Action<any> & CorrelatedAction) | string) => ({
  ...newAction,
  correlationId: isString(correlatedObject) ? correlatedObject : correlatedObject ? correlatedObject.correlationId || shortid.generate() : shortid.generate(),
});
