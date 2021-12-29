# 开发

## 安装
```
npm add @efox/emp --dev
yarn add @efox/emp -D
pnpm add @efox/emp -D
```

## 指令
```json
"scripts": {
  "dev": "emp dev --env dev",
  "build": "emp build --env prod",
  "build:ts": "emp build --env prod -t",
  "start": "emp serve",
  "analyze": "emp build --analyze"
},
```
### emp dev
+ -e, --env 部署环境 dev、test、prod 默认为 dev
+ -t, --ts 生成 dts文件 默认为 false
+ -ps, --progress  显示进度 默认为 true
+ -pr, --profile 统计模块消耗
+ -cl, --clearLog  清空日志 默认为 true
+ -wl, --wplogger  打印webpack配置 默认为 false,filename 为 输出webpack配置文件

### emp build
+ -e, --env 部署环境 dev、test、prod 默认为 dev
+ -t, --ts 生成 dts文件 默认为 false
+ -a, --analyze 生成分析报告 默认为 false
+ -h, --hot 是否使用热更新 默认启动
+ -o, --open 是否打开调试页面 默认不打开
+ -ps, --progress  显示进度 默认为 true
+ -pr, --profile 统计模块消耗
+ -cl, --clearLog  清空日志 默认为 true
+ -wl, --wplogger  打印webpack配置 默认为 false,filename 为 输出webpack配置文件

### emp serve
+ -cl, --clearLog  清空日志 默认为 true

### emp dts
> 根据 `config.empShare.remote` 自动同步所需类型
+ -p, --typingsPath 下载目录 默认为 `src/empShareType`


## dotenv
### 环境变量配置
+ 根目录创建 `.env.[env]` 即可 根据以上的 `--env` 定制自己的配置环境 如:
```
DOTENV='dev'
```
+ 使用配置 内容 `process.env.env` or esnext `import.meta.env.env` 如:
```js
console.log(process.env.env.DOTENV)
```
## Typescript
### tsconfig.json 配置
+ `@efox/emp` 集成了 `@efox/emp-tsconfig` 与 `Css Module 提示`
+ 集成了emp内置的资源 TS类型
+ 设置方式如下:

```json
{
  "extends": "@efox/emp/emp-tsconfig.json",
  "compilerOptions": {
    "types": ["@efox/emp/client"],
    "baseUrl": ".",
  },
  "include": [
    "src",
  ]
}
```
### 类型生成
在`emp build`下 如果是ts开发，会根据 `expose` <b>自动</b>生成相应的 `d.ts` 到 `dist/empShareTypes` 里面

### 类型同步
`emp dts` 会<b>自动</b>根据 `empShare.remote` 配置生成相应文件到 `src/empShareTypes` 如:

```js
empShare: {
  name: 'microApp',
  remotes: {
    // emp dts 会自动生成 @microHost.d.ts 到 `src/empShareTypes`
    '@microHost': `microHost@http://localhost:8001/emp.js`,
  },
  exposes: {
    // emp build 会自动生成类型到 dist/empShareTypes/index.d.ts
    './App': './src/App',
  },
}
```

## 共享模式
### empshare 介绍
* 实现3重共享模型
  - [基础库] -> [基站] -> [引用]
* `empshare` 与 `moduleFederation` 配置可以 `config.empShare` 里面进行配置
* shareLib 基于库共享模式
  - 可以进行 cdn 加载
  - ES import [DEMO](https://github.com/efoxTeam/emp/blob/f54a9a2475c197ef935cde8cb8dcb2458f963d1e/projects/demo/emp-config.js#L24)
  - DLL方式构建共享 [需自行实现]

* shareLib 代替了MF里面的 shared 可以更好实现重型项目，大型团队的共享灵活性问题

* 注意!!! 在 `moduleFederation` 配置中,如果项目需要导出模块供其它项目使用,除了在 empShare.exposes 中配置外,还需要在项目根目录中添加 `bootstrap.js` 或 `bootstrap.ts` 文件作为 webpack 导出模块的引导文件 [为什么?](https://webpack.docschina.org/concepts/module-federation/#troubleshooting) [如何配置?](https://github.com/efoxTeam/emp/blob/next/projects/vue-2-base/src/main.js)
### empshare 配置
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
   // 实现 Module Feration 与 shareLib 只能保留一个
   shared: {
     react: {requiredVersion: '^17.0.1'},
     'react-dom': {requiredVersion: '^17.0.1'},
   },
   // 实现 emp share 的 三级共享模式 与 shared 只能保留一个,地址可以自行判断
   shareLib: {
     react: 'React@https://cdn.jsdelivr.net/npm/react@17.0.2/umd/react.development.js',
     'react-dom': 'ReactDOM@https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.development.js',
   }
   },
}
```

