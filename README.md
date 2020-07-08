# v1.0

> A Vue.js project


## 开发环境部署
### 安装nodejs 
下载：[https://nodejs.org/zh-cn/]

## Build Setup

``` bash
# 安装依赖，所有插件安装的时候记得在后面添加 --save命令
npm install

# 本地运行项目，默认监听端口为8088端口
npm run dev

# 产生生产环境代码，将来将将发布地址设置为服务器相应文件夹。
npm run build


tip:以上所有命令都在项目代码根目录，即src的根目录执行
```

··· code
    build  配置文件（忽略）
    config  
        dev.env  本地配置文件
        index.js 输出配置文件
        prod.env  生产配置文件
    dist  --打包生成路径（生产环境）
    node_modules  依赖包（由 ‘npm install’ 命令产生）
    src
        components --子组件模块
        router  --路由文件
        server --请求文件
        view  -- 项目页面模块
            init --用户初始化模块
            my --个人中心
            pan-gold  --首页
            service --服务
        main  -- 入口文件
    static   ---静态文件
    index.html    --承载文件
    package.json   ---依赖清单

···
