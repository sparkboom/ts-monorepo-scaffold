import reducer from '../reducers';
import * as actions from '../actions';
import { fullConfiguration, partialConfiguration, fullFeatureToggles, partialFeatureToggles } from '../__fixtures__/actions';
import { simpleState, emptyState } from '../__fixtures__/state';
import defaultState from '../state';

describe('Config > Reducers', () => {
  describe('Initial State', () => {
    it('should return the initial state', () => {
      // Arrange
      const FAKE_EMPTY_ACTION = { type: '', payload: {}, correlationId: '' }; // empty action

      // Act
      const newState = reducer(emptyState, FAKE_EMPTY_ACTION);

      // Assert
      expect(newState).toEqual(emptyState);
    });
  });

  describe('Set Configuration', () => {
    it('should apply a new configuration from scratch', () => {
      // Arrange
      const setConfigAction = actions.setConfig(fullConfiguration);

      // Act
      const newState = reducer(defaultState, setConfigAction);

      // Assert
      expect(newState).toEqual(fullConfiguration);
    });

    it('should merge a partial configuration', () => {
      // Arrange
      const setConfigAction = actions.setConfig(partialConfiguration);

      // Act
      const newState = reducer(defaultState, setConfigAction);

      // Assert
      expect(newState).toEqual(fullConfiguration);
    });
  });

  describe('SetConfiguration Feature Toggle', () => {
    it('should apply a new feature toggle configuration from scratch', () => {
      // Arrange
      const setFeatureTogglesAction = actions.setFeatureToggles(fullFeatureToggles);

      // Act
      const newState = reducer(emptyState, setFeatureTogglesAction);

      // Assert
      expect(newState.featureToggles).toEqual(fullFeatureToggles);
    });

    it('should merge a partial feature toggle configuration', () => {
      // Arrange
      const setFeatureTogglesAction = actions.setFeatureToggles(partialFeatureToggles);

      // Act
      const newState = reducer(simpleState, setFeatureTogglesAction);

      // Assert
      expect(newState.featureToggles).toMatchObject(partialFeatureToggles);
    });
  });
});
