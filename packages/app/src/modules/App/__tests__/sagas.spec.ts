import { expectSaga } from 'redux-saga-test-plan';
import { select } from 'redux-saga/effects';
import * as actions from '../actions';
import { isAppReadySelector } from '../selectors';
import { initTasks } from '../../Tasks/actions';
import { loadContent } from '../../Content/actions';
import { loadConfig, loadFeatureToggles } from '../../config/actions';
import * as sagas from '../sagas';
import { apiInit } from '../../Api/actions';

describe('App > Sagas', () => {
  let FAKE_ACTION: ReturnType<typeof actions.appInit>;

  beforeEach(() => {
    FAKE_ACTION = actions.appInit();
  });

  describe('appInitSaga', () => {
    it('should initiated configuration check to `in progress`', () => {
      // Arrange
      // Act
      // Assert
      return expectSaga(sagas.appInitSaga, FAKE_ACTION)
        .put.like({ action: actions.appSetCheckStatus('config', 'APP_CHECK__IN_PROGRESS', null) })
        .run();
    });

    it('should dispatch load config action', () => {
      // Arrange
      // Act
      // Assert
      return expectSaga(sagas.appInitSaga, FAKE_ACTION)
        .put.like({ action: loadConfig() })
        .run();
    });

    it('should dispatch load content action', () => {
      // Arrange
      // Act
      // Assert
      return expectSaga(sagas.appInitSaga, FAKE_ACTION)
        .put.like({ action: loadContent() })
        .run();
    });

    it('should dispatch load feature toggles action', () => {
      // Arrange
      // Act
      // Assert
      return expectSaga(sagas.appInitSaga, FAKE_ACTION)
        .put.like({ action: loadFeatureToggles() })
        .run();
    });

    it('should dispatch api initialization action', () => {
      // Arrange
      // Act
      // Assert
      return expectSaga(sagas.appInitSaga, FAKE_ACTION)
        .put.like({ action: apiInit() })
        .run();
    });

    it('should match snapshot', async () => {
      // Arrange
      // Act
      // Assert
      const result = await expectSaga(sagas.appInitSaga, FAKE_ACTION)
        .put.like({ action: apiInit() })
        .run();

      expect(result.toJSON()).toMatchSnapshot();
    });
  });

  describe('appLoadSaga', () => {
    it('should not dispatch init tasks action if app is not ready', () => {
      // Arrange
      const FAKE_IS_APP_READY = false;

      // Act
      // Assert
      return expectSaga(sagas.appLoadSaga, FAKE_ACTION)
        .provide([[select(isAppReadySelector), FAKE_IS_APP_READY]])
        .not.put.like({ action: initTasks() })
        .run();
    });

    it('should dispatch init tasks action if app is ready', () => {
      // Arrange
      const FAKE_IS_APP_READY = true;

      // Act
      // Assert
      return expectSaga(sagas.appLoadSaga, FAKE_ACTION)
        .provide([[select(isAppReadySelector), FAKE_IS_APP_READY]])
        .put.like({ action: initTasks() })
        .run();
    });

    it('should match snapshot if app is ready', async () => {
      // Arrange
      const FAKE_IS_APP_READY = true;

      // Act
      // Assert
      const result = await expectSaga(sagas.appLoadSaga, FAKE_ACTION)
        .provide([[select(isAppReadySelector), FAKE_IS_APP_READY]])
        .put.like({ action: initTasks() })
        .run();

      expect(result.toJSON()).toMatchSnapshot();
    });
  });
});
