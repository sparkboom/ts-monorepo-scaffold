/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const merge = require('webpack-merge');

module.exports = (config, webpackConfig = {}) =>
  merge(webpackConfig, {
    mode: 'production',
    output: {
      filename: 'app-[hash].js',
    },
    devtool: 'source-maps',
    plugins: [
      new webpack.DefinePlugin({
        WEBPACK__IS_PROD: true,
      }),
    ],
  });
