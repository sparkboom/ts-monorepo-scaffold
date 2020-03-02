import { App } from './types';

const appState: App = {
  checks: {
    jwt: {
      status: 'APP_CHECK__INIT',
      errors: [],
    },
    config: {
      status: 'APP_CHECK__INIT',
      errors: [],
    },
  },
};

export default appState;
