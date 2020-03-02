import appReducer from '../reducers';
import initialState from '../state';
import * as apiActions from '../../Api/actions';
import * as configActions from '../../config/actions';
import { status, success, fail } from '../../Logging/actions';

// Tests
describe('App > reducers', () => {
  describe('Initial State', () => {
    it('should return the initial state', () => {
      // Arrange
      const action = { type: '', payload: {}, correlationId: '' }; // empty action

      // Act
      const newState = appReducer(undefined, action);

      // Assert
      expect(newState).toEqual(initialState);
    });
  });

  describe('API__INIT_STATUS', () => {
    it('should correctly handle API__INIT_STATUS', () => {
      // Arrange
      const statusValue = 'IN_PROGRESS';
      const action = status(apiActions.apiInit(), statusValue);

      // Act
      const newState = appReducer(undefined, action);

      // Assert
      expect(newState.checks.jwt).toEqual({
        status: 'APP_CHECK__IN_PROGRESS',
      });
    });
  });

  describe('API__INIT_SUCCESS', () => {
    it('should correctly apply APP_CHECK__SUCCESS to the jwt check', () => {
      // Arrange
      const ACTION = success(apiActions.apiInit());

      // Act
      const newState = appReducer(undefined, ACTION);

      // Assert
      expect(newState.checks.jwt).toEqual({
        status: 'APP_CHECK__SUCCESS',
      });
    });
  });

  describe('API__INIT_FAIL', () => {
    it('should correctly apply APP_CHECK__FAIL to the jwt check', () => {
      // Arrange
      const ACTION = fail(apiActions.apiInit());

      // Act
      const newState = appReducer(undefined, ACTION);

      // Assert
      expect(newState.checks.jwt).toEqual({
        status: 'APP_CHECK__FAIL',
      });
    });
  });

  describe('CONFIG__LOAD_STATUS', () => {
    it('should correctly set INIT when CONFIG__LOAD_STATUS action is dispatched', () => {
      // Arrange
      const statusValue = 'INIT';
      const ACTION = status(configActions.loadConfig(), statusValue);

      // Act
      const newState = appReducer(undefined, ACTION);

      // Assert
      expect(newState.checks.config).toEqual({
        status: 'APP_CHECK__INIT',
      });
    });

    it('should correctly set IN_PROGRESS when CONFIG__LOAD_STATUS action is dispatched', () => {
      // Arrange
      const statusValue = 'IN_PROGRESS';
      const ACTION = status(configActions.loadConfig(), statusValue);

      // Act
      const newState = appReducer(undefined, ACTION);

      // Assert
      expect(newState.checks.config).toEqual({
        status: 'APP_CHECK__IN_PROGRESS',
      });
    });
  });

  describe('CONFIG__LOAD_SUCCESS', () => {
    it('should correctly apply APP_CHECK__SUCCESS to the config check', () => {
      // Arrange
      const ACTION = success(configActions.loadConfig());

      // Act
      const newState = appReducer(undefined, ACTION);

      // Assert
      expect(newState.checks.config).toEqual({
        status: 'APP_CHECK__SUCCESS',
      });
    });
  });

  describe('CONFIG__LOAD__FAIL', () => {
    it('should correctly apply APP_CHECK__FAIL to the config check', () => {
      // Arrange
      const ACTION = fail(configActions.loadConfig());

      // Act
      const newState = appReducer(undefined, ACTION);

      // Assert
      expect(newState.checks.config).toEqual({
        status: 'APP_CHECK__FAIL',
      });
    });
  });
});
