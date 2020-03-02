/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const merge = require('webpack-merge');

const JWT = 'THIS_IS_A_TEST_JWT_FOR_DEVELOPMENT';
const EXPIRY = '3600';

module.exports = (config, webpackConfig = {}) =>
  merge(webpackConfig, {
    output: {
      filename: 'app.js',
    },
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
      https: true,
      contentBase: './dist',
      hot: true,
      openPage: `v2.html?jwt=${JWT}&expiresInSeconds=${EXPIRY}`,
    },
    performance: {
      hints: false,
      maxEntrypointSize: 3000000,
      maxAssetSize: 3000000
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new WebpackBuildNotifierPlugin({
        title: config.title,
        sound: 'Pop',
        successSound: 'Morse',
        warningSound: 'Funk',
        failureSound: 'Bottle',
        compilationSound: 'Tink',
        suppressSuccess: false,
        suppressWarning: false,
        suppressCompileStart: true,
        activateTerminalOnError: false,
      }),
      new webpack.DefinePlugin({
        WEBPACK__IS_PROD: false,
      }),
    ],
  });
