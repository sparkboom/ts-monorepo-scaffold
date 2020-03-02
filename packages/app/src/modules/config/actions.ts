/* eslint-disable import/prefer-default-export */
import { Action, DeepPartial } from 'redux';
import { LeadCapConfig, FeatureToggles } from './types';

// Types
type SetContent = (config: DeepPartial<LeadCapConfig>) => AppAction<'CONFIG__SET', DeepPartial<LeadCapConfig>>;
type SetTasks = (toggles: FeatureToggles) => AppAction<'CONFIG__FEATURE_TOGGLES_SET', { featureToggles: FeatureToggles }>;

// Actions
export const setConfig: SetContent = config => ({
  type: 'CONFIG__SET',
  payload: config,
});

export const loadConfig = (): Action<'CONFIG__LOAD'> => ({
  type: 'CONFIG__LOAD',
});

export const setFeatureToggles: SetTasks = toggles => ({
  type: 'CONFIG__FEATURE_TOGGLES_SET',
  payload: {
    featureToggles: toggles,
  },
});

export const loadFeatureToggles = (): Action<'CONFIG__FEATURE_TOGGLES_LOAD'> => ({
  type: 'CONFIG__FEATURE_TOGGLES_LOAD',
});
