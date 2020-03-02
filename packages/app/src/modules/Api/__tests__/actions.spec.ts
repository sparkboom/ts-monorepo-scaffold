import * as actions from '../actions';

// Tests
describe('Api > Actions', () => {
  describe('Initialization', () => {
    it('should create a simple api init action', () => {
      const apiInit = actions.apiInit();
      expect(apiInit).toEqual({
        type: 'API__INIT',
      });
    });
  });

  describe('Set Token', () => {
    it('should create a simple api set token action', () => {
      const jwt = 'THIS_IS_A_TEST_JWT';
      const expiryTimeStamp = 1571613691508;
      const apiSetToken = actions.apiSetToken(jwt, expiryTimeStamp);
      expect(apiSetToken).toEqual({
        type: 'API__SET_TOKEN',
        payload: {
          jwt,
          expiryTimeStamp,
        },
      });
    });
  });
});
