import apiReducer from '../reducers';
import * as actions from '../actions';

// Tests
describe('Api > Reducers', () => {
  describe('Set Token', () => {
    it('should apply a token', () => {
      // Arrange
      const jwt = 'THIS_IS_A_TEST_JWT';
      const expiryTimeStamp = 1571613691508;
      const state = {
        token: null,
      };
      const action = actions.apiSetToken(jwt, expiryTimeStamp);

      // Act
      const newState = apiReducer(state, action);

      // Assert
      expect(newState).toEqual({
        token: {
          jwt,
          expiryTimeStamp,
        },
      });
    });
  });
});
