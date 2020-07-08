var utils = require('./utils');
var config = require('../config');
var isProduction = process.env.NODE_ENV === 'production';//是否是生产环境

module.exports = {
  loaders: utils.cssLoaders({ //是否开启cssMap
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  })
};
