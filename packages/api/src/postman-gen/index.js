/* eslint-disable no-console */
const postmanGen = require('./postman-gen');

postmanGen
  .loadOpenAPI('api')
  .then(postmanGen.convertToPostman)
  .then(pmData => postmanGen.saveOutput('%%APP_NAME%%', pmData))
  .catch(err => console.error(err));
