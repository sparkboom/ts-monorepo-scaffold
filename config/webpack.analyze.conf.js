/* eslint-disable import/no-extraneous-dependencies */
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const Visualizer = require('webpack-visualizer-plugin');
const merge = require('webpack-merge');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const smp = new SpeedMeasurePlugin();

module.exports = (config, webpackConf = {}) => {
  const analyzeConfig = {
    plugins: [
      new BundleAnalyzerPlugin({}),
      new Visualizer({
        filename: './stats/visualizer.html',
      }),
    ],
  };

  return config.analyze ? smp.wrap(merge(webpackConf, analyzeConfig)) : webpackConf;
};

