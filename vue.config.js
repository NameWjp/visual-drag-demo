const devMode = process.env.NODE_ENV === 'development';

const vueConfig = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: devMode,
  productionSourceMap: false,
};

module.exports = vueConfig;
