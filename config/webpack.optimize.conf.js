/* eslint-disable import/no-extraneous-dependencies */

/**
 * This optimize configuration may require the following babelrc change to work properly.
 *
 * ["@babel/preset-env", { "modules": false } ],
 */
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { compress } = require('uglify-es').default_options();
const merge = require('webpack-merge');

// Remove unsupported configurations
[
  'arrows',
  'computed_props',
  'ecma',
  'keep_classnames',
  'unsafe_arrows',
  'unsafe_methods',
  'warnings'].forEach(k => delete compress[k]);

// Turn off configurations
Object.entries(compress).forEach( ([k]) => compress[k] = false );

// Turn on unused for tree-shaking
compress.unused = true;

module.exports = (config, webpackConfig = {}) => {
  const optimizedConfig = {
    optimization: {
      minimize: true,
      minimizer: [new UglifyJsPlugin()],
      usedExports: true,
      sideEffects: true,
    },
  };

  return config.optimize ? merge(webpackConfig, optimizedConfig) : webpackConfig;
};
