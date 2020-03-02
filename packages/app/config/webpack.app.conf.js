/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const fs = require('fs');

const PATH_TEXTS = resolve('./static/texts');
const PATH_CONFIG = resolve('./static/config');

module.exports = (config, webpackConf = {}) =>
  merge(webpackConf, {
    context: process.cwd(), // to automatically find tsconfig.json
    entry: [resolve('src/index.tsx')],
    output: {
      path: resolve(`dist`),
      publicPath: '/',
    },
    module: {
      rules: [
        // Most app files
        {
          test: [/\.jsx?$/, /\.tsx?$/],
          include: [resolve('src')],
          use: 'babel-loader',
        },
        // API dependency
        {
          test: [/\.jsx?$/, /\.tsx?$/],
          include: [resolve('../api'), resolve('../ux')],
          use: {
            loader: 'babel-loader',
            // By manually putting in the .babelrc options here, the api dependency will build
            // This issue is described in https://github.com/babel/babel/issues/9528
            options: {
              presets: ['@babel/env', '@babel/react', '@babel/typescript'],
              plugins: [
                '@babel/plugin-proposal-export-default-from',
                '@babel/plugin-transform-runtime',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-export-namespace-from',
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(svg|gif|jpe?g|png)$/,
          use: 'url-loader?limit=10000',
        },
        {
          test: /\.(eot|woff|woff2|ttf)$/,
          use: `url-loader?limit=30&name=${config.assetBasePath}/assets/fonts/webfonts/[name].[ext]`,
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: config.title,
        filename: 'index.html',
        template: resolve(`static/index.html`),
      }),
      // TODO: some of these assets should be imported in-code, and webpack should handle the copying
      new CopyPlugin([
        {
          from: PATH_TEXTS,
          to: `${config.assetBasePath}/texts/`,
        },
        {
          from: PATH_CONFIG,
          to: `${config.assetBasePath}/config/`,
          transform(content, path) {
            let contentStr = content.toString();
            Object.entries(replaceConfigTexts).forEach(([k, v]) => contentStr = contentStr.replace(k,v || ''));
            return contentStr;
          },
        },
      ]),
      new webpack.DefinePlugin({
        WEBPACK__IS_PROD: webpackConf.targetEnv === 'production'
      }),
    ],
  });
