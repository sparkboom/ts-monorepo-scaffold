import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import StackTrace from 'stacktrace-js';
import * as sagas from '../sagas';
import * as actions from '../actions';
import { SubmitErrorAction, SubmitLogAction } from '../actions';
import { commandApiSelector } from '../../Api/selectors';

jest.mock('stacktrace-js');

const mockedConsoleInfo = jest.spyOn(console, 'info');

// Tests
describe('Logging > Sagas', () => {
  let LOG_CTX: string;
  let FAKE_CMD_API: any;
  let FAKE_DETAILS: any;
  let FAKE_ERROR: Error;
  let FAKE_MESSAGE: string;
  let FAKE_ERROR_ACTION: SubmitLogAction | SubmitErrorAction;
  let FAKE_LOG_ACTION: SubmitLogAction | SubmitErrorAction;
  let FAKE_NULL_STACK_TRACE: null;
  let NO_LOG_LEVEL: 1;
  let ERROR_LOG_LEVEL: 2;

  beforeAll(() => {
    LOG_CTX = 'LOG.CTX';
    FAKE_CMD_API = {
      saveFrontEndLog: () => {},
    };
    FAKE_DETAILS = {
      details: 'Fake Details',
    };
    FAKE_ERROR = new Error('FAKE_ERROR_MSG');
    FAKE_MESSAGE = 'FAKE LOG MESSAGE';
    FAKE_ERROR_ACTION = actions.submitError('ERROR', LOG_CTX, FAKE_ERROR, FAKE_DETAILS);
    FAKE_LOG_ACTION = actions.submitLog('INFO', LOG_CTX, FAKE_MESSAGE, FAKE_DETAILS);
    FAKE_NULL_STACK_TRACE = null;
    NO_LOG_LEVEL = 1;
    ERROR_LOG_LEVEL = 2;

    mockedConsoleInfo.mockImplementation(() => {});
  });

  afterAll(() => {
    mockedConsoleInfo.mockReset();
  });

  describe('Log Saga', () => {
    it("should generate a stack trace if we're logging an error", () => {
      // Arrange
      // Act
      // Assert
      return expectSaga(sagas.logSaga, FAKE_ERROR_ACTION, NO_LOG_LEVEL, NO_LOG_LEVEL)
        .provide([
          [matchers.call.fn(StackTrace.fromError), FAKE_NULL_STACK_TRACE],
          [matchers.select(commandApiSelector), FAKE_CMD_API],
          [matchers.call.fn(FAKE_CMD_API.saveFrontEndLog), null],
        ])
        .call.fn(StackTrace.fromError)
        .run();
    });

    it("should not generate a stack trace if we're not logging an error", () => {
      // Arrange
      // Act
      // Assert
      return expectSaga(sagas.logSaga, FAKE_LOG_ACTION, NO_LOG_LEVEL, NO_LOG_LEVEL)
        .provide([
          [matchers.call.fn(StackTrace.fromError), FAKE_NULL_STACK_TRACE],
          [matchers.select(commandApiSelector), FAKE_CMD_API],
          [matchers.call.fn(FAKE_CMD_API.saveFrontEndLog), null],
        ])
        .not.call.fn(StackTrace.fromError)
        .run();
    });

    it('should not generate a stack trace if the error action does not contain an error object', () => {
      // Arrange
      const FAKE_ERROR_ACTION_NO_ERROR = {
        ...FAKE_ERROR_ACTION,
      };
      FAKE_ERROR_ACTION_NO_ERROR.payload.error = null;
      // Act
      // Assert
      return expectSaga(sagas.logSaga, FAKE_LOG_ACTION, NO_LOG_LEVEL, NO_LOG_LEVEL)
        .provide([[matchers.call.fn(StackTrace.fromError), FAKE_NULL_STACK_TRACE]])
        .not.call.fn(StackTrace.fromError)
        .run();
    });

    it('should log to browser if log level is same to browser log level', () => {
      // Arrange
      const INFO_LOG_LEVEL = 4;
      // Act
      // Assert
      return expectSaga(sagas.logSaga, FAKE_LOG_ACTION, INFO_LOG_LEVEL, NO_LOG_LEVEL)
        .provide([[matchers.call.fn(StackTrace.fromError), FAKE_NULL_STACK_TRACE]])
        .call.like({ fn: sagas.logToConsole })
        .run();
    });

    it('should log to browser if log level is above to browser log level', () => {
      // Arrange
      const DEBUG_LOG_LEVEL = 5;
      // Act
      // Assert
      return expectSaga(sagas.logSaga, FAKE_LOG_ACTION, DEBUG_LOG_LEVEL, NO_LOG_LEVEL)
        .provide([[matchers.call.fn(StackTrace.fromError), FAKE_NULL_STACK_TRACE]])
        .call.like({ fn: sagas.logToConsole })
        .run();
    });

    it('should not log to browser if log level is below to browser log level', () => {
      // Arrange
      const WARN_LOG_LEVEL = 3;
      // Act
      // Assert
      return expectSaga(sagas.logSaga, FAKE_LOG_ACTION, WARN_LOG_LEVEL, NO_LOG_LEVEL)
        .provide([[matchers.call.fn(StackTrace.fromError), FAKE_NULL_STACK_TRACE]])
        .not.call.like({ fn: sagas.logToConsole })
        .run();
    });

    it('should match the snapshot if content was successfully logged to browser', async () => {
      // Arrange
      const INFO_LOG_LEVEL = 4;
      const FAKE_TIMESTAMP = {
        longUtc: '2019-10-4 20:39:58.328',
        shortLocal: '19-10-4 15:39:58.328',
        msSinceLaunch: '+45 ms',
      };
      // Act
      // Assert
      const result = await expectSaga(sagas.logSaga, FAKE_LOG_ACTION, INFO_LOG_LEVEL, NO_LOG_LEVEL)
        .provide([[matchers.call.fn(sagas.getTimeStamp), FAKE_TIMESTAMP]])
        .run();

      expect(result.toJSON()).toMatchSnapshot();
    });
  });
});
