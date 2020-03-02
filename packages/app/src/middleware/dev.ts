import { applyMiddleware as reduxApplyMiddleware, Middleware, StoreEnhancer } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as log from './log';

const devMiddleware = [log.middleware];

export function applyMiddleware(...args: Middleware[]): StoreEnhancer {
  const middleware = [...args, ...devMiddleware];
  return composeWithDevTools(reduxApplyMiddleware(...middleware));
}
