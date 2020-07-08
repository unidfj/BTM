var merge = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API:'"http://fagzlz.hqshop.com:"',
  // API:'"http://btm.hqshop.com:"',
  // PORT:'"8100"', // 8082 8081  8088 8092
  // API:'"http://btm_fa.hqshop.com:"',
  // PORT:'"8091"', // 8082 8081  8088 8092
  API:'"https://fabtm.a6shop.net:"',
  PORT:'"443"',
  proxy:'"local"'
});
