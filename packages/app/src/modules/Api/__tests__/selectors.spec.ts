import * as selectors from '../selectors';
import { intialRouterState, initialApiState } from '../__fixtures__/state';

// Constants
const EXAMPLE_TOKEN = {
  jwt: 'THIS_IS_A_TEST_JWT',
  expiryTimeStamp: 1571613691508,
};

// Global Mocks
jest.mock('../../config/selectors', () => ({
  __esModule: true,
  queryEndpointSelector: () => ({ baseUrl: 'http://query.testurl.com' }),
  commandEndpointSelector: () => ({ baseUrl: 'http://cmd.testurl.com' }),
  webEndpointSelector: () => ({ baseUrl: 'http://web.testurl.com', basePath: '/' }),
}));

// Tests
describe('Api > Selectors', () => {
  describe('Token Selector', () => {
    it('should retrieve a token', () => {
      // Arrange
      const token = EXAMPLE_TOKEN;
      const initialState = initialApiState(token);

      // Act
      const selectedToken = selectors.tokenSelector(initialState as RootState);

      // Assert
      expect(selectedToken).toEqual(token);
    });
  });

  describe('Router Query Selector', () => {
    it('should retrieve assosiative query params from store', () => {
      // Arrange
      const jwt = 'THIS_IS_A_TEST_JWT_FOR_DEVELOPMENT';
      const expiresInSeconds = 3600;
      const initialState = intialRouterState(jwt, expiresInSeconds);

      // Act
      const query = selectors.routerQuerySelector(initialState as RootState);

      // Assert
      expect(query).toEqual(`?jwt=${jwt}&expiresInSeconds=${expiresInSeconds}`);
    });
  });

  describe('Query Selector', () => {
    it('should retrieve assosiative array of query params', () => {
      // Arrange
      const jwt = 'TEST_JWT';
      const expiresInSeconds = 3600;
      const initialState = intialRouterState(jwt, expiresInSeconds);

      // Act
      const query = selectors.querySelector(initialState as RootState);

      // Assert
      expect(query).toEqual({ jwt, expiresInSeconds: `${expiresInSeconds}` });
    });
  });

  describe('Query API Selector', () => {
    let token: any = null;
    let initialState: any = null;

    beforeEach(() => {
      token = EXAMPLE_TOKEN;
      initialState = {
        ...initialApiState(token),
        ...intialRouterState(token.jwt, 3600),
      };
    });

    it('should be null if no token is available', () => {
      // Arrange
      initialState = {
        ...initialApiState(null),
        ...intialRouterState(null, 3600),
      };

      // Act
      const queryApi = selectors.queryApiSelector(initialState as RootState);

      // Assert
      expect(queryApi).toBeNull();
    });

    it('should be a query API instance if a token is available', () => {
      // Arrange

      // Act
      const queryApi = selectors.queryApiSelector(initialState as RootState);

      // Assert
      expect(queryApi.constructor.name).toEqual('ClientQueryApi');
    });

    it('should be a query API instance containing access token and base path if a token is available', () => {
      // Arrange

      // Act
      const queryApi = selectors.queryApiSelector(initialState as RootState);

      // Assert
      expect(queryApi).toMatchObject({
        configuration: {
          configuration: {
            accessToken: token.jwt,
            basePath: 'http://query.testurl.com',
          },
        },
      });
    });
  });

  describe('Command API Selector', () => {
    let token: any = null;
    let initialState: any = null;

    beforeEach(() => {
      token = EXAMPLE_TOKEN;
      initialState = {
        ...initialApiState(token),
        ...intialRouterState(token.jwt, 3600),
      };
    });

    it('should be null if no token is available', () => {
      // Arrange
      initialState = {
        ...initialApiState(null),
        ...intialRouterState(null, 3600),
      };

      // Act
      const cmdApi = selectors.commandApiSelector(initialState as RootState);

      // Assert
      expect(cmdApi).toBeNull();
    });

    it('should be a command API instance if a token is available', () => {
      // Arrange

      // Act
      const cmdApi = selectors.commandApiSelector(initialState as RootState);

      // Assert
      expect(cmdApi.constructor.name).toEqual('ClientCmdApi');
    });

    it('should be a command API instance containing access token and base path if a token is available', () => {
      // Arrange

      // Act
      const cmdApi = selectors.commandApiSelector(initialState as RootState);

      // Assert
      expect(cmdApi).toMatchObject({
        configuration: {
          configuration: {
            accessToken: token.jwt,
            basePath: 'http://cmd.testurl.com',
          },
        },
      });
    });
  });

  describe('Web API Selector', () => {
    it('should create a Web API instance', () => {
      // Arrange
      const initialState = {
        ...initialApiState(EXAMPLE_TOKEN),
        ...intialRouterState(EXAMPLE_TOKEN.jwt, 3600),
      };

      // Act
      const webApi = selectors.webApiSelector(initialState as RootState);

      // Assert
      expect(webApi && webApi.constructor.name).toEqual('ClientWebApi');
    });

    it('should create a Web API instance containing base path if configured', () => {
      // Arrange
      const initialState = {
        ...initialApiState(EXAMPLE_TOKEN),
        ...intialRouterState(EXAMPLE_TOKEN.jwt, 3600),
      };

      // Act
      const webApi = selectors.webApiSelector(initialState as RootState);

      // Assert
      expect(webApi).toMatchObject({
        configuration: {
          configuration: {
            basePath: 'http://web.testurl.com/',
          },
        },
      });
    });
  });
});
