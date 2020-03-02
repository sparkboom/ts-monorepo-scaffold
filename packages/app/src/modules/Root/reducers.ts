import { connectRouter } from 'connected-react-router';
import { persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';
import { History } from 'history';
import { combineReducers, Reducer, ReducersMapObject, AnyAction } from 'redux';
import { intlReducer } from 'react-intl-redux';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import apiReducer from '../Api/reducers';
import appReducer from '../App/reducers';
import configReducer from '../config/reducers';
import contentReducer from '../Content/reducers';
import mcaccountReducer from '../MCAccount/reducers';
import tasksReducer from '../Tasks/reducers';
import translationsReducer from '../translations/reducers';
import notificationReducer from '../Notification/reducers';

// Reducers
const persistConfig = {
  key: 'leadcapture',
  storage: sessionStorage,
  whitelist: ['api'],
};

export default (history: History): Reducer<RootState & PersistPartial, AnyAction> => {
  const reducers: ReducersMapObject<RootState, AnyAction> = {
    api: apiReducer,
    app: appReducer,
    config: configReducer,
    content: contentReducer,
    intl: intlReducer,
    mcaccount: mcaccountReducer,
    notification: notificationReducer,
    router: connectRouter(history),
    tasks: tasksReducer,
    translations: translationsReducer,
  };

  const rootReducer: Reducer<RootState, AnyAction> = combineReducers(reducers);
  return persistReducer(persistConfig, rootReducer);
};
