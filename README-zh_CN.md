# EMP - 微前端解决方案
> Base on Webpack 5 & Module Federation

[English](./README.md) | 简体中文 | [讨论组](https://github.com/efoxTeam/emp/discussions)

这是一个面向未来的，基于Webpack5 Module Federation搭建的微前端解决方案。

## 👨🏻‍💻 目录
* [生态总揽](https://github.com/efoxTeam/emp/blob/main/README-zh_CN.md#-%E7%94%9F%E6%80%81%E6%80%BB%E6%8F%BD)
* [教程文档](https://github.com/efoxTeam/emp/blob/main/README-zh_CN.md#-%E6%95%99%E7%A8%8B%E6%96%87%E6%A1%A3)
* [快速开始](https://github.com/efoxTeam/emp/blob/main/README-zh_CN.md#-%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B)
* [指令插件开发指引](https://github.com/efoxTeam/emp/blob/main/README-zh_CN.md#%EF%B8%8F-%E6%8C%87%E4%BB%A4%E6%8F%92%E4%BB%B6%E5%BC%80%E5%8F%91%E6%8C%87%E5%BC%95)
* [框架配置插件](https://github.com/efoxTeam/emp/blob/main/README-zh_CN.md#-%E6%A1%86%E6%9E%B6%E9%85%8D%E7%BD%AE%E6%8F%92%E4%BB%B6)
* [EMP多框架互调转换插件](https://github.com/efoxTeam/emp/blob/main/README-zh_CN.md#-emp%E5%A4%9A%E6%A1%86%E6%9E%B6%E4%BA%92%E8%B0%83%E6%8F%92%E4%BB%B6)
* [演示](https://github.com/efoxTeam/emp/blob/main/README-zh_CN.md#-%E6%BC%94%E7%A4%BA)
* [EMP多框架互调用例](https://github.com/efoxTeam/emp/blob/main/README-zh_CN.md#-emp%E5%A4%9A%E6%A1%86%E6%9E%B6%E4%BA%92%E8%B0%83%E7%94%A8%E4%BE%8B)
* [用例展示](https://github.com/efoxTeam/emp/blob/main/README-zh_CN.md#-%E7%94%A8%E4%BE%8B%E5%B1%95%E7%A4%BA)
* [交流社区](https://github.com/efoxTeam/emp/blob/main/README-zh_CN.md#-%E4%BA%A4%E6%B5%81%E7%A4%BE%E5%8C%BA)

## 📦 生态总揽
|Project|NPM|Info|
|---|---|---|
|[@efox/emp-cli](packages/emp-cli)|[![release](https://img.shields.io/npm/v/@efox/emp-cli.svg)](https://www.npmjs.com/package/@efox/emp-cli)|脚手架|
|[@efox/emp-tsconfig](packages/emp-tsconfig)|[![release](https://img.shields.io/npm/v/@efox/emp-tsconfig.svg)](https://www.npmjs.com/package/@efox/emp-tsconfig)|Typescript 类型统一配置|
|[@efox/emp-tune-dts-plugin](packages/emp-tune-dts-plugin)|[![release](https://img.shields.io/npm/v/@efox/emp-tune-dts-plugin.svg)](https://www.npmjs.com/package/@efox/emp-tune-dts-plugin)|Typescript 类型同步|
|[@efox/eslint-config-react-prittier-ts](packages/eslint-config-react-prittier-ts)|[![release](https://img.shields.io/npm/v/@efox/eslint-config-react-prittier-ts.svg)](https://www.npmjs.com/package/@efox/eslint-config-react-prittier-ts)|代码规范统一配置|
|[@efox/emp-sync-vscode-plugin](https://github.com/efoxTeam/emp-sync-vscode-plugin)|[![release](https://img.shields.io/badge/emp--sync--base-v0.1.5-green.svg)](https://marketplace.visualstudio.com/items?itemName=Benny.emp-sync-base)|EMP 类型同步 VSCode插件|


## 📖 教程文档

[https://github.com/efoxTeam/emp/wiki](https://github.com/efoxTeam/emp/wiki)

## 💿 快速开始
```sh
npx @efox/emp-cli init
cd my-emp && yarn && yarn dev
```

+ 如果你想预先安装 `@efox/emp-cli`，可以通过全局安装 `npm install -g @efox/emp-cli` 或 `yarn global add @efox/emp-cli `。
+ 建议你卸载该包使用 `npm uninstall -g @efox/emp-cli` or `yarn global remove @efox/emp-cli` 确保 npx 使用的 `@efox/emp-cli` 是最新版本。

+ 执行 `cd my-emp && yarn && yarn dev ` 之后，项目将会自动打开在浏览器。

+ 如果想了解更多关于 `@efox/emp-cli` 的使用，到 [emp-cli](https://github.com/efoxTeam/emp/tree/main/packages/emp-cli)了解更多。

<img src='./docs/assets/init.gif' width='600' alt="npx @efox/emp-cli init"/>
<br>

## 🧞‍♂️ 指令插件开发指引
### 插件，包名前缀需要为 `emp-plugin-*`, `cli.js` 为 emp 插件入口。

+ 新建项目，以 `emp-plugin-` 为项目前缀,插件入口为 `cli.js`
```javascript
module.exports = program => {
  program
    .command('helloWorldPlugin')
    .option('-i, --item <item>')
    .description([
      `It is plugin description`,
    ])
    .action(({item}) => {
      console.log(`Plugin ${item}`)
    })
}
```

 + 开发完成后(emp-plugin-example 仅为例子包名，具体包名以实际包名为准):
  + 通过 `yarn` 安装:
    + `yarn global add emp-plugin-example`
  + 通过 `npm` 安装:
    + `npm install emp-plugin-example -g`

 启动 emp 即可用插件<br>
 <img src='https://user-images.githubusercontent.com/19996552/113428029-a55e4500-9408-11eb-906d-29795199f422.png' width='600' alt="npx @efox/emp-cli init"/>
<br>

## ✨ 框架配置插件
|Framework|NPM|demo|project|install|
|---|---|---|---|---|
|react|[![release](https://img.shields.io/npm/v/@efox/emp-react.svg)](https://www.npmjs.com/package/@efox/emp-react)|[demo](projects/react)|[@efox/emp-react](packages/emp-frameworks/react)|`yarn add @efox/emp-react -D`|
|vue2|[![release](https://img.shields.io/npm/v/@efox/emp-vue2.svg)](https://www.npmjs.com/package/@efox/emp-vue2)|[demo](projects/vue2)|[@efox/emp-vue2](packages/emp-frameworks/vue2)|`yarn add @efox/emp-vue2 -D`|
|vue3|[![release](https://img.shields.io/npm/v/@efox/emp-vue3.svg)](https://www.npmjs.com/package/@efox/emp-vue3)|[demo](projects/vue3-base)|[@efox/emp-vue3](packages/emp-frameworks/vue3)|`yarn add @efox/emp-vue3 -D`|
|svelte|[![release](https://img.shields.io/npm/v/@efox/emp-svetle.svg)](https://www.npmjs.com/package/@efox/emp-svetle)|[demo](projects/svelte)|[@efox/emp-svelte](packages/emp-frameworks/svelte)|`yarn add @efox/emp-svetle -D`|
|preact|[![release](https://img.shields.io/npm/v/@efox/emp-svetle.svg)](https://www.npmjs.com/package/@efox/emp-preact)|[demo](projects/preact)|[@efox/emp-preact](packages/emp-frameworks/preact)|`yarn add @efox/emp-preact -D`|
|cocos2d|[![release](https://img.shields.io/npm/v/@efox/emp-cocos2d.svg)](https://www.npmjs.com/package/@efox/emp-preact)|[demo](projects/cocos2d)|[@efox/emp-cocos2d](packages/emp-frameworks/cocos2d)|`yarn add @efox/emp-cocos2d -D`|

## ⚡ 构建
|Framework|NPM|demo|install|
|---|---|---|---|
|[emp-swc](https://swc.rs/)|[![release](https://img.shields.io/npm/v/@efox/emp-swc.svg)](https://www.npmjs.com/package/@efox/emp-vuett)|[plugin](packages/emp-compile/swc) [react-demo](projects/swc-react-ts)|`yarn add @efox/emp-swc`|

## ⚡ EMP多框架互调插件
|Framework|NPM|demo|install|
|---|---|---|---|
|emp-vue2-in-vue3|[![release](https://img.shields.io/npm/v/@efox/emp-vuett.svg)](https://www.npmjs.com/package/@efox/emp-vuett)|[demo](projects/vue3-project)|`yarn add @efox/emp-vuett`|

## 📦 演示
|Framework|demo|cli|
|---|---|---|
|<img src='./docs/assets/react.png' width='38'/>|[react-demo1](projects/demo1) [react-demo2](projects/demo2)|`cd projects && yarn dev`|
|<img src='./docs/assets/vue.png' width='38'/>|[vue3-base](projects/vue3-base) [vue3-project](projects/vue3-project)|`cd projects && yarn dev:vue`|
|<img src='./docs/assets/vue.png' width='38'/>|[vue2-base](projects/vue2-base) [vue2-project](projects/vue2-project)|`cd projects && yarn dev:vue2`|
|<img src='./docs/assets/preact.png' height='38'/>|[preact-base](projects/preact-base) [preact-project](projects/preact-project)|`cd projects && yarn dev:preact`|
|<img src='./docs/assets/antd.jpeg' width='38'/>|[antd-base](projects/antd-base) [antd-project](projects/antd-project1)|`cd projects && yarn dev:antd`|
|<img src='./docs/assets/cocos2d.png' height='38'/>|[cocos2d-base](projects/cocos2d-base) [cocos2d-project](projects/cocos2d-project)|`cd projects && yarn dev:cocos2d`|
|<img src='./docs/assets/https.png' width='38'/>|[https](projects/https)|`cd projects/https && yarn dev`|
|<img src='./docs/assets/dynamic.png' height='38'/>|[dynamic-system-host](projects/dynamic-system-host)|`cd projects && yarn dev:dynamichost`|
|<img src='./docs/assets/dotenv.png' height='38'/>|[dotenv](projects/empty-project/.env.prod)|`cd projects/empty-project && yarn dev`|

## 💪 EMP多框架互调用例
|Framework|demo|cli|
|---|---|---|
|<img src='./docs/assets/react.png' width='38'/><img src='./docs/assets/react.png' width='38'/>|[React 16](projects/react-diff16) & [React 17](projects/react-diff17)|`cd projects && yarn dev:reactdiff`|
|<img src='./docs/assets/react.png' width='38'/><img src='./docs/assets/vue.png' width='38'/>|[Vue use React](projects/reactVue-vue) & [React use Vue](projects/reactVue-react)|`cd projects && yarn dev:reactvue`|
|<img src='./docs/assets/vue.png' width='38'/><img src='./docs/assets/vue.png' width='38'/>|[Vue3](projects/vue23-vue2) & [Vue2](projects/vue23-vue3)|`cd projects && yarn dev:vue23`|

## 🎯 用例展示
|Framework|demo|cli|
|---|---|---|
|<img src='./docs/assets/react.png' width='38'/>|[react-demo1](projects/demo1) [react-demo2](projects/demo2)|`cd projects && yarn dev`|
|<img src='./docs/assets/vue.png' width='38'/>|[vue3-base](projects/vue3-base) [vue3-project](projects/vue3-project)|`cd projects && yarn dev:vue`|
|<img src='./docs/assets/antd.jpeg' width='38'/>|[antd-base](projects/antd-base) [antd-project](projects/antd-project1)|`cd projects && yarn dev:antd`|
|<img src='./docs/assets/preact.png' height='38'/>|[preact-base](projects/preact-base) [preact-project](projects/preact-project)|`cd projects && yarn dev:preact`|
|<img src='./docs/assets/https.png' width='38'/>|[https](projects/https)|`cd projects/https && yarn dev`|
|<img src='./docs/assets/dynamic.png' height='38'/>|[dynamic-system-host](projects/dynamic-system-host)|`cd projects && yarn dev:dynamichost`|
|<img src='./docs/assets/react.png' width='38'/><img src='./docs/assets/vue.png' width='38'/>|[react](projects/reactVue-react) [vue](projects/reactVue-vue)|`cd projects && yarn dev:reactvue`|

## 👬 交流社区

* 微信交流群：

<img src='./docs/assets/WeChat.png' width='290'/>

* 微信公众号： Efox

<img src='./docs/assets/wechatLogo.jpg' width='290'/>

* 掘金： https://juejin.cn/user/483440843559406/posts

* 开源中国： https://my.oschina.net/u/568478
