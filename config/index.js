// see http://vuejs-templates.github.io/webpack for documentation.
var path = require("path");

module.exports = {
  build: {
    env: require("./prod.env"),
    index: path.resolve("dist/index.html"), //这里必须使用path.resolve(),否则会报非绝对路径问题。path.resolve(__dirname, '../dist/index.html'),//这里 也要换
    assetsRoot: path.resolve("dist"), //path.resolve(__dirname, '../dist')
    assetsSubDirectory: "static",
    assetsPublicPath: "./",
    productionSourceMap: false, //是否开启cssMap
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ["js", "css"],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
  },
  dev: {
    env: require("./dev.env"),
    // port: 9019,
    port: 8091,
    // port:9999,
    autoOpenBrowser: true,
    assetsSubDirectory: "static",
    assetsPublicPath: "/",
    proxyTable: {
      "/local": {
        target:'https://fabtm.a6shop.net:443', // 测试服务器
        // target:'http://btm_fa.hqshop.com:8091', // 测试服务器
        // target: "http://btm.hqshop.com:8100", // 测试服务器
        changeOrigin: true,
        pathRewrite: {
          "^/local": "",
        },
      },
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
  },
};
