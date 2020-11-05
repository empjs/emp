# EMP - Micro Frontends solution
> Base on Webpack 5 & Module Federation

English | [简体中文](./README-zh_CN.md)

## Projects
|Project|NPM|Info|
|---|---|---|
|[@efox/emp-cli](packages/emp-cli)|[![release](https://img.shields.io/npm/v/@efox/emp-cli.svg)](https://www.npmjs.com/package/@efox/emp-cli)|CLI|
|[@efox/emp-tsconfig](packages/emp-tsconfig)|[![release](https://img.shields.io/npm/v/@efox/emp-tsconfig.svg)](https://www.npmjs.com/package/@efox/emp-tsconfig)|Typescript Config|
|[@efox/emp-tune-dts-plugin](packages/emp-tune-dts-plugin)|[![release](https://img.shields.io/npm/v/@efox/emp-tune-dts-plugin.svg)](https://www.npmjs.com/package/@efox/emp-tune-dts-plugin)| Webpack Plugin for Module Federation Project in Typescript|
|[@efox/eslint-config-react-prittier-ts](packages/eslint-config-react-prittier-ts)|[![release](https://img.shields.io/npm/v/@efox/eslint-config-react-prittier-ts.svg)](https://www.npmjs.com/package/@efox/eslint-config-react-prittier-ts)|ESLint Config|
|[@efox/emp-sync-vscode-plugin](https://github.com/efoxTeam/emp-sync-vscode-plugin)|[![release](https://img.shields.io/badge/emp--sync--base-v0.1.5-green.svg)](https://marketplace.visualstudio.com/items?itemName=Benny.emp-sync-base)|EMP Type Synchronize VSCode Plugin|

## Quick Overview
```sh
npx @efox/emp-cli my-emp
cd my-emp && yarn && yarn dev
```

If you've previously installed `@efox/emp-cli`,globally via `npm install -g @efox/emp-cli` or `yarn global add @efox/emp-cli `,  we recommend you uninstall the package using `npm uninstall -g @efox/emp-cli` or `yarn global remove @efox/emp-cli` to ensure that npx always uses the latest version.

run `cd my-emp && yarn && yarn dev`,The project will automatically open in the browser.

If you want to know more about the use of `@efox/emp-cli`, go to [emp-cli](https://github.com/efoxTeam/emp/tree/main/packages/emp-cli).

<img src='assets/init.gif' width='600' alt="npx @efox/emp-cli init"/>

## Demos
|Framework|demo|cli|
|---|---|---|
|<img src='assets/react.png' width='38'/>|[react-demo1](projects/demo1) [react-demo2](projects/demo2)|`cd projects && yarn dev`|
|<img src='assets/vue.png' width='38'/>|[vue3-base](projects/vue3-base) [vue3-project](projects/vue3-project)|`cd projects && yarn dev:vue`|
|<img src='assets/antd.jpeg' width='38'/>|[antd-base](projects/antd-base) [antd-project](projects/antd-project1)|`cd projects && yarn dev:antd`|
|<img src='assets/https.png' width='38'/>|[https](projects/https)|`cd projects/https && yarn dev`|
|<img src='assets/dynamic.png' height='38'/>|[dynamic-system-host](projects/dynamic-system-host)|`cd projects && yarn dev:dynamichost`|

## Show Case 
[EMP Awesome](https://github.com/efoxTeam/emp-Awesome)
