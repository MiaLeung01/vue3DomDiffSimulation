const envMode = process.env.envMode
require('dotenv').config({ path: `.env.${envMode}` })
// 正则匹配以 VUE_APP_ 开头的 变量
const prefixRE = /^VUE_APP_/
let env = {}
// 只有 NODE_ENV，BASE_URL 和以 VUE_APP_ 开头的变量将通过 webpack.DefinePlugin 静态地嵌入到客户端侧的代码中
for (const key in process.env) {
  if (key == 'NODE_ENV' || key == 'BASE_URL' || prefixRE.test(key)) {
      env[key] = JSON.stringify(process.env[key])
  }
}

const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');
module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'), // 入口
  output: {
      path: path.resolve(__dirname, '../dist'),
      filename: './js/[name].[chunkhash].js',
      publicPath: './',
  },
  plugins: [
    //...
    // new webpack.DefinePlugin({ // 定义环境变量
    //   'process.env': {
    //     ...env
    //   }
    // }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
      title: 'webpack5+vue3',
      minify: {
        html5: true, // 根据HTML5规范解析输入
        collapseWhitespace: true, // 折叠空白区域
        preserveLineBreaks: false,
        minifyCSS: true, // 压缩文内css
        minifyJS: true, // 压缩文内js
        removeComments: false // 移除注释
      },
      // files: prodMode ? cdn.prod : cdn.dev //CDN引入文件配置
    })
  ]
}
