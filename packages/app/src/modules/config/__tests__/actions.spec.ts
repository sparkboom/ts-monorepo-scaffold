import * as actions from '../actions';
import * as states from '../__fixtures__/state';
// Tests
describe('Config > Actions', () => {
  describe('Load Config', () => {
    it('should create a simple load config action', () => {
      // Arrange
      // Act
      const loadConfig = actions.loadConfig();

      // Assert
      expect(loadConfig).toEqual({
        type: 'CONFIG__LOAD',
      });
    });
  });

  describe('Set Config', () => {
    it('should create a simple set config action', () => {
      // Arrange
      // Act
      const setConfig = actions.setConfig(states.simpleState);

      // Assert
      expect(setConfig).toEqual({
        type: 'CONFIG__SET',
        payload: states.simpleState,
      });
    });
  });

  describe('Load Feature Toggles', () => {
    it('should create a simple load feature toggles action', () => {
      // Arrange
      // Act
      const loadFeatureToggles = actions.loadFeatureToggles();

      // Assert
      expect(loadFeatureToggles).toEqual({
        type: 'CONFIG__FEATURE_TOGGLES_LOAD',
      });
    });
  });

  describe('Set Feature Toggles', () => {
    it('should create a simple set config action', () => {
      // Arrange
      // Act
      const setFeatureToggles = actions.setFeatureToggles(states.simpleState.featureToggles);

      // Assert
      expect(setFeatureToggles).toEqual({
        type: 'CONFIG__FEATURE_TOGGLES_SET',
        payload: {
          featureToggles: states.simpleState.featureToggles,
        },
      });
    });
  });
});