## 多页面模式
### entries 配置
多页面模式配置 `emp-config.js` 如下:
```js
module.exports={
  // favicion 需要在 html里面配置
  html: {favicon: 'src/favicon.ico'},
  // entries 会继承 Html配置
  // key为入口文件 基于 appSrc 默认 `src/` 的相对路径
  entries: {
    'index.ts': {title: '首页'},
    //可自定义htmlOptions参数 覆盖html
    'work/index.ts': {title: '作品', template: 'src/work/index.html'},
    'info.tsx': {title: '介绍'},
  },
}
```
### 共享模板
多入口会继承 `empShare` 的所有共享 需要自定义的话可以增加自定义模板 如
```html
<!DOCTYPE html>
  <head>
  <!-- EMP inject css 可以屏蔽或者自定义这部分内容 -->
  <% for (let i in htmlWebpackPlugin.options.files.css) { %>
    <link rel="stylesheet" href="<%= htmlWebpackPlugin.options.files.css[i] %>" /><% } %>
    <!-- EMP inject js 可以屏蔽或者自定义这部分内容 -->
    <% for (let i in htmlWebpackPlugin.options.files.js) { %>
    <script src="<%= htmlWebpackPlugin.options.files.js[i] %>"></script><% } %>
  </head>

  <body>
    <div id="emp-root"></div>
  </body>
</html>
```

## 库模式 [Beta]
> 已支持 各种模块 export 支持 IE兼容，worker模式下 需要手动复制worker，inline方式需要支持
### build.lib 配置
```js
type FileNameType = (format: string) => string
export type LibModeType = {
  /**
   * 全局变量 用作 amd umd var window 等共享
   */
  name?: string
  /**
   *  入口文件 基于 AppSrc 目录 如 `src/index.js` 填写 `index.js` 即可
   * @default `index.js`
   */
  entry: string | string[]
  /**
   * fileName
   * @default [format]/[name].js 建议 format 为目录 避免不同格式代码混淆
   */
  fileName?: FileNameType | string
  /**
   * 输出格式 如 [umd,esm]
   * @default [umd]
   */
  formats: buildLibType[]
  /**
   * 提供额外的 全局变量 具体参考 https://webpack.js.org/configuration/externals/#root
   */
  external?: Configuration['externals']
}

```
### package.json 配置
```json
{
  "name": "emp-lib", // 没设置 build.lib.name 的情况下 默认生成类型名称 为 name
  "main": "dist/umd/emp-lib.js", // umd 入口
  "module": "dist/esm/emp-lib.js", // esm 入口
  "types": "dist/empShareTypes/lib.d.ts", // 类型文件入口
}

```
## ESM 模式 [Beta]
> 已支持 MF的 ESM共享，热更存在bug问题
+ [DEMO](https://github.com/efoxTeam/emp/tree/next/projects/demo)



## Browser 兼容
### IE浏览器
+ babel-polyfill

如果在编译产物时没有做额外的兼容处理，又想要在`IE`上运行时。
需要在核心代码执行前加载额外的`polyfill`
```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <script src="//yourhost/babel-polyfill.min.js"></script>
    </head>

    <body>
      <div id="emp-root"></div>
    </body>
  </html>
```
某些特性，如Proxy。babel-polyfill并不会兼容，需要业务侧自己做处理。
babel-polyfill 兼容特性见 <a href="https://kangax.github.io/compat-table/es6/#ie11">[文档]</a>


+ import EMP模块链接出错
	+ EMP沿用了webpack的打包机制
	+ 当你没有指定打包 `publicPath ` 时, 会根据`import.meta.url`,`currentScript`等规则拼接子js的url
	+ 由于在IE上不支持`currentScript`，所以需要打进兼容js，否则有可能会出现子js url错误问题
	+ 参考链接：<a href="https://webpack.docschina.org/guides/public-path/#Automatic-publicPath-automaticpublicPath">[介绍]</a>

## Q&A
### 使用 Windows 开发，编译过程中报错提示 "Access is denied"
  + A: 右键“以管理员身份打开”，重新执行命令即可。
