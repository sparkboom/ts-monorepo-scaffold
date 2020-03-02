export const fullConfiguration = {
  tasks: {
    taskUpdateFrequencyMs: 10000,
  },
  featureToggles: {},
  endpoints: {
    query: {
      baseUrl: 'http://query.example.com/',
    },
    command: {
      baseUrl: 'http://cmd.example.com/',
    },
  },
};

export const partialConfiguration = {
  tasks: {
    taskUpdateFrequencyMs: 10000,
  },
  featureToggles: {},
  endpoints: {
    query: {
      baseUrl: 'http://query.example.com/',
    },
    command: {
      baseUrl: 'http://cmd.example.com/',
    },
  },
};

export const fullFeatureToggles = {
  supportMultiSelect: true,
  supportColumnSort: true,
  supportBulkReAuth: true,
  supportBulkDelete: true,
  supportFilter: true,
  supportSearch: true,
};

export const partialFeatureToggles = {
  supportMultiSelect: false,
  supportColumnSort: false,
  supportSearch: false,
};
