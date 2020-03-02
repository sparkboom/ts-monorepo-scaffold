import { takeLatest, call, apply, SimpleEffect, CallEffectDescriptor, PutEffectDescriptor } from 'redux-saga/effects';
import { Action } from 'redux';
import { ClientWebApi } from '@adstudio-leadcap/api';
import { setContent } from './actions';
import { Content } from './types';
import { getWebApi } from '../Api/sagas';
import { putContext } from '../Logging/effects';

// Constants
const LOG_CTX = 'CONTENT.SAGAS';

// Types
type CallEffect = SimpleEffect<'CALL', CallEffectDescriptor<any>>;
type PutEffect = SimpleEffect<'PUT', PutEffectDescriptor<Action<any>>>;
type LoadContentSaga = Generator<CallEffect | PutEffect, void, unknown>;

// Sagas
export function* loadContentSaga(action: Action<any>): LoadContentSaga {
  const put = putContext(action, LOG_CTX);

  try {
    const webApi = (yield call(getWebApi, action)) as ClientWebApi;
    if (!webApi) {
      yield put.errorWarn('The Web API client could not be retrieved');
      yield put.fail();
      return;
    }
    const content = (yield apply(webApi, webApi.content, [])) as Content;
    if (!content) {
      yield put.errorWarn('The content could not be loaded');
      yield put.fail();
      return;
    }

    yield put(setContent(content));
    yield put.success();
  } catch (err) {
    yield put.error(err);
    yield put.fail();
  }
}

export function* contentSaga() {
  yield takeLatest('CONTENT__LOAD', loadContentSaga);
}

export default contentSaga;
