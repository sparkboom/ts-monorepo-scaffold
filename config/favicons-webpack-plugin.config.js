module.exports = config => ({
  logo: './static/logo.png',
  prefix: config.targetEnv === 'production' ? 'favicons-[hash]/' : 'favicons/',
  emitStats: config.targetEnv === 'development',
  statsFilename: '../stats/icons-[hash].json',
  persistentCache: config.targetEnv === 'development',
  inject: true,
  // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
  // background: '#fff',
  // favicon app title (see https://github.com/haydenbleasel/favicons#usage)
  title: config.title,
  // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
  icons: {
    android: false,
    appleIcon: false,
    appleStartup: false,
    coast: false,
    favicons: true,
    firefox: true,
    opengraph: false,
    twitter: false,
    yandex: false,
    windows: false,
  },
});
