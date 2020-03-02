const { resolve } = require('path');
const fs = require('fs');

const babelOptions = JSON.parse(fs.readFileSync(resolve(__dirname, '../.babelrc'), 'utf-8'));
babelOptions.plugins = ['require-context-hook', ...babelOptions.plugins];

module.exports = require('ts-jest').createTransformer({
  tsConfig: resolve(__dirname, '../jest.tsconfig.json'),
  diagnostics: false,
  babelConfig: babelOptions
});
