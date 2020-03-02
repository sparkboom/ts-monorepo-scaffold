import { simpleState, emptyState } from '../__fixtures__/state';
import * as selectors from '../selectors';

describe('Config > Selectors', () => {
  describe('queryEndpointSelector', () => {
    it('should return the query endpoint details', () => {
      // Arrange
      // Act
      const queryEndpoint = selectors.queryEndpointSelector({ config: simpleState } as RootState);

      // Assert
      expect(queryEndpoint).toEqual(simpleState.endpoints.query);
    });
    it('should safely return null if the query endpoint details are not available', () => {
      // Arrange
      // Act
      const queryEndpoint = selectors.queryEndpointSelector({ config: emptyState } as RootState);

      // Assert
      expect(queryEndpoint).toBeNull();
    });
  });

  describe('commandEndpointSelector', () => {
    it('should return the command endpoint details', () => {
      // Arrange
      // Act
      const commandEndpoint = selectors.commandEndpointSelector({ config: simpleState } as RootState);

      // Assert
      expect(commandEndpoint).toEqual(simpleState.endpoints.command);
    });
    it('should safely return null if the command endpoint details are not available', () => {
      // Arrange
      // Act
      const commandEndpoint = selectors.commandEndpointSelector({ config: emptyState } as RootState);

      // Assert
      expect(commandEndpoint).toBeNull();
    });
  });

  describe('webEndpointSelector', () => {
    it('should return the web endpoint details', () => {
      // Arrange
      // Act
      const webEndpoint = selectors.webEndpointSelector({ config: simpleState } as RootState);

      // Assert
      expect(webEndpoint).toEqual(simpleState.endpoints.web);
    });
    it('should safely return null if the web endpoint details are not available', () => {
      // Arrange
      // Act
      const webEndpoint = selectors.webEndpointSelector({ config: emptyState } as RootState);

      // Assert
      expect(webEndpoint).toBeNull();
    });
  });

  describe('featureTogglesSelector', () => {
    it('should return the feature toggles', () => {
      // Arrange
      // Act
      const featureToggles = selectors.featureTogglesSelector({ config: simpleState } as RootState);

      // Assert
      expect(featureToggles).toEqual(simpleState.featureToggles);
    });
    it('should safely return null if the feature toggles are not available', () => {
      // Arrange
      // Act
      const featureToggles = selectors.featureTogglesSelector({ config: emptyState } as RootState);

      // Assert
      expect(featureToggles).toBeNull();
    });
  });

  describe('tasksConfigSelector', () => {
    it('should return the tasks configuration', () => {
      // Arrange
      // Act
      const tasksConfiguration = selectors.tasksConfigSelector({ config: simpleState } as RootState);

      // Assert
      expect(tasksConfiguration).toEqual(simpleState.tasks);
    });
    it('should safely return null if the tasks configuration are not available', () => {
      // Arrange
      // Act
      const tasksConfiguration = selectors.tasksConfigSelector({ config: emptyState } as RootState);

      // Assert
      expect(tasksConfiguration).toBeNull();
    });
  });

  describe('platformSelector', () => {
    it('should return the platform', () => {
      // Arrange
      // Act
      const platform = selectors.platformSelector({ config: simpleState } as RootState);

      // Assert
      expect(platform).toEqual(simpleState.platform);
    });
    it('should safely return null if the platform are not available', () => {
      // Arrange
      // Act
      const platform = selectors.platformSelector({ config: emptyState } as RootState);

      // Assert
      expect(platform).toBeNull();
    });
  });
});
