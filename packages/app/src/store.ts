import { createStore } from 'redux';
import { persistStore } from 'redux-persist';
import * as middleware from './middleware';
import createRootReducer from './modules/Root/reducers';
import rootState from './modules/Root/state';

const initialState = rootState({
  baseUrl: location.origin,
  basePath: WEBPACK__ASSET_BASE_PATH,
});

export const store = createStore(createRootReducer(middleware.route.history), initialState, middleware.apply());
export const persistor = persistStore(store);

middleware.saga.run();
