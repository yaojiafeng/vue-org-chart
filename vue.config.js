const path = require('path')

module.exports = {
  // 修改 pages 入口
  pages: {
    index: {
      entry: 'examples/main.js', // 示例项目入口
      template: 'public/index.html', // 示例项目模板
      filename: 'index.html' // 示例项目构建后的文件名
    }
  },
  // 扩展 webpack 配置
  chainWebpack: config => {
    // 设置别名
    config.resolve.alias
      .set('@', path.resolve('examples'))
      .set('~', path.resolve('packages'))

    // lib目录是组件库最终打包好存放的地方，不需要eslint检查
    config.module
      .rule('eslint')
      .exclude.add(path.resolve('lib'))
      .end()

    // packages和examples目录需要加入编译
    config.module
      .rule('js')
      .include
        .add('/packages')
        .add('/examples')
        .end()
      .use('babel')
        .loader('babel-loader')
        .end()
  },
  // 强制内联CSS
  css: {
    extract: false
  },
  // 不生成map文件
  productionSourceMap: false
} 