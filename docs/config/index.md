# 配置
## 配置文件 
### 配置文件解析 emp-config.js
EMP 会自动解析当前项目根目录的 `emp-config.js` 文件
```js

module.exports = {}
```
### 配置提示 
```js
/**
 * @type {import('@efox/emp').EMPConfigExport}
 */
module.exports = {}

```
或者使用 `defineConfig`
```js
const {defineConfig} = require('@efox/emp')
module.exports = defineConfig({})

```
### 函数式配置 
```js 
module.exports = defineConfig(({mode})=>{
  return {}
})
```

### 异步函数 
```js
module.exports = defineConfig(async({mode})=>{
  return {}
})
```

## 全局配置
### root
+ 类型 `string`
+ 默认 `process.cwd()`

项目根目录、自动获取

### appSrc
+ 类型 `string`
+ 默认 `src`

项目代码来源文件夹

### appEntry
+ 类型 `string`
+ 默认 `index.js`

项目代码入口文件 如 `main.js`


### base
+ 类型 `string`
+ 默认 `/` 
  - 绝对 URL 路径名，例如 /
  - 完整的 URL，例如 https://baidu.com/

### publicDir
+ 类型 `string`
+ 默认 `public` 

静态文件路径


### cacheDir
+ 类型 `string`
+ 默认 `node_modules/.emp-cache` 

缓存目录

### mode
+ 类型 `string`
  - 调试模式为 development
  - 构建模式为 production
  - 正式环境为 none

模式根据执行指令自动变换

### define
+ 类型 `Record<string, string|number|boolean>`

全局环境替换

### plugins 
+ 类型 `ConfigPluginType[]`

### webpackChain 
+ 类型 `WebpackChainType`
 
暴露到 emp-config.js 可以自定义 webpack 配置

### empshare
+ 类型 `EMPShareExport`
   - emp share 配置
   - 实现3重共享模型
   - empshare 与 module federation 只能选择一个配置

###  externals
+ 类型 `ExternalsType`

### moduleFederation
+ 类型 `MFExport`

module federation 配置

### useImportMeta
+ 类型 `boolean`
+ 默认 `false` 
  - 启用 import.meta
  - 需要在 script type=module 才可以执行

### jsCheck
+ 类型 `boolean`
+ 默认 `false` 

启用 ForkTsChecker or Eslint

### splitCss 
+ 类型 `boolean`
+ 默认 `true` 
  - 启动 mini-css-extract-plugin
  - 分离 js里的css

### html
+ 类型 `HtmlOptions`
+ 默认 `true` 

html-webpack-plugin 相关操作

### reactRuntime
+ 类型 `automatic` | `classic`
+ 默认 `undefined` 
  - React Runtime 手动切换jsx模式
  - 当 external react时需要设置
  - 本地安装时会自动判断 不需要设置

### chunkIds 
+ 类型 `false` | `natural` | `named` | `deterministic` | `size` | `total-size`  
+ 默认 `named` | `deterministic` 

`named` 有助于定位问题 开发模式默认启动
`deterministic` 在不同的编译中不变的短数字 id。有益于长期缓存。在生产模式中会默认开启。

## 构建选项 
### build
 + 类型 `BuildOptions`

## 服务选项 
### server
+ 类型 `ServerOptions`
