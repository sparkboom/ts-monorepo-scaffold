import { expectSaga } from 'redux-saga-test-plan';
import { Action } from 'redux';
import * as sagas from '../sagas';
import * as actions from '../actions';
import { getWebApi } from '../../Api/sagas';
import { showNotificationAction, resetNotificationAction } from '../__fixtures__/actions';
import { fail, success } from '../../Logging/actions';
import { correlate } from '../../../middleware/correlate-redux-middleware';

describe('Notifcations > Sagas', () => {
  describe('showNotificationSaga', () => {
    it('should not reset the notification if triggered elsewhere', () => {
      // Arrange
      // Act
      // Assert
      return expectSaga(sagas.showNotificationSaga, showNotificationAction)
        .dispatch(resetNotificationAction)
        .provide({ race: () => [undefined, resetNotificationAction] })
        .not.put.like({ action: resetNotificationAction })
        .run();
    });

    it('should reset the notification if timeout occurs', () => {
      // Arrange
      // Act
      // Assert
      return expectSaga(sagas.showNotificationSaga, showNotificationAction)
        .dispatch(resetNotificationAction)
        .provide({ race: () => [undefined, undefined] })
        .put.like({ action: resetNotificationAction })
        .run();
    });
  });
});
