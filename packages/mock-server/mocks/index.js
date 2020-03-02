/* eslint-disable global-require */
const { get, post } = require('parrot-friendly');
const request = require('request');

// Helpers
const use = (route, opts) => {
  const method = {
    GET: get,
    POST: post,
  }[route.method];

  const prefix = {
    QUERY: opts.queryPrefix,
    CMD: opts.cmdPrefix,
  }[route.api];

  return method(`${prefix}${route.path}`);
};

// Create API, collate all the routes together
const mocks = {

};

// Apply global mock handlers to all routes
const globalMocks = route => {
  const createErrMock = errorCode => opts => use(route, opts).status(errorCode).delay(opts.delay);

  return {
    badRequest: createErrMock(400),
    unauthorized: createErrMock(401),
    forbidden: createErrMock(403),
    notFound: createErrMock(404),
    requestTimeout: createErrMock(408),
    internalServerError: createErrMock(500),
    serviceUnavailable: createErrMock(503),
    flaky: (opts, db) => (Math.random() >= opts.dropRate ? route.ok(opts, db) : createErrMock(500)),
    proxy: opts =>
      use(route, opts)
        .response((req, res) => {
          const baseUrl = {
            QUERY: opts.proxy.queryBaseUrl,
            CMD: opts.proxy.cmdBaseUrl,
          }[route.api];
          const headers = {
            authorization: req.headers.authorization,
            accept: req.headers.accept,
          };
          const proxyPath = `${baseUrl}${route.path}`;
          console.log(`Proxying to ${proxyPath}`);
          return request(proxyPath, { headers, method: route.method }).pipe(res);
        })
        .delay(opts.delay),
  };
};
Object.entries(mocks).forEach(([, route]) => Object.assign(route, globalMocks(route)));

// Export
module.exports = mocks;
