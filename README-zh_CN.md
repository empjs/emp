# EMP - 微前端解决方案
> Base on Webpack 5 & Module Federation

[English](./README.md) | 简体中文

## Projects
|Project|NPM|Info|
|---|---|---|
|[@efox/emp-cli](packages/emp-cli)|[![release](https://img.shields.io/npm/v/@efox/emp-cli.svg)](https://www.npmjs.com/package/@efox/emp-cli)|脚手架|
|[@efox/emp-tsconfig](packages/emp-tsconfig)|[![release](https://img.shields.io/npm/v/@efox/emp-tsconfig.svg)](https://www.npmjs.com/package/@efox/emp-tsconfig)|Typescript 类型统一配置|
|[@efox/emp-tune-dts-plugin](packages/emp-tune-dts-plugin)|[![release](https://img.shields.io/npm/v/@efox/emp-tune-dts-plugin.svg)](https://www.npmjs.com/package/@efox/emp-tune-dts-plugin)|Typescript 类型同步|
|[@efox/eslint-config-react-prittier-ts](packages/eslint-config-react-prittier-ts)|[![release](https://img.shields.io/npm/v/@efox/eslint-config-react-prittier-ts.svg)](https://www.npmjs.com/package/@efox/eslint-config-react-prittier-ts)|代码规范统一配置|
|[@efox/emp-sync-vscode-plugin](https://github.com/efoxTeam/emp-sync-vscode-plugin)|[![release](https://img.shields.io/badge/emp--sync--base-v0.1.5-green.svg)](https://marketplace.visualstudio.com/items?itemName=Benny.emp-sync-base)|EMP 类型同步 VSCode插件|

## Quick Overview
```sh
npx @efox/emp-cli my-emp
cd my-emp && yarn && yarn dev
```

+ 如果你想预先安装 `@efox/emp-cli`，可以通过全局安装 `npm install -g @efox/emp-cli` 或 `yarn global add @efox/emp-cli `。
+ 建议你卸载该包使用 `npm uninstall -g @efox/emp-cli` or `yarn global remove @efox/emp-cli` 确保 npx 使用的 `@efox/emp-cli` 是最新版本。

+ 执行 `cd my-emp && yarn && yarn dev` 之后，项目将会自动打开在浏览器。

+ 如果想了解更多关于 `@efox/emp-cli` 的使用，到 [emp-cli](https://github.com/efoxTeam/emp/tree/main/packages/emp-cli)了解更多。

<img src='assets/init.gif' width='600' alt="npx @efox/emp-cli init"/>

## Demos
|Framework|demo|cli|
|---|---|---|
|<img src='assets/react.png' width='38'/>|[react-demo1](projects/demo1) [react-demo2](projects/demo2)|`cd projects && yarn dev`|
|<img src='assets/vue.png' width='38'/>|[vue3-base](projects/vue3-base) [vue3-project](projects/vue3-project)|`cd projects && yarn dev:vue`|
|<img src='assets/antd.jpeg' width='38'/>|[antd-base](projects/antd-base) [antd-project](projects/antd-project1)|`cd projects && yarn dev:antd`|
|<img src='assets/https.png' width='38'/>|[https](projects/https)|`cd projects/https && yarn dev`|

## Show Case 
[EMP Awesome](https://github.com/efoxTeam/emp-Awesome)


