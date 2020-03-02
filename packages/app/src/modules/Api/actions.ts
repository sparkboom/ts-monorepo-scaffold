import { Action } from 'redux';

// Types
interface ApiSetTokenAction {
  (jwt: string, expiryTimeStamp: number): AppAction<'API__SET_TOKEN', { jwt: string; expiryTimeStamp: number }>;
}
interface ApiInitAction {
  (): Action<'API__INIT'>;
}

// Actions
export const apiSetToken: ApiSetTokenAction = (jwt, expiryTimeStamp) => ({
  type: 'API__SET_TOKEN',
  payload: {
    jwt,
    expiryTimeStamp,
  },
});

export const apiInit: ApiInitAction = () => ({
  type: 'API__INIT',
});
