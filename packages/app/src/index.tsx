import 'core-js/stable';
import 'regenerator-runtime/runtime';
import ReactDOM from 'react-dom';
import React from 'react';
import { Action } from 'redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-intl-redux';
import settings from '@salesforce/design-system-react/components/settings';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { route } from './middleware';
import './modules/App/types';
import App from './modules/App/App';
import { appInit } from './modules/App/actions';
import { submitError } from './modules/Logging/actions';

// Global types
declare global {
  type Payload<P> = {
    payload: P;
  };
  type AppAction<T, P> = Action<T> & Payload<P>;
  type ActionDict = {
    [key: string]: (...args: any) => any;
  };
  type ValueOf<T extends object> = T[keyof T];
  type ActionUnion<T extends ActionDict> = ReturnType<ValueOf<T>>;
  type ActionTypeUnion<T extends ActionDict> = ReturnType<ValueOf<T>>['type'];

  // Constants generated in Webpack Define plugin.
  const WEBPACK__ASSET_BASE_PATH: string;
  const WEBPACK__AVAILABLE_CULTURE_CODES: [string];
}

// TODO: Polyfill Intl etc https://github.com/formatjs/react-intl/blob/master/docs/Getting-Started.md

// DEV CONFIG
if (module.hot) {
  module.hot.accept();
}

// Render DOM
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={route.history}>
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);

// Manage global error
const onErrorHandler: OnErrorEventHandlerNonNull = (msg, file, line, col, error) =>
  store.dispatch(submitError('ERROR', 'INDEX:WINDOW.ONERROR', error || `${msg}`, null, { file, line, col }));
window.onerror = onErrorHandler;

// Init
settings.setAppElement('#root');
store.dispatch(appInit());
