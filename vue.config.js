const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  devServer: {
    port: 1996,
    historyApiFallback: {
      index: '/index.html',
    },
    proxy: { // 设置代理
      '/': {
        target: 'http://192.168.4.22:8098',
        ws: false,
        pathRewrite: {
          '^/': '/'
        }
      },
    },
  },
  chainWebpack(config) {
    config.module.rule('svg').exclude.add(resolve('src/icons')).end();
    config.module.rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}