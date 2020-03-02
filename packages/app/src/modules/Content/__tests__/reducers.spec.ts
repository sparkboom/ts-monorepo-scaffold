import reducer from '../reducers';
import * as actions from '../actions';
import { sampleContent, emptyContent, nullContent } from '../__fixtures__/actions';
import { simpleState, emptyState } from '../__fixtures__/state';
import defaultState from '../state';

describe('Content > Reducers', () => {
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

  describe('Set Content', () => {
    it('should apply new content from scratch', () => {
      // Arrange
      const setContentAction = actions.setContent(sampleContent);

      // Act
      const newState = reducer(emptyState, setContentAction);

      // Assert
      expect(newState).toMatchObject(sampleContent);
    });

    it('should apply empty content', () => {
      // Arrange
      const setContentAction = actions.setContent(emptyContent);

      // Act
      const newState = reducer(emptyState, setContentAction);

      // Assert
      expect(newState).toEqual({});
    });

    it('should apply null content', () => {
      // Arrange
      const setContentAction = actions.setContent(emptyContent);

      // Act
      let newState = null;

      // Assert
      expect(() => {
        newState = reducer(emptyState, setContentAction);
      }).not.toThrow();
      expect(newState).toEqual({});
    });
  });
});
