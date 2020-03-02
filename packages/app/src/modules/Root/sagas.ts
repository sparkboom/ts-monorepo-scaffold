import { all, fork, SimpleEffect, ForkEffectDescriptor, AllEffect } from 'redux-saga/effects';
import apiSaga from '../Api/sagas';
import appSaga from '../App/sagas';
import configSaga from '../config/sagas';
import contentSaga from '../Content/sagas';
import loggingSaga from '../Logging/sagas';
import mcSaga from '../MCAccount/sagas';
import notificationSaga from '../Notification/sagas';
import taskSaga from '../Tasks/sagas/sagas';
import translationsSaga from '../translations/sagas';

// Types
type ForkEffect = SimpleEffect<'FORK', ForkEffectDescriptor<any>>;
type RootSaga = Generator<AllEffect<ForkEffect>, void, void>;

// Sagas
function* rootSaga(): RootSaga {
  yield all([
    fork(apiSaga),
    fork(appSaga),
    fork(configSaga),
    fork(contentSaga),
    fork(loggingSaga),
    fork(mcSaga),
    fork(notificationSaga),
    fork(taskSaga),
    fork(translationsSaga),
  ]);
}

export default rootSaga;
