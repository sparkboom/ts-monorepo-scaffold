import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { Action } from 'redux';
import * as sagas from '../sagas';
import * as actions from '../actions';
import { getWebApi } from '../../Api/sagas';
import { sampleContent } from '../__fixtures__/actions';
import { fail, success } from '../../Logging/actions';
import { correlate } from '../../../middleware/correlate-redux-middleware';

describe('Content > Sagas', () => {
  let FAKE_ACTION: Action<'CONTENT__LOAD'>;
  let FAKE_NULL_WEB_API: any;
  let FAKE_WEB_API: any;
  let FAKE_NO_CONTENT: any;

  beforeEach(() => {
    FAKE_ACTION = correlate(actions.loadContent(), 'CORRELATION_ID');
    FAKE_NULL_WEB_API = null;
    FAKE_NO_CONTENT = null;
    FAKE_WEB_API = {
      content: () => FAKE_NO_CONTENT,
    };
  });

  describe('Load Content Saga', () => {
    it('should fail if the web api client could not be retrieved', () => {
      // Arrange
      // Act
      // Assert
      return expectSaga(sagas.loadContentSaga, FAKE_ACTION)
        .provide([[matchers.call.fn(getWebApi), FAKE_NULL_WEB_API]])
        .put.like({ action: fail(FAKE_ACTION) })
        .run();
    });

    it('should request content if the web api is available', () => {
      // Arrange
      // Act
      // Assert
      return expectSaga(sagas.loadContentSaga, FAKE_ACTION)
        .provide([[matchers.call.fn(getWebApi), FAKE_WEB_API], [matchers.call.fn(FAKE_WEB_API.content), FAKE_NO_CONTENT]])
        .call.fn(FAKE_WEB_API.content)
        .run();
    });

    it('should fail if no content was retrieved', () => {
      // Arrange
      // Act
      // Assert
      return expectSaga(sagas.loadContentSaga, FAKE_ACTION)
        .provide([[matchers.call.fn(getWebApi), FAKE_WEB_API], [matchers.call.fn(FAKE_WEB_API.content), FAKE_NO_CONTENT]])
        .put.like({ action: fail(FAKE_ACTION) })
        .run();
    });

    it('should set content if it was successfully retrieved', () => {
      // Arrange
      // Act
      // Assert
      return expectSaga(sagas.loadContentSaga, FAKE_ACTION)
        .provide([[matchers.call.fn(getWebApi), FAKE_WEB_API], [matchers.call.fn(FAKE_WEB_API.content), sampleContent]])
        .put.like({ action: actions.setContent(sampleContent) })
        .run();
    });

    it('should dispatch success if content was successfully set', () => {
      // Arrange
      // Act
      // Assert
      return expectSaga(sagas.loadContentSaga, FAKE_ACTION)
        .provide([[matchers.call.fn(getWebApi), FAKE_WEB_API], [matchers.call.fn(FAKE_WEB_API.content), sampleContent]])
        .put.like({ action: success(FAKE_ACTION) })
        .run();
    });

    it('should match the snapshot if content was successfully set', async () => {
      // Arrange
      // Act
      // Assert
      const result = await expectSaga(sagas.loadContentSaga, FAKE_ACTION)
        .provide([[matchers.call.fn(getWebApi), FAKE_WEB_API], [matchers.call.fn(FAKE_WEB_API.content), sampleContent]])
        .run();

      expect(result.toJSON()).toMatchSnapshot();
    });
  });
});
