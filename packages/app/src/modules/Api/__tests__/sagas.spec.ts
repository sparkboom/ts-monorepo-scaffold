import { expectSaga } from 'redux-saga-test-plan';
import { select, delay } from 'redux-saga/effects';
import * as matchers from 'redux-saga-test-plan/matchers';
import delayProvider from '../../../../../shared/__mocks__/redux-saga/delay';
import * as actions from '../actions';
import * as sagas from '../sagas';
import { status, fail, success } from '../../Logging/actions';
import * as selectors from '../selectors';
import { persistRehydrateNoToken, persistRehydrateWithToken } from '../__fixtures__/actions';
import { correlate } from '../../../middleware/correlate-redux-middleware';
import { notifySaga } from '../../Notification/sagas';

// Tests
describe('Api > Sagas', () => {
  describe('Api Init Saga', () => {
    it('should wait until redux-persist has rehydrated', async () => {
      // Arrange
      const apiInitAction = correlate(actions.apiInit(), 'CORRELATION_ID');

      // Act
      const report = await expectSaga(sagas.apiInitSaga, apiInitAction)
        // do not dispatch persist/REHYDRATE action
        .run();

      // Assert
      expect(report).toMatchInlineSnapshot(`
        Object {
          "put": Array [
            Object {
              "@@redux-saga/IO": true,
              "combinator": false,
              "payload": Object {
                "action": Object {
                  "correlationId": "CORRELATION_ID",
                  "payload": Object {
                    "details": null,
                    "message": "",
                    "relatedAction": Object {
                      "correlationId": "CORRELATION_ID",
                      "type": "API__INIT",
                    },
                  },
                  "type": "API__INIT_FAIL",
                },
                "channel": undefined,
              },
              "type": "PUT",
            },
          ],
          "take": Array [
            Object {
              "@@redux-saga/IO": true,
              "combinator": false,
              "payload": Object {
                "pattern": "persist/REHYDRATE",
              },
              "type": "TAKE",
            },
          ],
        }
      `);
    });

    it('should ensure action status is set to `in progress`', () => {
      // Arrange
      const apiInitAction = correlate(actions.apiInit(), 'CORRELATION_ID');

      // Act
      // Assert
      return expectSaga(sagas.apiInitSaga, apiInitAction)
        .dispatch({ type: 'persist/REHYDRATE', persistRehydrateWithToken })
        .put(status(apiInitAction, 'IN_PROGRESS')) // 1
        .silentRun();
    });

    it('should fail if no token is in query params and not persisted', () => {
      // Arrange
      const apiInitAction = correlate(actions.apiInit(), 'CORRELATION_ID');
      const fakeQueryParams = {};

      // Act
      // Assert
      return expectSaga(sagas.apiInitSaga, apiInitAction)
        .provide([[select(selectors.querySelector), fakeQueryParams]])
        .dispatch(persistRehydrateNoToken) // 2
        .put(fail(apiInitAction, '')) // 3
        .run();
    });

    it('should use a persisted token if no token is passed by query string', () => {
      // Arrange
      jest.spyOn(sagas, 'getSecondsRemaining').mockReturnValueOnce(TOKEN_EXPIRY_SECS);
      const TOKEN_EXPIRY_SECS = 3600;
      const apiInitAction = correlate(actions.apiInit(), 'CORRELATION_ID');
      const fakeQueryParams = {};

      // Act
      // Assert
      return expectSaga(sagas.apiInitSaga, apiInitAction)
        .provide([
          [select(selectors.querySelector), fakeQueryParams], // 3
          { call: delayProvider }, // 6
          [matchers.call.fn(sagas.refreshTokenSaga), null],
        ])
        .dispatch(persistRehydrateWithToken) // 2
        .take('persist/REHYDRATE')
        .select(selectors.querySelector) // 3
        .put.like({ action: success(apiInitAction) }) // 5
        .run();
    });

    it('should use query string token instead of persisted token', () => {
      // Arrange
      const QUERY_JWT = 'QUREY_TOKEN';
      const TOKEN_EXPIRY_SECS = 3600;
      const apiInitAction = correlate(actions.apiInit(), 'CORRELATION_ID');
      const fakeQueryParams = { jwt: QUERY_JWT, expiresInSeconds: TOKEN_EXPIRY_SECS };

      // Act
      // Assert
      return expectSaga(sagas.apiInitSaga, apiInitAction)
        .provide([
          [select(selectors.querySelector), fakeQueryParams], // 3
          { call: delayProvider }, // 6
          [matchers.call.fn(sagas.refreshTokenSaga), null],
        ])
        .dispatch(persistRehydrateWithToken) // 2
        .take('persist/REHYDRATE')
        .select(selectors.querySelector) // 3
        .put.like({ action: { payload: { jwt: QUERY_JWT } } }) // 4
        .run();
    });

    it('should wait for expiry of token before requesting another token', () => {
      // Arrange
      const QUERY_JWT = 'QUREY_TOKEN';
      const TOKEN_EXPIRY_SECS = 3600;
      const apiInitAction = correlate(actions.apiInit(), 'CORRELATION_ID');
      const fakeToken = { jwt: QUERY_JWT, expiresInSeconds: TOKEN_EXPIRY_SECS };
      const delayFn = delay(0).payload.fn;

      // Act
      // Assert
      return expectSaga(sagas.apiInitSaga, apiInitAction)
        .provide([
          [select(selectors.querySelector), fakeToken], // 3
          { call: delayProvider }, // 6
          [matchers.call.fn(sagas.refreshTokenSaga), null],
        ])
        .dispatch(persistRehydrateWithToken) // 2
        .take('persist/REHYDRATE')
        .select(selectors.querySelector) // 3
        .call(delayFn, sagas.refreshTokenDelayMsFromExpiry(TOKEN_EXPIRY_SECS))
        .silentRun();
    });

    // Skipped as this test seems to be taking too long
    it.skip('should repeat token refresh cycle until no token retrieve', () => {
      // Arrange
      const QUERY_JWT = 'QUREY_TOKEN';
      const TOKEN_EXPIRY_SECS = 3600;
      const FAKE_TOKEN = { jwt: QUERY_JWT, expiresInSeconds: TOKEN_EXPIRY_SECS };
      const apiInitAction = correlate(actions.apiInit(), 'CORRELATION_ID');
      const delayFn = delay(0).payload.fn;

      // Act
      // Assert
      return (
        expectSaga(sagas.apiInitSaga, apiInitAction)
          .provide([
            [select(selectors.querySelector), FAKE_TOKEN], // 3
            { call: delayProvider }, // 6
            [matchers.call.fn(sagas.refreshTokenSaga), FAKE_TOKEN],
          ])
          .dispatch(persistRehydrateWithToken) // 2
          .select(selectors.querySelector) // 3
          // The following repetition expresses the token refresh cycle
          .call(delayFn, sagas.refreshTokenDelayMsFromExpiry(TOKEN_EXPIRY_SECS))
          .call(sagas.refreshTokenSaga, apiInitAction)
          .call(delayFn, sagas.refreshTokenDelayMsFromExpiry(TOKEN_EXPIRY_SECS))
          .call(sagas.refreshTokenSaga, apiInitAction)
          .call(delayFn, sagas.refreshTokenDelayMsFromExpiry(TOKEN_EXPIRY_SECS))
          .call(sagas.refreshTokenSaga, apiInitAction)
          .silentRun()
      );
    });
  });

  describe('Refresh Token Saga', () => {
    it('should successfully store new token', () => {
      // Arrange
      const FAKE_ACTION = correlate(actions.apiInit(), 'CORRELATION_ID');
      const FAKE_JWT = 'FAKE_JWT';
      const FAKE_EXPIRY = 3600;
      const FAKE_RAW_TOKEN = { authToken: FAKE_JWT, expiresInSeconds: FAKE_EXPIRY };
      const FAKE_CMD_API = {
        authenticationRefreshToken: () => FAKE_RAW_TOKEN,
      };

      // Act
      // Assert
      return expectSaga(sagas.refreshTokenSaga, FAKE_ACTION)
        .provide([[select(selectors.commandApiSelector), FAKE_CMD_API]])
        .put.like({
          action: {
            type: 'API__SET_TOKEN',
            payload: {
              jwt: FAKE_JWT,
            },
          },
        })
        .run();
    });

    it('should match snapshot when token has successfully refreshed', async () => {
      // Arrange
      const FAKE_ACTION = correlate(actions.apiInit(), 'CORRELATION_ID');
      const FAKE_JWT = 'FAKE_JWT';
      const FAKE_EXPIRY = 3600;
      const FAKE_EXPIRY_TIMESTAMP = 1572739234821;
      const FAKE_RAW_TOKEN = { authToken: FAKE_JWT, expiresInSeconds: FAKE_EXPIRY };
      const FAKE_CMD_API = {
        authenticationRefreshToken: () => FAKE_RAW_TOKEN,
      };
      const FAKE_TOKEN = {
        jwt: FAKE_JWT,
        expiresInSeconds: FAKE_EXPIRY,
        expiryTimeStamp: FAKE_EXPIRY_TIMESTAMP,
      };

      // Act
      const result = await expectSaga(sagas.refreshTokenSaga, FAKE_ACTION)
        .provide([[select(selectors.commandApiSelector), FAKE_CMD_API], [matchers.call.fn(sagas.createToken), FAKE_TOKEN]])
        .run();

      // Assert
      expect(result.toJSON()).toMatchSnapshot();
    });

    it('should log if token could not be refreshed', () => {
      // Arrange
      const FAKE_ACTION = correlate(actions.apiInit(), 'CORRELATION_ID');
      const FAKE_RAW_NULL_TOKEN = null;
      const FAKE_CMD_API = {
        authenticationRefreshToken: () => FAKE_RAW_NULL_TOKEN,
      };

      // Act
      // Assert
      return expectSaga(sagas.refreshTokenSaga, FAKE_ACTION)
        .provide([[select(selectors.commandApiSelector), FAKE_CMD_API]])
        .put.like({
          action: {
            type: 'LOGGING__ERROR_SUBMIT',
            payload: {
              message: 'Token Refresh Failed. No valid token received from API refresh call.',
            },
          },
        })
        .returns(null)
        .run();
    });

    it('should catch if token refresh raises an expection', () => {
      // Arrange
      const FAKE_ACTION = correlate(actions.apiInit(), 'CORRELATION_ID');
      const FAKE_ERROR = new Error('FAKE_ERROR_MSG');
      const FAKE_CMD_API = {
        authenticationRefreshToken: () => {
          throw FAKE_ERROR;
        },
      };

      // Act
      // Assert
      return expectSaga(sagas.refreshTokenSaga, FAKE_ACTION)
        .provide([[select(selectors.commandApiSelector), FAKE_CMD_API]])
        .provide([[matchers.call(notifySaga), null]])
        .put.like({
          action: {
            type: 'LOGGING__ERROR_SUBMIT',
            payload: {
              message: 'Token Refresh Failed. Command API unavailable',
            },
          },
        })
        .returns(null)
        .run();
    });
  });

  describe('Get Query Api Saga', () => {
    it('should return Query API if available', () => {
      // Arrange
      const FAKE_QUERY_API = {};
      const FAKE_ACTION = correlate({ type: '' }, 'CORRELATION_ID');

      // Act
      // Assert
      return expectSaga(sagas.getQueryApi, FAKE_ACTION)
        .provide([[select(selectors.queryApiSelector), FAKE_QUERY_API]])
        .returns(FAKE_QUERY_API)
        .run();
    });

    it('should match snapshot if available', async () => {
      // Arrange
      const FAKE_QUERY_API = {};
      const FAKE_ACTION = correlate({ type: '' }, 'CORRELATION_ID');

      // Act
      // Assert
      const result = await expectSaga(sagas.getQueryApi, FAKE_ACTION)
        .provide([[select(selectors.queryApiSelector), FAKE_QUERY_API]])
        .returns(FAKE_QUERY_API)
        .run();

      expect(result).toMatchSnapshot();
    });

    it('should return null if Query API is not available', () => {
      // Arrange
      const FAKE_NULL_QUERY_API = null;
      const FAKE_ACTION = correlate({ type: '' }, 'CORRELATION_ID');

      // Act
      // Assert
      return expectSaga(sagas.getQueryApi, FAKE_ACTION)
        .provide([[select(selectors.queryApiSelector), FAKE_NULL_QUERY_API]])
        .returns(FAKE_NULL_QUERY_API)
        .run();
    });

    it('should log error if Query API is not available', () => {
      // Arrange
      const FAKE_NULL_QUERY_API = null;
      const FAKE_ACTION = correlate({ type: '' }, 'CORRELATION_ID');

      // Act
      // Assert
      return expectSaga(sagas.getQueryApi, FAKE_ACTION)
        .provide([[select(selectors.queryApiSelector), FAKE_NULL_QUERY_API]])
        .put.like({ action: { type: 'LOGGING__ERROR_SUBMIT' } })
        .run();
    });
  });

  describe('Get Command Api Saga', () => {
    it('should get Command API if available', () => {
      // Arrange
      const FAKE_COMMAND_API = {};
      const FAKE_ACTION = correlate({ type: '' }, 'CORRELATION_ID');

      // Act
      // Assert
      return expectSaga(sagas.getCommandApi, FAKE_ACTION)
        .provide([[select(selectors.commandApiSelector), FAKE_COMMAND_API]])
        .returns(FAKE_COMMAND_API)
        .run();
    });

    it('should match snapshot if available', async () => {
      // Arrange
      const FAKE_COMMAND_API = {};
      const FAKE_ACTION = correlate({ type: '' }, 'CORRELATION_ID');

      // Act
      // Assert
      const result = await expectSaga(sagas.getCommandApi, FAKE_ACTION)
        .provide([[select(selectors.commandApiSelector), FAKE_COMMAND_API]])
        .returns(FAKE_COMMAND_API)
        .run();

      expect(result).toMatchSnapshot();
    });

    it('should return null if Command API is not available', () => {
      // Arrange
      const FAKE_NULL_COMMAND_API = null;
      const FAKE_ACTION = correlate({ type: '' }, 'CORRELATION_ID');

      // Act
      // Assert
      return expectSaga(sagas.getCommandApi, FAKE_ACTION)
        .provide([[select(selectors.commandApiSelector), FAKE_NULL_COMMAND_API]])
        .returns(FAKE_NULL_COMMAND_API)
        .run();
    });

    it('should log error if Command API is not available', () => {
      // Arrange
      const FAKE_NULL_COMMAND_API = null;
      const FAKE_ACTION = correlate({ type: '' }, 'CORRELATION_ID');

      // Act
      // Assert
      return expectSaga(sagas.getCommandApi, FAKE_ACTION)
        .provide([[select(selectors.commandApiSelector), FAKE_NULL_COMMAND_API]])
        .put.like({ action: { type: 'LOGGING__ERROR_SUBMIT' } })
        .run();
    });
  });

  describe('Get Web Api Saga', () => {
    it('should get Web API if available', () => {
      // Arrange
      const FAKE_WEB_API = {};
      const FAKE_ACTION = correlate({ type: '' }, 'CORRELATION_ID');

      // Act
      // Assert
      return expectSaga(sagas.getWebApi, FAKE_ACTION)
        .provide([[select(selectors.webApiSelector), FAKE_WEB_API]])
        .returns(FAKE_WEB_API)
        .run();
    });

    it('should match snapshot if available', async () => {
      // Arrange
      const FAKE_WEB_API = {};
      const FAKE_ACTION = correlate({ type: '' }, 'CORRELATION_ID');

      // Act
      // Assert
      const result = await expectSaga(sagas.getWebApi, FAKE_ACTION)
        .provide([[select(selectors.webApiSelector), FAKE_WEB_API]])
        .returns(FAKE_WEB_API)
        .run();

      expect(result).toMatchSnapshot();
    });

    it('should return null if Web API is not available', () => {
      // Arrange
      const FAKE_NULL_WEB_API = null;
      const FAKE_ACTION = correlate({ type: '' }, 'CORRELATION_ID');

      // Act
      // Assert
      return expectSaga(sagas.getWebApi, FAKE_ACTION)
        .provide([[select(selectors.webApiSelector), FAKE_NULL_WEB_API]])
        .returns(FAKE_NULL_WEB_API)
        .run();
    });

    it('should log error if Web API is not available', () => {
      // Arrange
      const FAKE_NULL_WEB_API = null;
      const FAKE_ACTION = correlate({ type: '' }, 'CORRELATION_ID');

      // Act
      // Assert
      return expectSaga(sagas.getWebApi, FAKE_ACTION)
        .provide([[select(selectors.webApiSelector), FAKE_NULL_WEB_API]])
        .put.like({ action: { type: 'LOGGING__ERROR_SUBMIT' } })
        .run();
    });
  });
});
