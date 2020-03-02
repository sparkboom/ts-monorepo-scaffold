import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as sagas from '../sagas';
import * as actions from '../actions';
import * as responses from '../__fixtures__/responses';
import { getWebApi, getQueryApi } from '../../Api/sagas';
import { status, fail, success } from '../../Logging/actions';
import { correlate } from '../../../middleware/correlate-redux-middleware';

describe('Config > Sagas', () => {
  describe('loadConfigSaga', () => {
    let FAKE_ACTION: any;
    let FAKE_GLOBAL: any;
    let FAKE_CONFIG: any;

    beforeEach(() => {
      FAKE_ACTION = correlate(actions.loadConfig(), 'CORRELATION_ID');
      FAKE_GLOBAL = {};
      FAKE_CONFIG = {
        option1: true,
      };
    });

    it('should set configuration check to `in progress`', () => {
      // Arrange
      // Act
      // Assert
      return expectSaga(sagas.loadConfigSaga, FAKE_ACTION, FAKE_GLOBAL)
        .put(status(FAKE_ACTION, 'IN_PROGRESS'))
        .run();
    });

    it('should fail if the Web API client could not be retrieved', () => {
      // Arrange
      const FAKE_NULL_WEB_API = null;

      // Act
      // Assert
      return expectSaga(sagas.loadConfigSaga, FAKE_ACTION, FAKE_GLOBAL)
        .provide([[matchers.call.fn(getWebApi), FAKE_NULL_WEB_API]])
        .put(fail(FAKE_ACTION))
        .run();
    });

    it('should load the configuration file if the Web API client is available', () => {
      // Arrange
      const FAKE_WEB_API = {
        config: () => FAKE_CONFIG,
      };

      // Act
      // Assert
      return expectSaga(sagas.loadConfigSaga, FAKE_ACTION, FAKE_GLOBAL)
        .provide([[matchers.call.fn(getWebApi), FAKE_WEB_API], [matchers.call.fn(FAKE_WEB_API.config), FAKE_CONFIG], [matchers.call.fn(getQueryApi), null]])
        .call.fn(FAKE_WEB_API.config)
        .run();
    });

    it('should fail if the Query API client could not be retrieved', () => {
      // Arrange
      const FAKE_WEB_API = {
        config: () => FAKE_CONFIG,
      };

      // Act
      // Assert
      return expectSaga(sagas.loadConfigSaga, FAKE_ACTION, FAKE_GLOBAL)
        .provide([[matchers.call.fn(getWebApi), FAKE_WEB_API], [matchers.call.fn(FAKE_WEB_API.config), FAKE_CONFIG], [matchers.call.fn(getQueryApi), null]])
        .put(fail(FAKE_ACTION))
        .run();
    });

    it('should call getCapabilites if Query API client is available', () => {
      // Arrange
      const FAKE_WEB_API = {
        config: () => FAKE_CONFIG,
      };
      const FAKE_QUERY_API = {
        getCapabilities: () => responses.marketingcloudCapabilities,
      };

      // Act
      // Assert
      return expectSaga(sagas.loadConfigSaga, FAKE_ACTION, FAKE_GLOBAL)
        .provide([
          [matchers.call.fn(getWebApi), FAKE_WEB_API],
          [matchers.call.fn(FAKE_WEB_API.config), FAKE_CONFIG],
          [matchers.call.fn(getQueryApi), FAKE_QUERY_API],
          [matchers.call.fn(FAKE_QUERY_API.getCapabilities), responses.marketingcloudCapabilities],
        ])
        .call.fn(FAKE_QUERY_API.getCapabilities)
        .run();
    });

    it('should set the platform to `STAND_ALONE` if there is no container global', () => {
      // Arrange
      const FAKE_WEB_API = {
        config: () => FAKE_CONFIG,
      };
      const FAKE_QUERY_API = {
        getCapabilities: () => responses.marketingcloudCapabilities,
      };
      const FAKE_GLOBAL_STAND_ALONE: any = {};
      FAKE_GLOBAL_STAND_ALONE.top = FAKE_GLOBAL_STAND_ALONE;

      // Act
      // Assert
      return expectSaga(sagas.loadConfigSaga, FAKE_ACTION, FAKE_GLOBAL_STAND_ALONE)
        .provide([
          [matchers.call.fn(getWebApi), FAKE_WEB_API],
          [matchers.call.fn(FAKE_WEB_API.config), FAKE_CONFIG],
          [matchers.call.fn(getQueryApi), FAKE_QUERY_API],
          [matchers.call.fn(FAKE_QUERY_API.getCapabilities), responses.marketingcloudCapabilities],
        ])
        .put.like({ action: actions.setConfig({ platform: 'STAND_ALONE' }) })
        .run();
    });

    it('should set the platform to `MARKETING_CLOUD` if the capabilities endpoint returns true for dataExtensions', () => {
      // Arrange
      const FAKE_WEB_API = {
        config: () => FAKE_CONFIG,
      };
      const FAKE_QUERY_API = {
        getCapabilities: () => responses.marketingcloudCapabilities,
      };

      // Act
      // Assert
      return expectSaga(sagas.loadConfigSaga, FAKE_ACTION, FAKE_GLOBAL)
        .provide([
          [matchers.call.fn(getWebApi), FAKE_WEB_API],
          [matchers.call.fn(FAKE_WEB_API.config), FAKE_CONFIG],
          [matchers.call.fn(getQueryApi), FAKE_QUERY_API],
          [matchers.call.fn(FAKE_QUERY_API.getCapabilities), responses.marketingcloudCapabilities],
        ])
        .put.like({ action: actions.setConfig({ platform: 'MARKETING_CLOUD' }) })
        .run();
    });

    it('should set the platform to `SALES_CLOUD` if the capabilities endpoint returns true for leadObject', () => {
      // Arrange
      const FAKE_WEB_API = {
        config: () => FAKE_CONFIG,
      };
      const FAKE_QUERY_API = {
        getCapabilities: () => responses.salescloudCapabilities,
      };

      // Act
      // Assert
      return expectSaga(sagas.loadConfigSaga, FAKE_ACTION, FAKE_GLOBAL)
        .provide([
          [matchers.call.fn(getWebApi), FAKE_WEB_API],
          [matchers.call.fn(FAKE_WEB_API.config), FAKE_CONFIG],
          [matchers.call.fn(getQueryApi), FAKE_QUERY_API],
          [matchers.call.fn(FAKE_QUERY_API.getCapabilities), responses.salescloudCapabilities],
        ])
        .put.like({ action: actions.setConfig({ platform: 'SALES_CLOUD' }) })
        .run();
    });

    it('should set the platform to `UNKNOWN` if the capabilities endpoint returns fasle for both dataExtensions and leadObject', () => {
      // Arrange
      const FAKE_WEB_API = {
        config: () => FAKE_CONFIG,
      };
      const FAKE_QUERY_API = {
        getCapabilities: () => {},
      };

      // Act
      // Assert
      return expectSaga(sagas.loadConfigSaga, FAKE_ACTION, FAKE_GLOBAL)
        .provide([
          [matchers.call.fn(getWebApi), FAKE_WEB_API],
          [matchers.call.fn(FAKE_WEB_API.config), FAKE_CONFIG],
          [matchers.call.fn(getQueryApi), FAKE_QUERY_API],
          [matchers.call.fn(FAKE_QUERY_API.getCapabilities), {}],
        ])
        .put.like({ action: actions.setConfig({ platform: 'UNKNOWN' }) })
        .run();
    });

    it('should dispatch a success action if configuration was set', () => {
      // Arrange
      const FAKE_WEB_API = {
        config: () => FAKE_CONFIG,
      };
      const FAKE_QUERY_API = {
        getCapabilities: () => responses.marketingcloudCapabilities,
      };

      // Act
      // Assert
      return expectSaga(sagas.loadConfigSaga, FAKE_ACTION, FAKE_GLOBAL)
        .provide([
          [matchers.call.fn(getWebApi), FAKE_WEB_API],
          [matchers.call.fn(FAKE_WEB_API.config), FAKE_CONFIG],
          [matchers.call.fn(getQueryApi), FAKE_QUERY_API],
          [matchers.call.fn(FAKE_QUERY_API.getCapabilities), responses.marketingcloudCapabilities],
        ])
        .put.like({ action: success(FAKE_ACTION) })
        .run();
    });

    it('should match snapshot for Marketing Cloud platform', async () => {
      // Arrange
      const FAKE_WEB_API = {
        config: () => FAKE_CONFIG,
      };
      const FAKE_QUERY_API = {
        getCapabilities: () => responses.marketingcloudCapabilities,
      };

      // Act
      // Assert
      const result = await expectSaga(sagas.loadConfigSaga, FAKE_ACTION, FAKE_GLOBAL)
        .provide([
          [matchers.call.fn(getWebApi), FAKE_WEB_API],
          [matchers.call.fn(FAKE_WEB_API.config), FAKE_CONFIG],
          [matchers.call.fn(getQueryApi), FAKE_QUERY_API],
          [matchers.call.fn(FAKE_QUERY_API.getCapabilities), responses.marketingcloudCapabilities],
        ])
        .run();

      expect(result.toJSON()).toMatchSnapshot();
    });

    it('should match snapshot for Sales Cloud platform', async () => {
      // Arrange
      const FAKE_WEB_API = {
        config: () => FAKE_CONFIG,
      };
      const FAKE_QUERY_API = {
        getCapabilities: () => responses.salescloudCapabilities,
      };

      // Act
      // Assert
      const result = await expectSaga(sagas.loadConfigSaga, FAKE_ACTION, FAKE_GLOBAL)
        .provide([
          [matchers.call.fn(getWebApi), FAKE_WEB_API],
          [matchers.call.fn(FAKE_WEB_API.config), FAKE_CONFIG],
          [matchers.call.fn(getQueryApi), FAKE_QUERY_API],
          [matchers.call.fn(FAKE_QUERY_API.getCapabilities), responses.salescloudCapabilities],
        ])
        .run();

      expect(result.toJSON()).toMatchSnapshot();
    });
  });

  describe('loadFeatureTogglesSaga', () => {
    it('should fail if the Web API Client could not be retrieved', () => {
      // Arrange
      const FAKE_ACTION = actions.loadFeatureToggles();
      const FAKE_NULL_WEB_API = null;

      // Act
      // Assert
      return expectSaga(sagas.loadFeatureTogglesSaga, FAKE_ACTION)
        .provide([[matchers.call.fn(getWebApi), FAKE_NULL_WEB_API]])
        .not.put.like(actions.setFeatureToggles({}))
        .run();
    });

    it('should retrieve feature toggles from the API, and then dispatch a feature toggle set action', () => {
      // Arrange
      const FAKE_ACTION = actions.loadFeatureToggles();
      const FAKE_FEATURE_TOGGLES = {
        feature1: true,
      };
      const FAKE_WEB_API = {
        featureToggles: () => FAKE_FEATURE_TOGGLES,
      };

      // Act
      // Assert
      return expectSaga(sagas.loadFeatureTogglesSaga, FAKE_ACTION)
        .provide([[matchers.call.fn(getWebApi), FAKE_WEB_API], [matchers.call.fn(FAKE_WEB_API.featureToggles), FAKE_FEATURE_TOGGLES]])
        .call(getWebApi, FAKE_ACTION)
        .call.fn(FAKE_WEB_API.featureToggles)
        .put.like({ action: actions.setFeatureToggles(FAKE_FEATURE_TOGGLES) })
        .run();
    });

    it('should match the snapshot', async () => {
      // Arrange
      const FAKE_ACTION = correlate(actions.loadFeatureToggles(), 'CORRELATION_ID');
      const FAKE_FEATURE_TOGGLES = {
        feature1: true,
      };
      const FAKE_WEB_API = {
        featureToggles: () => FAKE_FEATURE_TOGGLES,
      };

      // Act
      const result = await expectSaga(sagas.loadFeatureTogglesSaga, FAKE_ACTION)
        .provide([[matchers.call.fn(getWebApi), FAKE_WEB_API], [matchers.call.fn(FAKE_WEB_API.featureToggles), FAKE_FEATURE_TOGGLES]])
        .run();

      // Assert
      expect(result.toJSON()).toMatchSnapshot();
    });
  });
});
