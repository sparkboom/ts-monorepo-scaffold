import { get } from 'lodash-es';
import { Endpoint, FeatureToggles, LeadCapConfig, Platform, FacebookConfig } from './types';

// Direct Selectors
export const queryEndpointSelector = (state: RootState): Endpoint | null => get(state, 'config.endpoints.query', null);
export const commandEndpointSelector = (state: RootState): Endpoint | null => get(state, 'config.endpoints.command', null);
export const webEndpointSelector = (state: RootState): Endpoint | null => get(state, 'config.endpoints.web', null);
export const featureTogglesSelector = (state: RootState): FeatureToggles | null => get(state, 'config.featureToggles', null);
export const tasksConfigSelector = (state: RootState): LeadCapConfig['tasks'] | null => get(state, 'config.tasks', null);
export const platformSelector = (state: RootState): Platform | null => get(state, 'config.platform', null);
export const facebookConfigSelector = (state: RootState): FacebookConfig | null => get(state, 'config.providers.facebook', null);
