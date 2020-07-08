var path = require('path');
var utils = require('./utils');
var config = require('../config');
var vueLoaderConfig = require('./vue-loader.conf');

function resolve (dir) {
  return path.join(__dirname, '..', dir);//相当于../src
}

module.exports = {
  entry: {
    app: './src/main.js'//入口文件
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',//出口文件，命名为app.js---因为上面的入口文件配置为app
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath // '/'
      : config.dev.assetsPublicPath   // '/'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules:[resolve('node_modules')],//添加模块解析路径，这里是绝对路径
    alias: {
      //'vue$': 'vue/dist/vue.js',
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'assets': resolve('src/assets'),//设置路径别名,绝对路径
      'axios':'axios/dist/axios.min.js',
      'link-less':'@/assets/style/link.less'
    }
  },
  /*配置资源加载器，可以使用ES6语法（import）引用vue、js或者图片字体文件，
  image和字体文件在构建后会重命名（加hash码）*/
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          name: utils.assetsPath('images/[name].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          name: utils.assetsPath('fonts/[name].[ext]')
        }
      }
    ]
  }
};
