const path = require('path');

const devMode = process.env.NODE_ENV === 'development';

function resolve(dir) {
  return path.join(__dirname, dir);
}

const vueConfig = {
  publicPath: '/visual-drag-demo/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: devMode,
  productionSourceMap: false,
  devServer: {
    hot: false,
  },
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end();
  },
};

module.exports = vueConfig;
