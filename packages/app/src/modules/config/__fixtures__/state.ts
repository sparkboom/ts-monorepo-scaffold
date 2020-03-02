import { LeadCapConfig } from '../types';

// State
export const simpleState: Partial<LeadCapConfig> = {
  tasks: {
    taskUpdateFrequencyMs: 10,
  },
  featureToggles: {
    supportMultiSelect: true,
    supportColumnSort: true,
    supportReAuthAllTasks: true,
    supportBulkDelete: true,
    supportFilter: true,
    supportSearch: true,
  },
  endpoints: {
    command: {
      baseUrl: 'http://cmd-leadcap.example.com',
    },
    query: {
      baseUrl: 'http://query-leadcap.example.com',
    },
    web: {
      baseUrl: 'http://web-leadcap.example.com',
      basePath: '',
    },
  },
  platform: null,
};

export const emptyState: Partial<LeadCapConfig> = {};
