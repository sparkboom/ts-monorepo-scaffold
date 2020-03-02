import { applyMiddleware, StoreEnhancer } from 'redux';
import * as dev from './dev';
import * as log from './log';
import * as correlate from './correlate';
import * as route from './route';
import * as saga from './saga';
import * as konsole from './console';

export { correlate, dev, log, route, saga };

const middleware = [correlate.middleware, route.middleware, saga.middleware, konsole.middleware];

// WEBPACK__IS_PROD created by Webpack's DefinePlugin
declare const WEBPACK__IS_PROD: boolean;

// Allow an override to help with debugging production instance.
const ADSTUDIO_DEVTOOLS = (localStorage && localStorage.getItem('ADSTUDIO_DEVTOOLS')) || false;

const applyFn = WEBPACK__IS_PROD && ADSTUDIO_DEVTOOLS !== 'true' ? applyMiddleware : dev.applyMiddleware;

export const apply = (): StoreEnhancer<{}, {}> => applyFn(...middleware);
