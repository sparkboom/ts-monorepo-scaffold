const { resolve, join } = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const SRC_PATH = join(__dirname, '../src');
const LIGHTNING_PATH = resolve(join(__dirname, '../../../node_modules/@salesforce'));
const LIGHTNING_UX_PATH = resolve(join(__dirname, '../../../node_modules/@salesforce-ux/design-system/assets'));

module.exports = ({ config }) => {
  config.module.rules = [
    ...config.module.rules,

    // This compiles the source code itself to the storybook
    {
      test: /\.stories\.jsx?$/,
      loaders: [require.resolve('@storybook/source-loader')],
      enforce: 'pre',
    },

    // TODO: this was copied from the app web.config, perhaps consider putting this in a shared package?
    {
      test: [/\.jsx?$/, /\.tsx?$/],
      include: [SRC_PATH],
      use: [
        {
          loader: 'babel-loader',
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
        {
          loader: 'react-docgen-typescript-loader',
        },
      ],
    },

    // Lightning Dependency
    // TODO: as above, doesn't seem to be compiling!
    {
      test: [/\.jsx?$/, /\.tsx?$/],
      include: [LIGHTNING_PATH],
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
            {
              plugins: [
                '@babel/plugin-proposal-export-default-from',
                '@babel/plugin-proposal-export-namespace-from',
                [
                  '@babel/plugin-proposal-class-properties',
                  {
                    loose: true,
                  },
                ],
              ],
            },
          ],
        },
      },
    },

    // {
    //   test: /\.css$/,
    //   use: ['style-loader', 'css-loader'],
    // },

    {
      test: /\.(svg|gif|jpe?g|png)$/,
      use: 'url-loader?limit=10000',
    },

    {
      test: /\.(eot|woff|woff2|ttf)$/,
      use: 'url-loader?limit=30&name=assets/fonts/webfonts/[name].[ext]',
    },
  ];

  config.resolve.extensions.push('.ts', '.tsx', '.js', '.jsx');

  config.plugins = [
    ...config.plugins,
    new CopyPlugin([
      {
        from: resolve(`${LIGHTNING_UX_PATH}/fonts`),
        to: 'assets/fonts',
      },
      {
        from: resolve(`${LIGHTNING_UX_PATH}/icons/standard-sprite/svg/symbols.svg`),
        to: 'assets/icons/standard-sprite/svg',
      },
      {
        from: resolve(`${LIGHTNING_UX_PATH}/icons/utility-sprite/svg/symbols.svg`),
        to: 'assets/icons/utility-sprite/svg',
      },
      {
        from: resolve(`${LIGHTNING_UX_PATH}/images/themes/oneSalesforce/banner-brand-default.png`),
        to: 'assets/images/themes/oneSalesforce',
      },
    ]),
  ];
  return config;
};
