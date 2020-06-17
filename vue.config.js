module.exports = {
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/cli-service.md#配置代理
    proxy: {
      '/db_api': {
        //target: ' http://127.0.0.1:7008',
        target: 'http://127.0.0.1:7008',
        changeOrigin: true,
        pathRewrite: {
          '^/db_api': '/db_api'
        }
      }
    }, // string | Object
    before: app => {
    }
  },
}
