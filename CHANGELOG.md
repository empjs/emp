# @Efox EMP CLI Change Log
> change log infomation
## v1.1.20
+ 优化构建报错继续执行完成的通知
+ 美化日志提示
+ 增加日志提示选项
+ postcss 增加 ` hideNothingWarning: true,` 屏蔽不存在的 `postcss.config.js` 的报错

## v1.1.16
+ 增加 dev环境 public 静态路径
## v1.1.15
+ 修复public copy功能
## v1.1.12
+ 加入文件缓存 增加打包速度 
+ 升级 postcss

## v1.1.11
+ 修复多host 支持问题
+ 优化打包速度 
+ 美化项目提示 

## v1.1.10
+ emp-config.js 入参增加 webpack 方便二次配置 `remoteConfig({config, env, empEnv, webpack})`

## v1.1.9
+ 利用 svgr 加载特性取代 babel 构建 增加构建速度
+ 兼容 cra require 方式

## v1.1.8
+ 支持 SVGR & SVG

## v1.1.4
+ 修复webpack 5.1.x 重构 webpack-dev-server 导致更新失败的问题 [相关内容](https://webpack.js.org/guides/hot-module-replacement/#via-the-nodejs-api)

 ## v1.1.0
> webpack5 beta31

## v1.0.34 
+ 修复 svga 文件过小导致错误问题

## v1.0.32
> 增加 ./postcss.config.js 支持 
```javascript
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      viewportWidth: 720,
      unitPrecision: 3,
      viewportUnit: 'vw',
      selectorBlackList: ['.ignore', '.hairlines'],
      minPixelValue: 1,
      mediaQuery: false,
    },
  },
}
```

## v1.0.29  
> 增加对 .browserslistrc 支持 
+ 根目录增加 .browserslistrc 
```javascript
last 1 version
> 1%
IE 9
```

+ 安装polyfill `yarn add react-app-polyfill` 
+ 入口 `src/index.ts` 增加 
```javascript
import 'react-app-polyfill/ie9'
import 'react-app-polyfill/stable'
```

## v1.0.19
+ 升级 webpack 5 beta 23
+ 优化图片调用方式
+ 加入 定级 await 支持
+ 加入 mjs 支持
+ 加入 wasm 支持
+ 加入 vue 支持 `:TODO 等待认领`
+ 引入 asset 替代 file-loader、url-loader、raw-loader
+ 升级 到 `@efox/emp-cli`:`^1.0.18` 可以使用新特征 配合 `@efox/emp-tsconfig`:`^1.0.1` 可以支持 top level await 特性
+ 微小改动:
```javascript 
 // `src/configs/index.ts`
const env = process.env.EMP_ENV || 'dev'
console.log('env project antd ===>', env)
const config = require(`./${process.env.EMP_ENV || 'dev'}`) // 不懂直接加变量 需要加上 process.env.EMP_ENV，环境变量只在构建的时候寻找动态路径
config.env = env
export {env}
export default config

 ```
 + 图片支持非 default 引用 
 ```javascript 
 <img src={require('src/assets/mf.png').default} width="300" />
 //=>
 <img src={require('src/assets/mf.png')} width="300" />
 ``````
