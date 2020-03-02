import { LeadCapConfig } from './types';

// Constants
const TASK__UPDATE_CYCLE_MS = 60000; /* every minute */

// State
const configState = (web: { baseUrl: string; basePath: string }): Partial<LeadCapConfig> => ({
  tasks: {
    taskUpdateFrequencyMs: TASK__UPDATE_CYCLE_MS,
  },
  featureToggles: {
    supportMultiSelect: false,
    supportColumnSort: false,
    supportReAuthAllTasks: false,
    supportBulkDelete: false,
    supportFilter: false,
    supportSearch: false,
  },
  endpoints: {
    web,
  },
  platform: null,
});

export default configState;
