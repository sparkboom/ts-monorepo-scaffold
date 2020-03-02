const { describe, it } = require('parrot-friendly');
const api = require('./mocks');
const dbs = require('./db');

// Constants
const PROXIES = {
  qa: {
    queryBaseUrl: '',
    cmdBaseUrl: '',
  },
};
const TOKEN_EXPIRY_SECS = 300;
const DEFAULT_DELAY_MS = 500;
const OPTS = {
  cmdPrefix: '/_command',
  queryPrefix: '/_query',
  delay: DEFAULT_DELAY_MS,
  dropRate: 1.0 / 3,
  proxy: PROXIES.stable,
  auth: {
    mockKey: 'THIS_IS_A_MOCK_KEY',
    tokenExpirySecs: TOKEN_EXPIRY_SECS,
  },
  dbName: 'random', // 'random' | 'basic'
};

// Helpers
const getOpts = overrideOpts => ({
  ...OPTS,
  ...overrideOpts,
});

// Scenarios
const scenarios = describe('', () => {
  const opts = getOpts();
  const db = dbs.create(opts.dbName);

  it('Basic', () => {

    Object.entries(api).forEach(([, mock]) => mock.ok(opts, db));
  });

  it('Slow Connection', () => {
    const slowOpts = getOpts({
      delay: 6000,
    });
    Object.entries(api).forEach(([, mock]) => mock.ok(slowOpts, db));
  });

  it('Flaky Connection', () => {
    const slowOpts = getOpts({
      delay: 6000,
    });
    Object.entries(api).forEach(([, mock]) => mock.flaky(slowOpts, db));
  });

  it('Unauthorized Token', () => {

    api.postAuthenticationRefreshToken.forbidden(opts, db);

    Object.entries(api)
      .filter(([name]) => name !== 'postAuthenticationRefreshToken')
      .forEach(([, mock]) => mock.ok(opts, db));
  });

  it('Internal Server Error', () => {

    Object.entries(api).forEach(([, mock]) => mock.internalServerError(opts, db));
  });

  it('Proxy - Stable Instance', () => {
    Object.entries(api).forEach(([, mock]) => mock.proxy(opts, db));
  });

  it('Proxy - Unstable Instance', () => {
    const unstableOpts = getOpts({
      proxy: PROXIES.unstable,
    });
    Object.entries(api).forEach(([, mock]) => mock.proxy(unstableOpts, db));
  });

});

module.exports = scenarios;
