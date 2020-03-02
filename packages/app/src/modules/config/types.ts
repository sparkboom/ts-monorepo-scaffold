import config from '../../../static/config/leadcap.json';
import featureToggles from '../../../static/config/feature-toggles.json';

// Types

/**
 * Platform expresses the platform the parent browser frame is using.
 *
 * SALES_CLOUD - Sales Cloud
 *
 * MARKETING_CLOUD - Marketing Cloud
 *
 * STAND_ALONE - No parent frame, likely development or test environment
 *
 * UNKNOWN - Could not be determined during runtime, this would indicate a bug.
 *
 * null - No checks have been performed yet to determine which platform is being used
 */
export type Platform = 'SALES_CLOUD' | 'MARKETING_CLOUD' | 'STAND_ALONE' | 'UNKNOWN' | null;
export type LeadCapFileConfig = typeof config;
export type FeatureToggles = typeof featureToggles;
export type LeadCapConfig = LeadCapFileConfig & {
  featureToggles?: FeatureToggles;
  endpoints: {
    web: Endpoint;
  };
  platform: Platform;
};
export interface FacebookConfig {
  appId: number;
}

export interface Endpoint {
  baseUrl: string;
  basePath?: string;
}
