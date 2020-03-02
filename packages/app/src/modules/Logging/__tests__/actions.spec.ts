import * as actions from '../actions';

describe('Logging > Actions', () => {
  describe('Submit Log Action', () => {
    let FAKE_LEVEL: any;
    let FAKE_CTX: any;
    let FAKE_MESSAGE: any;
    let FAKE_DETAILS: any;

    beforeEach(() => {
      FAKE_LEVEL = 'INFO';
      FAKE_CTX = 'CTX';
      FAKE_MESSAGE = 'This is a fake message';
      FAKE_DETAILS = ['a', 'b', 'c'];
    });

    it('should correctly set the level when creating a submit log action', () => {
      // Arrange
      // Act
      const submitLogAction = actions.submitLog(FAKE_LEVEL, FAKE_CTX, FAKE_MESSAGE);

      // Assert
      expect(submitLogAction).toMatchObject({
        type: 'LOGGING__SUBMIT',
        payload: {
          level: FAKE_LEVEL,
        },
      });
    });

    it('should correctly set the context when creating a submit log action', () => {
      // Arrange
      // Act
      const submitLogAction = actions.submitLog(FAKE_LEVEL, FAKE_CTX, FAKE_MESSAGE);

      // Assert
      expect(submitLogAction).toMatchObject({
        type: 'LOGGING__SUBMIT',
        payload: {
          context: FAKE_CTX,
        },
      });
    });

    it('should correctly set the message when creating a submit log action', () => {
      // Arrange
      // Act
      const submitLogAction = actions.submitLog(FAKE_LEVEL, FAKE_CTX, FAKE_MESSAGE);

      // Assert
      expect(submitLogAction).toMatchObject({
        type: 'LOGGING__SUBMIT',
        payload: {
          message: FAKE_MESSAGE,
        },
      });
    });

    it('should correctly set the details when creating a submit log action', () => {
      // Arrange
      // Act
      const submitLogAction = actions.submitLog(FAKE_LEVEL, FAKE_CTX, FAKE_MESSAGE, ...FAKE_DETAILS);

      // Assert
      expect(submitLogAction).toMatchObject({
        type: 'LOGGING__SUBMIT',
        payload: {
          details: FAKE_DETAILS,
        },
      });
    });
  });

  describe('Submit Error Action', () => {
    let FAKE_LEVEL: any;
    let FAKE_CTX: any;
    let FAKE_MESSAGE: any;
    let FAKE_DETAILS: any;

    beforeEach(() => {
      FAKE_LEVEL = 'ERROR';
      FAKE_CTX = 'CTX';
      FAKE_MESSAGE = 'This is a fake message';
      FAKE_DETAILS = ['a', 'b', 'c'];
    });

    it('should correctly set the level when creating a submit error action', () => {
      // Arrange
      // Act
      const submitErrorAction = actions.submitError(FAKE_LEVEL, FAKE_CTX, FAKE_MESSAGE);

      // Assert
      expect(submitErrorAction).toMatchObject({
        type: 'LOGGING__ERROR_SUBMIT',
        payload: {
          level: FAKE_LEVEL,
        },
      });
    });

    it('should correctly set the context when creating a submit error action', () => {
      // Arrange
      // Act
      const submitErrorAction = actions.submitError(FAKE_LEVEL, FAKE_CTX, FAKE_MESSAGE);

      // Assert
      expect(submitErrorAction).toMatchObject({
        type: 'LOGGING__ERROR_SUBMIT',
        payload: {
          context: FAKE_CTX,
        },
      });
    });

    it('should correctly set the message when creating a submit error action', () => {
      // Arrange
      // Act
      const submitErrorAction = actions.submitError(FAKE_LEVEL, FAKE_CTX, FAKE_MESSAGE);

      // Assert
      expect(submitErrorAction).toMatchObject({
        type: 'LOGGING__ERROR_SUBMIT',
        payload: {
          message: FAKE_MESSAGE,
        },
      });
    });

    it('should correctly set the details when creating a submit error action', () => {
      // Arrange
      // Act
      const submitErrorAction = actions.submitError(FAKE_LEVEL, FAKE_CTX, FAKE_MESSAGE, ...FAKE_DETAILS);

      // Assert
      expect(submitErrorAction).toMatchObject({
        type: 'LOGGING__ERROR_SUBMIT',
        payload: {
          details: FAKE_DETAILS,
        },
      });
    });

    it('should correctly set the error when creating a submit error action and passing an error object', () => {
      // Arrange
      const FAKE_ERROR_MSG = 'FAKE_ERROR_MSG';
      const FAKE_ERROR = new Error(FAKE_ERROR_MSG);

      // Act
      const submitErrorAction = actions.submitError(FAKE_LEVEL, FAKE_CTX, FAKE_ERROR, ...FAKE_DETAILS);

      // Assert
      expect(submitErrorAction).toMatchObject({
        type: 'LOGGING__ERROR_SUBMIT',
        payload: {
          error: FAKE_ERROR,
          message: FAKE_ERROR_MSG,
        },
      });
    });
  });

  describe('Success Action', () => {
    let FAKE_CORRELATION_ID: any;
    let FAKE_ACTION: any;
    let FAKE_DETAILS: any;

    beforeEach(() => {
      FAKE_CORRELATION_ID = 'CORRELATION_ID';
      FAKE_ACTION = {
        type: 'FAKE__ACTION',
        correlationId: FAKE_CORRELATION_ID,
      };
      FAKE_DETAILS = { details: 'DETAILS' };
    });

    it('should correctly set the related action when creating a success action', () => {
      // Arrange
      // Act
      const successAction = actions.success(FAKE_ACTION, FAKE_DETAILS);

      // Assert
      expect(successAction).toMatchObject({
        type: 'FAKE__ACTION_SUCCESS',
        payload: {
          relatedAction: FAKE_ACTION,
        },
      });
    });

    it('should correctly set the details when creating a success action', () => {
      // Arrange
      // Act
      const successAction = actions.success(FAKE_ACTION, FAKE_DETAILS);

      // Assert
      expect(successAction).toMatchObject({
        type: 'FAKE__ACTION_SUCCESS',
        payload: {
          details: FAKE_DETAILS,
        },
      });
    });

    it('should correctly set the correlation id when creating a success action', () => {
      // Arrange
      // Act
      const successAction = actions.success(FAKE_ACTION, FAKE_DETAILS);

      // Assert
      expect(successAction).toMatchObject({
        type: 'FAKE__ACTION_SUCCESS',
        correlationId: FAKE_CORRELATION_ID,
      });
    });
  });

  describe('Warn Action', () => {
    let FAKE_CORRELATION_ID: any;
    let FAKE_ACTION: any;
    let FAKE_DETAILS: any;
    let FAKE_MESSAGE: any;

    beforeEach(() => {
      FAKE_CORRELATION_ID = 'CORRELATION_ID';
      FAKE_ACTION = {
        type: 'FAKE__ACTION',
        correlationId: FAKE_CORRELATION_ID,
      };
      FAKE_DETAILS = { details: 'DETAILS' };
      FAKE_MESSAGE = 'This is a fake message';
    });

    it('should correctly set the related action when creating a warn action', () => {
      // Arrange
      // Act
      const warnAction = actions.warn(FAKE_ACTION, FAKE_MESSAGE, FAKE_DETAILS);

      // Assert
      expect(warnAction).toMatchObject({
        type: 'FAKE__ACTION_WARN',
        payload: {
          relatedAction: FAKE_ACTION,
        },
      });
    });

    it('should correctly set the details when creating a warn action', () => {
      // Arrange
      // Act
      const warnAction = actions.warn(FAKE_ACTION, FAKE_MESSAGE, FAKE_DETAILS);

      // Assert
      expect(warnAction).toMatchObject({
        type: 'FAKE__ACTION_WARN',
        payload: {
          details: FAKE_DETAILS,
        },
      });
    });

    it('should correctly set the message when creating a warn action', () => {
      // Arrange
      // Act
      const warnAction = actions.warn(FAKE_ACTION, FAKE_MESSAGE, FAKE_DETAILS);

      // Assert
      expect(warnAction).toMatchObject({
        type: 'FAKE__ACTION_WARN',
        payload: {
          message: FAKE_MESSAGE,
        },
      });
    });

    it('should correctly set the correlation id when creating a warn action', () => {
      // Arrange
      // Act
      const warnAction = actions.warn(FAKE_ACTION, FAKE_DETAILS);

      // Assert
      expect(warnAction).toMatchObject({
        type: 'FAKE__ACTION_WARN',
        correlationId: FAKE_CORRELATION_ID,
      });
    });
  });

  describe('Fail Action', () => {
    let FAKE_CORRELATION_ID: any;
    let FAKE_ACTION: any;
    let FAKE_DETAILS: any;
    let FAKE_MESSAGE: any;

    beforeEach(() => {
      FAKE_CORRELATION_ID = 'CORRELATION_ID';
      FAKE_ACTION = {
        type: 'FAKE__ACTION',
        correlationId: FAKE_CORRELATION_ID,
      };
      FAKE_DETAILS = { details: 'DETAILS' };
      FAKE_MESSAGE = 'This is a fake message';
    });

    it('should correctly set the related action when creating a fail action', () => {
      // Arrange
      // Act
      const failAction = actions.fail(FAKE_ACTION, FAKE_MESSAGE, FAKE_DETAILS);

      // Assert
      expect(failAction).toMatchObject({
        type: 'FAKE__ACTION_FAIL',
        payload: {
          relatedAction: FAKE_ACTION,
        },
      });
    });

    it('should correctly set the details when creating a fail action', () => {
      // Arrange
      // Act
      const failAction = actions.fail(FAKE_ACTION, FAKE_MESSAGE, FAKE_DETAILS);

      // Assert
      expect(failAction).toMatchObject({
        type: 'FAKE__ACTION_FAIL',
        payload: {
          details: FAKE_DETAILS,
        },
      });
    });

    it('should correctly set the message when creating a fail action', () => {
      // Arrange
      // Act
      const failAction = actions.fail(FAKE_ACTION, FAKE_MESSAGE, FAKE_DETAILS);

      // Assert
      expect(failAction).toMatchObject({
        type: 'FAKE__ACTION_FAIL',
        payload: {
          message: FAKE_MESSAGE,
        },
      });
    });

    it('should correctly set the correlation id when creating a fail action', () => {
      // Arrange
      // Act
      const failAction = actions.fail(FAKE_ACTION, FAKE_DETAILS);

      // Assert
      expect(failAction).toMatchObject({
        type: 'FAKE__ACTION_FAIL',
        correlationId: FAKE_CORRELATION_ID,
      });
    });
  });

  describe('Status Action', () => {
    let FAKE_CORRELATION_ID: string;
    let FAKE_ACTION: any;
    let FAKE_STATUS: string;

    beforeEach(() => {
      FAKE_CORRELATION_ID = 'CORRELATION_ID';
      FAKE_ACTION = {
        type: 'FAKE__ACTION',
        correlationId: FAKE_CORRELATION_ID,
      };
      FAKE_STATUS = 'FAKE_STATUS';
    });

    it('should correctly set the related action when creating a status action', () => {
      // Arrange
      // Act
      const statusAction = actions.status(FAKE_ACTION, FAKE_STATUS);

      // Assert
      expect(statusAction).toMatchObject({
        type: 'FAKE__ACTION_STATUS',
        payload: {
          relatedAction: FAKE_ACTION,
        },
      });
    });

    it('should correctly set the details when creating a status action', () => {
      // Arrange
      // Act
      const statusAction = actions.status(FAKE_ACTION, FAKE_STATUS);

      // Assert
      expect(statusAction).toMatchObject({
        type: 'FAKE__ACTION_STATUS',
        payload: {
          details: {
            status: FAKE_STATUS,
          },
        },
      });
    });

    it('should correctly set the correlation id when creating a status action', () => {
      // Arrange
      // Act
      const statusAction = actions.status(FAKE_ACTION, FAKE_STATUS);

      // Assert
      expect(statusAction).toMatchObject({
        type: 'FAKE__ACTION_STATUS',
        correlationId: FAKE_CORRELATION_ID,
      });
    });
  });
});
