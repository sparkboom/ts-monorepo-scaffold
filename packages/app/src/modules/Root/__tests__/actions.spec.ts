import * as actions from '../actions';

describe('Root > Actions', () => {
  describe('Root Actions', () => {
    it('should include API actions', () => {
      // Arrange
      // Act
      // Assert
      expect(actions.api).toBeTruthy();
    });
    it('should include App actions', () => {
      // Arrange
      // Act
      // Assert
      expect(actions.app).toBeTruthy();
    });
    it('should include translations actions', () => {
      // Arrange
      // Act
      // Assert
      expect(actions.translations).toBeTruthy();
    });
    it('should include tasks actions', () => {
      // Arrange
      // Act
      // Assert
      expect(actions.tasks).toBeTruthy();
    });
    it('should include content actions', () => {
      // Arrange
      // Act
      // Assert
      expect(actions.content).toBeTruthy();
    });
    it('should include config actions', () => {
      // Arrange
      // Act
      // Assert
      expect(actions.config).toBeTruthy();
    });
    it('should include MC Account actions', () => {
      // Arrange
      // Act
      // Assert
      expect(actions.mcaccount).toBeTruthy();
    });
    it('should include notification actions', () => {
      // Arrange
      // Act
      // Assert
      expect(actions.notification).toBeTruthy();
    });
    it('should include internationalisation actions', () => {
      // Arrange
      // Act
      // Assert
      expect(actions.intl).toBeTruthy();
    });
  });
});
