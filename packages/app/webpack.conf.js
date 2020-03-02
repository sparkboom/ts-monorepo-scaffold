const webpack = require('webpack');
const merge = require('webpack-merge');
const { resolve } = require('path');
const CONFIG_BUILDERS = {
  app: require('./config/webpack.app.conf'),
  optimize: require(`../../config/webpack.optimize.conf`),
  analyze: require(`../../config/webpack.analyze.conf`),
};

module.exports = (env = {}, args) => {

  // 1. Choose a target environment 'development' or 'production'
  const cliEnv = Object.keys(env).filter(k => env[k]);

  const mapEnv = env =>
    ({
      dev: 'development',
      prod: 'production',
      production: 'production',
      development: 'development',
    }[env]);

  const targetEnv = cliEnv.includes('production') || mapEnv(process.env.NODE_ENV) || 'production';

  console.log(`Webpack cli env='${JSON.stringify(env)}', node env='${process.env.NODE_ENV}', effective env='${targetEnv}'`);

  // 2. Build configuration object
  const CONFIG = {
    title: '%%APP_TITLE%%',
    targetEnv,
    analyze: cliEnv.includes('analyze'),
    optimize: false,
    assetBasePath: 'v2',
  };

  // 3. Perform webpack transformations on the webpack configuration
  let webpackConf = CONFIG_BUILDERS.app(CONFIG);
  webpackConf = require(`../../config/webpack.${CONFIG.targetEnv}.conf`)(CONFIG, webpackConf);
  webpackConf = CONFIG_BUILDERS.optimize(CONFIG, webpackConf);
  webpackConf = CONFIG_BUILDERS.analyze(CONFIG, webpackConf);

  // 4. Print effective configuration when building
  console.log(webpackConf);

  return webpackConf;
};
