import { all, takeLatest, delay, race, take, call } from 'redux-saga/effects';
import { get } from 'lodash-es';
import { Action } from 'redux';
import { showNotification, resetNotification } from './actions';
import { putContext } from '../Logging/effects';
import { getTextSaga } from '../translations/sagas';
import { NotificationLevel } from './types';

// Constants
const LOG_CTX = 'NOTIFICATIONS.SAGAS';

// Types
type ShowNotification = ReturnType<typeof showNotification>;

// Sagas
export function* showNotificationSaga(action: ShowNotification) {
  const duration = Math.max(0, get(action, 'payload.expiryTime') - new Date().getTime() || 0);
  const [_, takeAction] = yield race([delay(duration), take('NOTIFICATION__RESET')]);

  if (!takeAction) {
    yield putContext(action, LOG_CTX)(resetNotification());
  }
}

/**
 * notifySaga
 *
 * Is a saga for convinience that can be used by other sagas. Passed text keys are translated into
 * localized text.
 *
 * @param action the current action being operated on by the sagas
 * @param headingTextKey the text key for the heading
 * @param detailsTextKey the text key for the details, optional
 * @param level the notification level, this describes the style of the notification.
 */
export function* notifySaga(
  action: Action<string>,
  headingTextKey: string,
  detailsTextKey: string | null,
  level: NotificationLevel = 'INFO',
  lifespanMs?: number,
): any {
  const put = putContext(action, LOG_CTX);
  let submittedHeading = '';
  let details = '';
  try {
    const headingTextEntry = { key: headingTextKey };
    submittedHeading = yield call(getTextSaga, [headingTextEntry], action);
    if (detailsTextKey) {
      const detailsTextEntry = { key: detailsTextKey };
      details = yield call(getTextSaga, [detailsTextEntry], action);
    }
    yield put(showNotification(submittedHeading, details, level, lifespanMs));
  } catch (err) {
    yield put.errorWarn(err);
  }
}

function* notificationSaga() {
  yield all([takeLatest('NOTIFICATION__SHOW', showNotificationSaga)]);
}

export default notificationSaga;
