import { merge } from 'lodash-es';
import appState from '../state';
import * as selectors from '../selectors';
import { allTasksHashSelector } from '../../Tasks/selectors';
import { initialAppState } from '../__fixtures__/state';
import { Check, AllErrors, CheckStatus } from '../types';

jest.mock('../../Tasks/selectors');

const FAKE_JWT_NO_ERRORS: AllErrors[] = [];
const FAKE_TASKS_HASH = 'as2dj4yr6';

describe('App > Selectors', () => {
  describe('jwtCheckSelector', () => {
    it('should return the status of the jwt check', () => {
      // Arrange
      const check: Check = 'jwt';
      const status: CheckStatus = 'APP_CHECK__IN_PROGRESS';
      const initialState = initialAppState(check, status, FAKE_JWT_NO_ERRORS);

      // Act
      const jwtCheckStatus = selectors.jwtCheckStatusSelector(initialState);

      // Assert
      expect(jwtCheckStatus).toEqual(status);
    });
  });

  describe('configCheckStatusSelector', () => {
    it('should return the status of the configuration check', () => {
      // Arrange
      const check: Check = 'config';
      const status: CheckStatus = 'APP_CHECK__IN_PROGRESS';
      const initialState = initialAppState(check, status, FAKE_JWT_NO_ERRORS) as RootState;

      // Act
      const configCheckStatus = selectors.configCheckStatusSelector(initialState);

      // Assert
      expect(configCheckStatus).toEqual(status);
    });
  });

  describe('isAppInitializingSelector', () => {
    it('should return true if the JWT check is still in the initialized state', () => {
      // Arrange
      const initialState = merge(
        {},
        initialAppState('jwt', 'APP_CHECK__INIT', FAKE_JWT_NO_ERRORS),
        initialAppState('config', 'APP_CHECK__SUCCESS', FAKE_JWT_NO_ERRORS),
      ) as RootState;

      // Act
      const isAppInitializing = selectors.isAppInitializingSelector(initialState);

      // Assert
      expect(isAppInitializing).toBeTruthy();
    });

    it('should return true if the configuration check is still in the initialized state', () => {
      // Arrange
      const initialState = merge(
        {},
        initialAppState('jwt', 'APP_CHECK__SUCCESS', FAKE_JWT_NO_ERRORS),
        initialAppState('config', 'APP_CHECK__INIT', FAKE_JWT_NO_ERRORS),
      ) as RootState;

      // Act
      const isAppInitializing = selectors.isAppInitializingSelector(initialState);

      // Assert
      expect(isAppInitializing).toBeTruthy();
    });

    it('should return true if the JWT check is still in the `in progress` state', () => {
      // Arrange
      const initialState = merge(
        {},
        initialAppState('jwt', 'APP_CHECK__IN_PROGRESS', FAKE_JWT_NO_ERRORS),
        initialAppState('config', 'APP_CHECK__SUCCESS', FAKE_JWT_NO_ERRORS),
      ) as RootState;

      // Act
      const isAppInitializing = selectors.isAppInitializingSelector(initialState);

      // Assert
      expect(isAppInitializing).toBeTruthy();
    });

    it('should return true if the configuration check is still in the `in progress` state', () => {
      // Arrange
      const initialState = merge(
        {},
        initialAppState('jwt', 'APP_CHECK__SUCCESS', FAKE_JWT_NO_ERRORS),
        initialAppState('config', 'APP_CHECK__IN_PROGRESS', FAKE_JWT_NO_ERRORS),
      ) as RootState;

      // Act
      const isAppInitializing = selectors.isAppInitializingSelector(initialState);

      // Assert
      expect(isAppInitializing).toBeTruthy();
    });

    it('should return false if the JWT and configuration check are both in a `success` state', () => {
      // Arrange
      const initialState = merge(
        {},
        initialAppState('jwt', 'APP_CHECK__SUCCESS', FAKE_JWT_NO_ERRORS),
        initialAppState('config', 'APP_CHECK__SUCCESS', FAKE_JWT_NO_ERRORS),
      ) as RootState;

      // Act
      const isAppInitializing = selectors.isAppInitializingSelector(initialState);

      // Assert
      expect(isAppInitializing).toBeFalsy();
    });

    it('should return false if the JWT check is in a `failed` state', () => {
      // Arrange
      const initialState = merge(
        {},
        initialAppState('jwt', 'APP_CHECK__FAIL', FAKE_JWT_NO_ERRORS),
        initialAppState('config', 'APP_CHECK__SUCCESS', FAKE_JWT_NO_ERRORS),
      ) as RootState;

      // Act
      const isAppInitializing = selectors.isAppInitializingSelector(initialState);

      // Assert
      expect(isAppInitializing).toBeFalsy();
    });

    it('should return false if the configuration check is in a `failed` state', () => {
      // Arrange
      const initialState = merge(
        {},
        initialAppState('jwt', 'APP_CHECK__SUCCESS', FAKE_JWT_NO_ERRORS),
        initialAppState('config', 'APP_CHECK__FAIL', FAKE_JWT_NO_ERRORS),
      ) as RootState;

      // Act
      const isAppInitializing = selectors.isAppInitializingSelector(initialState);

      // Assert
      expect(isAppInitializing).toBeFalsy();
    });
  });

  describe('isAppReadySelector', () => {
    it('should return false if the JWT check is still in the initialized state', () => {
      // Arrange
      const initialState = merge(
        {},
        initialAppState('jwt', 'APP_CHECK__INIT', FAKE_JWT_NO_ERRORS),
        initialAppState('config', 'APP_CHECK__SUCCESS', FAKE_JWT_NO_ERRORS),
      ) as RootState;

      // Act
      const isAppReady = selectors.isAppReadySelector(initialState);

      // Assert
      expect(isAppReady).toBeFalsy();
    });

    it('should return false if the configuration check is still in the initialized state', () => {
      // Arrange
      const initialState = merge(
        {},
        initialAppState('jwt', 'APP_CHECK__SUCCESS', FAKE_JWT_NO_ERRORS),
        initialAppState('config', 'APP_CHECK__INIT', FAKE_JWT_NO_ERRORS),
      ) as RootState;

      // Act
      const isAppReady = selectors.isAppReadySelector(initialState);

      // Assert
      expect(isAppReady).toBeFalsy();
    });

    it('should return false if the JWT check is still in the `in progress` state', () => {
      // Arrange
      const initialState = merge(
        {},
        initialAppState('jwt', 'APP_CHECK__IN_PROGRESS', FAKE_JWT_NO_ERRORS),
        initialAppState('config', 'APP_CHECK__SUCCESS', FAKE_JWT_NO_ERRORS),
      ) as RootState;

      // Act
      const isAppReady = selectors.isAppReadySelector(initialState);

      // Assert
      expect(isAppReady).toBeFalsy();
    });

    it('should return false if the configuration check is still in the `in progress` state', () => {
      // Arrange
      const initialState = merge(
        {},
        initialAppState('jwt', 'APP_CHECK__SUCCESS', FAKE_JWT_NO_ERRORS),
        initialAppState('config', 'APP_CHECK__IN_PROGRESS', FAKE_JWT_NO_ERRORS),
      ) as RootState;

      // Act
      const isAppReady = selectors.isAppReadySelector(initialState);

      // Assert
      expect(isAppReady).toBeFalsy();
    });

    it('should return true if the JWT and configuration check are both in a `success` state', () => {
      // Arrange
      const initialState = merge(
        {},
        initialAppState('jwt', 'APP_CHECK__SUCCESS', FAKE_JWT_NO_ERRORS),
        initialAppState('config', 'APP_CHECK__SUCCESS', FAKE_JWT_NO_ERRORS),
      ) as RootState;

      // Act
      const isAppReady = selectors.isAppReadySelector(initialState);

      // Assert
      expect(isAppReady).toBeTruthy();
    });

    it('should return false if the JWT check is in a `failed` state', () => {
      // Arrange
      const initialState = merge(
        {},
        initialAppState('jwt', 'APP_CHECK__FAIL', FAKE_JWT_NO_ERRORS),
        initialAppState('config', 'APP_CHECK__SUCCESS', FAKE_JWT_NO_ERRORS),
      ) as RootState;

      // Act
      const isAppReady = selectors.isAppReadySelector(initialState);

      // Assert
      expect(isAppReady).toBeFalsy();
    });

    it('should return false if the configuration check is in a `failed` state', () => {
      // Arrange
      const initialState = merge(
        {},
        initialAppState('jwt', 'APP_CHECK__SUCCESS', FAKE_JWT_NO_ERRORS),
        initialAppState('config', 'APP_CHECK__FAIL', FAKE_JWT_NO_ERRORS),
      ) as RootState;

      // Act
      const isAppReady = selectors.isAppReadySelector(initialState);

      // Assert
      expect(isAppReady).toBeFalsy();
    });
  });

  describe('areTasksReadySelector', () => {
    it('should return true if the app is ready, and tasks have been downloaded', () => {
      // Arrange
      const initialState = merge(
        {},
        initialAppState('jwt', 'APP_CHECK__SUCCESS', FAKE_JWT_NO_ERRORS),
        initialAppState('config', 'APP_CHECK__SUCCESS', FAKE_JWT_NO_ERRORS),
      ) as RootState;
      allTasksHashSelector.mockReturnValue(FAKE_TASKS_HASH);

      // Act
      const areTasksReady = selectors.areTasksReadySelector(initialState);

      // Assert
      expect(areTasksReady).toBeTruthy();
    });

    it('should return false if the app is ready, but tasks have not been downloaded', () => {
      // Arrange
      const initialState = merge(
        {},
        initialAppState('jwt', 'APP_CHECK__SUCCESS', FAKE_JWT_NO_ERRORS),
        initialAppState('config', 'APP_CHECK__SUCCESS', FAKE_JWT_NO_ERRORS),
      ) as RootState;
      allTasksHashSelector.mockReturnValue(null);

      // Act
      const areTasksReady = selectors.areTasksReadySelector(initialState);

      // Assert
      expect(areTasksReady).toBeFalsy();
    });

    it('should return false if the app is not ready, yet the tasks have been downloaded', () => {
      // Arrange
      const initialState = merge(
        {},
        initialAppState('jwt', 'APP_CHECK__IN_PROGRESS', FAKE_JWT_NO_ERRORS),
        initialAppState('config', 'APP_CHECK__IN_PROGRESS', FAKE_JWT_NO_ERRORS),
      ) as RootState;
      allTasksHashSelector.mockReturnValue(FAKE_TASKS_HASH);

      // Act
      const areTasksReady = selectors.areTasksReadySelector(initialState);

      // Assert
      expect(areTasksReady).toBeFalsy();
    });
  });
});
