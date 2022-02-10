# 配置
## 配置文件
### 解析
EMP 会自动解析当前项目根目录的 `emp-config.js` 文件
```js

module.exports = {}
```
### 提示
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
// mode 为webpack mode变量 development production
// env 为 emp serve --env dev 的 dev
module.exports = defineConfig(({mode,env})=>{
  return {}
})
```

### 异步函数
```js
// mode 为webpack mode变量 development production
// env 为 emp serve --env dev 的 dev
module.exports = defineConfig(async({mode,env})=>{
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
+ 默认 app 模式下为 `auto`,lib 模式下 为 `空` 屏蔽import auto 模式

相关介绍
- 绝对 URL 路径名，例如 /
- 完整的 URL，例如 https://baidu.com/
- 替代 webpack `publicPath` 的设置，并做了统一化处理

### publicDir
+ 类型 `string`
+ 默认 `public`

静态文件路径


### cacheDir
+ 类型 `string`
+ 默认 `node_modules/.emp-cache`

缓存目录

### resolve.extends
+ 类型 `boolean`
+ 默认为 `true`

是否继承系统默认设置 默认继承
设置 `false` 后，会按需替换 不设置则还是按照系统配置

### resolve.alias
+ 类型 `{[key:string]:string}`
+ 默认为 `{src: config.appSrc}`

### resolve.modules
+ 类型 `string[]`

### resolve.extensions
+ 类型 `string[]`
+ 默认为 `['.js','.jsx','.mjs','.ts','.tsx','.css','.less','.scss','.sass','.json','.wasm','.vue','.svg','.svga']`

### mode
+ 类型 `string`
  - 调试模式为 development
  - 构建模式为 production
  - 正式环境为 none

模式根据执行指令自动变换 <b>暂不支持设置</b>

### define
+ 类型 `Record<string, string|number|boolean>`

全局环境替换
+ 配置
```js
module.exports={
  define: {emp: {name: 'empName', value: ['a', 'b', 'c']}},
}
```
+ 使用
```js
console.log('process.env.emp', process.env.emp)
```

### plugins
+ 类型 `ConfigPluginType[]`

### webpackChain
+ 类型 `WebpackChainType`

暴露到 emp-config.js 可以自定义 webpack 配置
深入了解 Webpack Chain 使用，请看详细文档: https://github.com/neutrinojs/webpack-chain#getting-started
例如:
```js
const {defineConfig} = require('@efox/emp')
const WebpackAssetsManifest = require('webpack-assets-manifest')
module.exports = defineConfig(({mode, env}) => {
  return {
    webpackChain: (chain, config) => {
      // 创建 assets-manifest.json -> 所有资源文件路径
      chain.plugin('WebpackAssetsManifest').use(WebpackAssetsManifest)
    },
  }
})
```

### empshare
+ 类型 `EMPShareExport`
   - emp share 配置
   - 实现3重共享模型
   - empshare 与 module federation 只能选择一个配置

 详情点击 [了解更多](/develop/#empshare-配置)

+ 使用方法 `emp-config.js`
```js
module.exports={
  // objects
  empshare:{}
  // or funciton
  empshare(o: EMPConfig){}
  // or async function
  async empshare(o: EMPConfig){}
}
```
 + 配置用例如下
 ```js
 module.exports={
    empShare: {
    name: 'microApp',
    remotes: {
      '@microHost': `microHost@http://localhost:8001/emp.js`,
    },
    exposes: {
      './App': './src/App',
    },
    shareLib: {
      react: 'React@https://cdn.jsdelivr.net/npm/react@17.0.2/umd/react.development.js',
      'react-dom': 'ReactDOM@https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.development.js',
    }
    },
 }
 ```

###  externals

+ module?: `string` 模块名 @example react-dom
+ global?: `string` 全局变量 @example ReactDom
+ entry?: `string` 入口地址 @example http://
  * 入口地址
  * 不填则可以通过 emp-config 里的 html.files.js[url] 传入合并后的请求
  * 如 http://...?react&react-dom&react-router&mobx
+ type?: `string` 类型入口 js | css

+ 使用方法 `emp-config.js`
```js
module.exports={
  // objects
  externals:{}
  // or funciton
  externals(o: EMPConfig){}
  // or async function
  async externals(o: EMPConfig){}
}
```

### moduleFederation
> module federation 配置、2.0更推荐用  empShare 替代 module federation的配置 [了解更多](/develop/#empshare-配置)
+ 类型 `MFExport`
  + exposes?: 导出模块
  + filename?: 导出文件名 默认为 `emp.js`
  + library?: 库模式
  + name?: 导出名，amd umd cjs
  + remotes?: 远程引用、基站
  + shared?: 共享库、对象

+ 使用方法 `emp-config.js`
```js
module.exports={
  // objects
  moduleFederation:{}
  // or funciton
  moduleFederation(o: EMPConfig){}
  // or async function
  async moduleFederation(o: EMPConfig){}
}
```
使用用例：以 `micro-host` 为例
```js
module.exports={
    moduleFederation:{
      name: 'microHost',
      exposes: {
        './App': './src/App',
      },
      shared: {
        react: {requiredVersion: '^17.0.1'},
        'react-dom': {requiredVersion: '^17.0.1'},
      },
    }
}
```

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
> template 与 favicon 不建议 放到 public 静态文件夹 避免copy时报错
> (*)entries 设置后 会继承这里的操作
  - template `string` html模板 默认 `src/index.html` 路径基于当前项目根目录
  - favicon `string` favicon连接 默认 `src/favicon.ico` 路径基于当前项目根目录
  - files 文件插入到html 与 `externals` 叠加 类型 `{css:string[] js:string:[]}`
    - css `string[]` 插入 css
    - js `string[]` 插入 js

其他可以参考 html-webpack-plugin [相关设置](https://github.com/jantimon/html-webpack-plugin)
配置详情请 [点击查看](/develop/#多入口模式)

### entries
+ 类型 `EntriesType`
  - entryFilename 为基于 src目录如 `info/index`
  - HtmlOptions 为 html 的独立配置; `favicon` 请在 `html.favicon` 配置
> (*)entries 设置后 会继承 html 的配置
多页面模式

### reactRuntime
+ 类型 `automatic` | `classic`
+ 默认 `undefined`
  - React Runtime 手动切换jsx模式
  - 当 external react时需要设置
  - 本地安装时会自动判断 不需要设置

### typingsPath
+ 类型 `string`
+ 默认 `src/empShareType`

`emp dts` 指令 同步基站 d.ts 目录
## 构建选项
### build.target
 + 类型 `JscConfig['target']`

 生成代码 参考 [swc#jsctarget](https://swc.rs/docs/configuration/compilation#jsctarget)

### build.sync
+ 类型 `boolean`
+ 默认 `false`

swc 是否异步构建

### build.outDir
+ 类型 `string`
+ 默认 `dist`

生成代码目录

### build.assetsDir
+ 类型 `string`
+ 默认 `assets`

生成静态目录

### build.staticDir
+ 类型 `string`
+ 默认 ``

生成包含 js,css,asset 合集目录

### build.minify
+ 类型 `boolean`
+ 默认 `true`

是否压缩、默认 development 不压缩，production 压缩

### build.minOptions
+ 类型 `TerserOptions`
+ 默认 `{compress:false}`

具体配置可以参考 [链接](https://github.com/terser/terser#minify-options)

### build.sourcemap
+ 类型 `boolean`
+ 默认 `true`

是否生产sourcemap、默认 development 生产，production 不生产

### build.emptyOutDir
+ 类型 `boolean`
+ 默认 `true`

是否清空生成文件夹

### build.chunkIds
+ 类型 `false` | `natural` | `named` | `deterministic` | `size` | `total-size`
+ 默认 `named` | `deterministic`

`named` 有助于定位问题 开发模式默认启动
`deterministic` 在不同的编译中不变的短数字 id。有益于长期缓存。在生产模式中会默认开启。

### build.analyze
+ 类型 `boolean`
+ 默认 `false`

通过 cli `--analyze` 或 `-a` 生成构建分析

### build.lib
+ 类型 `LibMod`

使用库模式 具体可以点击 [查看详情](/develop/#build-lib-配置)
## Dts 生成与同步
### build.typesOutDir
+ 类型 `string`
+ 默认 `dist/empShareTypes`

当前项目声明文件输出目录

### build.typesEmpName
+ 类型 `string`
+ 默认 `index.d.ts` 生成 与 同步相同

生成EMP基站类型文件 默认为 `index.d.ts`
### build.typesLibName
+ 类型 `string`
+ 默认 `lib.d.ts`

生成库 类型文件 默认为 `lib.d.ts` 可以在package.json types 设置 `./dist/lib.d.ts`

### build.createTs
+ 类型 `boolean`
+ 默认 `false`

是否生成 d.ts

### build.jsToJsx
+ 类型 `boolean`
+ 默认 `false`

是否支持在 js 中使用 jsx

### dtsPath
+ 类型 `{[key: string]: string}`
+ 默认 `<remoteHost>/empShareTypes/index.d.ts`
+ 配置例子:
```js
   dtsPath: {
    //  '对应 remotes 里的项目名' : '.dts 文件的远程路径'
      '@microHost': 'http://127.0.0.1:8001/types/index.d.ts',
    },
```

## Server 服务选项
> 继承 webpack dev server 所有配置
+ 类型 `ServerOptions`
### server.server
> 4.4.0 (2021-10-27)
+ 增加 `server` 选项 例如 `{ server: { type: 'http', options: { maxHeaderSize: 32768 } } }`
+ 类型 `"http" | "https" | "spdy" | { type: "http" | "https" | "spdy", options }`
+ 详细文档 [点击](https://webpack.js.org/configuration/dev-server/#devserverserver)
+ 升级详情 [changelog](https://github.com/webpack/webpack-dev-server/blob/master/CHANGELOG.md#440-2021-10-27)
### server.https
+ 类型 `https.ServerOptions` [新版本将弃置]
### server.http2
+ 类型 `boolean` [新版本将弃置]

## 调试选项
### debug.clearLog
+ 类型 `boolean`
+ 默认 `true`

- 是否清空之前的日志
- 对于开发阶段比较有用，可以全链路看到整体日志输出，不受影响

### debug.progress
+ 类型 `boolean`
+ 默认 `true`

是否显示进度条

### debug.profile
+ 类型 `boolean`
+ 默认 `false`

是否显示性能分析

### debug.wplogger
+ 类型 `boolean`
+ 默认 `false`

是否显示配置信息
