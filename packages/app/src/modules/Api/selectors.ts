import { createSelector } from 'reselect';
import { ClientCmdApi, ClientQueryApi, Configuration, ClientWebApi } from '@%%APP_NAME%%/api';
import { get } from 'lodash-es';
import { queryEndpointSelector, commandEndpointSelector, webEndpointSelector } from '../config/selectors';
import { Endpoint } from '../config/types';
import { Api, Token } from './types';
import { Search } from 'history';

// Types
type ApiClient = typeof ClientCmdApi | typeof ClientQueryApi | typeof ClientWebApi;
interface CreateApi {
  (Api: ApiClient, endpoint: Endpoint | null, token: Api['token']): ClientCmdApi | ClientQueryApi | ClientWebApi | null;
}

// Helpers
const createApi: CreateApi = (Api, endpoint, token) => {
  if (!endpoint || !token || !token.jwt) {
    return null;
  }
  const apiConfig = new Configuration({
    basePath: endpoint.baseUrl,
    accessToken: token.jwt,
  });
  return new Api(apiConfig);
};

// Selectors
export const routerQuerySelector = (state: RootState): Search | null => get(state, 'router.location.search', null);
export const tokenSelector = (state: RootState): Token | null => {
  const rawToken: Token | null = get(state, 'api.token', null);
  if (!rawToken) {
    return null;
  }
  return {
    ...rawToken,
    expiryTimeStamp: Number(rawToken.expiryTimeStamp),
  };
};

// Memoized Selectors
export const querySelector = createSelector(
  routerQuerySelector,
  (routerQuery: Search | null) => {
    if (!routerQuery) {
      return {};
    }
    const kvPairs = routerQuery.substr(1).split('&');
    const queryByKey = kvPairs.reduce((acc, q) => {
      const kv = q.split('=');
      return {
        ...acc,
        [kv[0]]: kv[1],
      };
    }, {});
    return queryByKey;
  },
);

export const queryApiSelector = createSelector(
  queryEndpointSelector,
  tokenSelector,
  (queryEndpoint, token) => {
    const api = createApi(ClientQueryApi, queryEndpoint, token) as ClientQueryApi;
    return api;
  },
);

export const commandApiSelector = createSelector(
  commandEndpointSelector,
  tokenSelector,
  (commandEndpoint, token) => {
    const api = createApi(ClientCmdApi, commandEndpoint, token) as ClientCmdApi;
    return api;
  },
);

export const webApiSelector = createSelector(
  webEndpointSelector,
  webEndpoint => {
    if (!webEndpoint) {
      return null;
    }
    const apiConfig = new Configuration({
      basePath: `${webEndpoint.baseUrl}${webEndpoint.basePath}`,
    });
    return new ClientWebApi(apiConfig);
  },
);
