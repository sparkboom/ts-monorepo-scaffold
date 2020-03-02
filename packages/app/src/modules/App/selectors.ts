import { createSelector } from 'reselect';
import { isString } from 'lodash-es';
import { allTasksHashSelector } from '../Tasks/selectors';

// Constants
const APP_INIT_STATUSES = ['APP_CHECK__INIT', 'APP_CHECK__IN_PROGRESS'];

// Helpers
const isStillInitializing = (check: string | string[]) => isString(check) && APP_INIT_STATUSES.includes(check);

// Selectors
export const jwtCheckStatusSelector = (state: RootState) => state.app.checks.jwt.status;
export const configCheckStatusSelector = (state: RootState) => state.app.checks.config.status;

export const isAppInitializingSelector = createSelector(
  jwtCheckStatusSelector,
  configCheckStatusSelector,
  (jwtCheck, configCheck) => isStillInitializing(jwtCheck) || isStillInitializing(configCheck),
);

export const isAppReadySelector = createSelector(
  jwtCheckStatusSelector,
  configCheckStatusSelector,
  (jwtCheck, configCheck) => jwtCheck === 'APP_CHECK__SUCCESS' && configCheck === 'APP_CHECK__SUCCESS',
);

export const areTasksReadySelector = createSelector(
  isAppReadySelector,
  allTasksHashSelector,
  (isAppReady, allTasksHash) => isAppReady && allTasksHash !== null,
);
