import * as actions from '../actions';

// Tests
describe('Content > Actions', () => {
  describe('Load Content', () => {
    it('should create a simple load content action', () => {
      // Arrange
      // Act
      const loadContentAction = actions.loadContent();

      // Assert
      expect(loadContentAction).toEqual({
        type: 'CONTENT__LOAD',
      });
    });
  });

  describe('Set Content', () => {
    it('should create a simple set content action', () => {
      // Arrange
      const FAKE_CONTENT = {};

      // Act
      const setContentAction = actions.setContent(FAKE_CONTENT);

      // Assert
      expect(setContentAction).toEqual({
        type: 'CONTENT__SET',
        payload: FAKE_CONTENT,
      });
    });
  });
});
