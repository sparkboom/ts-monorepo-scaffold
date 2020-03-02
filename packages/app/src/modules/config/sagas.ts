import { takeLatest, all, apply, call, select } from 'redux-saga/effects';
import { ClientWebApi, ClientQueryApi, ApiCapabilities } from '@adstudio-leadcap/api';
import { Action } from 'redux';
import { get } from 'lodash-es';
import { setConfig, setFeatureToggles } from './actions';
import { correlate } from '../../middleware/correlate-redux-middleware/index';
import { status, success, fail, submitError } from '../Logging/actions';
import { Platform } from './types';
import { getWebApi, getQueryApi } from '../Api/sagas';
import { putContext } from '../Logging/effects';

// Constants
const LOG_CTX = 'CONFIG.SAGAS';

// Sagas
export function* loadConfigSaga(action: Action<any>, global: any = window) {
  const put = putContext(action, LOG_CTX);

  // 1. Set config set-up to 'in progress'
  yield put(status(action, 'IN_PROGRESS'));

  // 2. Get Web API client
  const webApi = yield call(getWebApi, action);
  if (!webApi) {
    // TODO: display toast to notify
    yield put(fail(action));
    return;
  }

  // 3. Load configuration file
  const config = yield apply(webApi, webApi.config, []);
  if (config) {
    yield put(setConfig(config));
  } else {
    yield put.errorWarn('Configuration could not be downloaded');
    // TODO: provide error reason status
    yield put(fail(action));
    return;
  }

  // 4. Get Query API client
  const queryApi = yield call(getQueryApi, action);
  if (!queryApi) {
    // TODO: display toast to notify
    yield put(fail(action));
    return;
  }

  // 5. Store Platform
  if (global === global.top) {
    yield put(setConfig({ platform: 'STAND_ALONE' }));
  } else {
    // TODO: Capabilities endpoint is perhaps overkill unless they are permissions checks, can we pass 'platform' property from log-in endpoint?
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const capabilities: ApiCapabilities = yield apply(queryApi, queryApi.getCapabilities, []);
    let platform = 'UNKNOWN';
    if (get(capabilities, 'leadIngestionTask.destination.marketingCloud.dataExtension') === true) {
      platform = 'MARKETING_CLOUD';
    } else if (get(capabilities, 'leadIngestionTask.destination.salesCloud.leadObject') === true) {
      platform = 'SALES_CLOUD';
    }

    yield put(setConfig({ platform }));

    if (platform === 'UNKNOWN') {
      yield put.errorWarn('Platform could not be determined (i.e. neither MARKETING_CLOUD nor SALES_CLOUD )');
      yield put(fail(action));
      return;
    }
  }

  // 7. Mark config load a successful
  yield put(success(action));
}

export function* loadFeatureTogglesSaga(action: Action<any>) {
  const put = putContext(action, LOG_CTX);

  const webApi = yield call(getWebApi, action);
  if (!webApi) {
    return;
  }
  const featureToggles = yield apply(webApi, webApi.featureToggles, []);
  if (featureToggles) {
    yield put(setFeatureToggles(featureToggles));
  }
}

function* configSaga() {
  yield all([takeLatest('CONFIG__LOAD', loadConfigSaga), takeLatest('CONFIG__FEATURE_TOGGLES_LOAD', loadFeatureTogglesSaga)]);
}

export default configSaga;
