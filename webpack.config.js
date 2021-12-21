// webpack.config.js
const path = require('path')
module.exports = {
  mode: 'development',
  entry: path.join(__dirname, '/src/index.js'), // 入口文件
  output: {
    path: path.join(__dirname, '/dist'), //打包后的文件存放的地方
    filename: 'bundle.js' //打包后输出文件的文件名
  },
  devServer: {
    static: './dist', // 本地服务器所加载文件的目录
    port: '8088', // 设置端口号为8088
    // inline: true, // 文件修改后实时刷新
    historyApiFallback: true //不跳转
  }
}