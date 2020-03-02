import reducer from '../reducers';
import * as actions from '../actions';
import { errorState, nullState } from '../__fixtures__/state';

describe('Notifications > Reducers', () => {
  describe('Initial State', () => {
    it('should return the initial state', () => {
      // Arrange
      const FAKE_EMPTY_ACTION = { type: '', payload: {}, correlationId: '' }; // empty action

      // Act
      const newState = reducer(errorState, FAKE_EMPTY_ACTION);

      // Assert
      expect(newState).toEqual(errorState);
    });
  });

  describe('Notification Show', () => {
    it('should set a notification', () => {
      // Arrange
      const showNotificationAction = actions.showNotification(
        errorState.heading || '',
        errorState.details,
        errorState.level,
        12000,
        new Date(1575163851945 - 12000),
      );

      // Act
      const newState = reducer(nullState, showNotificationAction);

      // Assert
      expect(newState).toMatchObject(errorState);
    });
  });

  describe('Notification Reset', () => {
    it('should reset the notification', () => {
      // Arrange
      const showNotificationAction = actions.resetNotification();

      // Act
      const newState = reducer(errorState, showNotificationAction);

      // Assert
      expect(newState).toMatchObject(nullState);
    });
  });
});
