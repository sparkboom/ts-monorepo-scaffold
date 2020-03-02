import { CheckStatus, JwtError, ConfigError, Check } from './types';

// Types
interface AppInitAction {
  (): {
    type: 'APP__INIT';
    correlationId: '%%APP_NAME%%_KERNEL';
  };
}
interface AppSetCheckStatusAction {
  (check: Check, status: CheckStatus, error: JwtError | ConfigError | null): {
    type: 'APP__SET_CHECK_STATUS';
    payload: {
      check: Check;
      status: CheckStatus;
      error: string | null;
    };
  };
}

// Actions
export const appInit: AppInitAction = () => ({
  type: 'APP__INIT',
  correlationId: '%%APP_NAME%%_KERNEL',
});

export const appSetCheckStatus: AppSetCheckStatusAction = (check, status, error = null) => ({
  type: 'APP__SET_CHECK_STATUS',
  payload: {
    check,
    status,
    error,
  },
});
