import { all, takeLatest, SimpleEffect, PutEffectDescriptor, ForkEffectDescriptor, select } from 'redux-saga/effects';
import { Action } from 'redux';
import { CombinatorEffect } from '@redux-saga/types';
import { appSetCheckStatus } from './actions';
import { initTasks } from '../Tasks/actions';
import { loadContent } from '../Content/actions';
import { loadConfig, loadFeatureToggles } from '../config/actions';
import './types.ts';
import { isAppReadySelector } from './selectors';
import { apiInit } from '../Api/actions';
import { putContext } from '../Logging/effects';

// Constants
const LOG_CTX = 'APP.SAGAS';

// Types
type PutEffects = SimpleEffect<'PUT', PutEffectDescriptor<any>>;
type AllEffects = CombinatorEffect<'ALL', PutEffects>;
type AppInitSaga = Generator<AllEffects | PutEffects, void, void>;
type ForkEffect = SimpleEffect<'FORK', ForkEffectDescriptor<any>>;
type AppSaga = Generator<ForkEffect, void, void>;

// Sagas
export function* appInitSaga(action: Action<'APP__INIT'>): AppInitSaga {
  const put = putContext(action, LOG_CTX);

  yield all([
    put(appSetCheckStatus('config', 'APP_CHECK__IN_PROGRESS')), // TODO: move this to reducers
    put(loadConfig()),
    put(loadContent()),
    put(loadFeatureToggles()),
    put(apiInit()),
  ]);
}

export function* appLoadSaga(action: Action<'APP__SET_CHECK_STATUS'>): any {
  const put = putContext(action, LOG_CTX);

  const isAppReady = yield select(isAppReadySelector);
  if (isAppReady) {
    yield put(initTasks());
  }
}

function* appSaga(): AppSaga {
  yield takeLatest('APP__INIT', appInitSaga);
  yield takeLatest(['API__INIT_SUCCESS', 'CONFIG__LOAD_SUCCESS'], appLoadSaga);
}

export default appSaga;
