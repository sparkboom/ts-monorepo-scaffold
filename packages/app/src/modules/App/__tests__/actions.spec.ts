import * as actions from '../actions';

// Tests
describe('App > Actions', () => {
  describe('Initialization', () => {
    it('should create a simple app init action', () => {
      // Arrange
      // Act
      const appInit = actions.appInit();

      // Assert
      expect(appInit).toEqual({
        type: 'APP__INIT',
        correlationId: '%%APP_NAME%%_KERNEL',
      });
    });
  });

  describe('Set Status Check', () => {
    it('should set the status of a JWT check to initialize', () => {
      // Arrange
      const jwtCheck = 'jwt';
      const initStatus = 'APP_CHECK__INIT';

      // Act
      const appSetToken = actions.appSetCheckStatus(jwtCheck, initStatus);

      // Assert
      expect(appSetToken).toEqual({
        type: 'APP__SET_CHECK_STATUS',
        payload: {
          check: jwtCheck,
          status: initStatus,
          error: null,
        },
      });
    });

    it('should set the status of a JWT check to an error', () => {
      // Arrange
      const jwtCheck = 'jwt';
      const errorStatus = 'APP_CHECK__FAIL';
      const errorJwtUnavailable = 'APP_CHECK__JWT_UNAVAILABLE';

      // Act
      const appSetToken = actions.appSetCheckStatus(jwtCheck, errorStatus, errorJwtUnavailable);

      // Assert
      expect(appSetToken).toEqual({
        type: 'APP__SET_CHECK_STATUS',
        payload: {
          check: jwtCheck,
          status: errorStatus,
          error: errorJwtUnavailable,
        },
      });
    });

    it('should set the status of a JWT check to success', () => {
      // Arrange
      const jwtCheck = 'jwt';
      const successStatus = 'APP_CHECK__SUCCESS';

      // Act
      const appSetToken = actions.appSetCheckStatus(jwtCheck, successStatus);

      // Assert
      expect(appSetToken).toEqual({
        type: 'APP__SET_CHECK_STATUS',
        payload: {
          check: jwtCheck,
          status: successStatus,
          error: null,
        },
      });
    });
    it('should set the status of a config check to initialize', () => {
      // Arrange
      const configCheck = 'config';
      const initStatus = 'APP_CHECK__INIT';

      // Act
      const appSetToken = actions.appSetCheckStatus(configCheck, initStatus);

      // Assert
      expect(appSetToken).toEqual({
        type: 'APP__SET_CHECK_STATUS',
        payload: {
          check: configCheck,
          status: initStatus,
          error: null,
        },
      });
    });

    it('should set the status of a config check to an error', () => {
      // Arrange
      const configCheck = 'config';
      const errorStatus = 'APP_CHECK__FAIL';
      const errorJwtUnavailable = 'APP_CHECK__CONFIG_LOAD_FAIL';

      // Act
      const appSetToken = actions.appSetCheckStatus(configCheck, errorStatus, errorJwtUnavailable);

      // Assert
      expect(appSetToken).toEqual({
        type: 'APP__SET_CHECK_STATUS',
        payload: {
          check: configCheck,
          status: errorStatus,
          error: errorJwtUnavailable,
        },
      });
    });

    it('should set the status of a config check to success', () => {
      // Arrange
      const configCheck = 'config';
      const successStatus = 'APP_CHECK__SUCCESS';

      // Act
      const appSetToken = actions.appSetCheckStatus(configCheck, successStatus);

      // Assert
      expect(appSetToken).toEqual({
        type: 'APP__SET_CHECK_STATUS',
        payload: {
          check: configCheck,
          status: successStatus,
          error: null,
        },
      });
    });
  });
});
