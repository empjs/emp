# EMP ⚡ 2.0
<a href="https://www.npmjs.com/package/@efox/emp"><img src="https://img.shields.io/npm/v/@efox/emp.svg" alt="npm"></a>
<a href="https://emp2.netlify.app"><img src="https://img.shields.io/node/v/@efox/emp.svg" alt="node"></a>
<a href="https://emp2.netlify.app"><img src="https://img.shields.io/badge/EMP.Document-v2-blue" alt="document"></a>
[![Netlify Status](https://api.netlify.com/api/v1/badges/bc7171f1-19e3-47df-9728-9bf50906475a/deploy-status)](https://app.netlify.com/sites/emp2/deploys)

> 基于下一代构建实现微前端解决方案
+ 💡 微前端、微组件、支持ESM的共享模型
+ ⚡️ 结合SWC快速构建重载
+ 🛠️ 多功能模块支持TypeScript、JSX、CSS、Less、Sass 等支持开箱即用。
+ 📦 “多页应用” 或 “库” 模式的预配置 webpack 构建.
+ 🔩 通用的插件、共享 webpack chain 插件接口.
+ 🔑 TS重构项目、提供灵活的api、Plugin以及完整的类型提示.

## Typescript 工作流
> Typescript 项目 dev 或 build 会生成当前项目 exposes 对应的声明
+ 执行 `emp dev` 或 `emp build` 后，生成的 index.d.ts 会在 dist/types 目录
+ 执行 `emp dts` 后，会下载 remote 对应的 d.ts 文件到 ./src/empShareTypes
  + -p 参数可以传下载目录，默认 ./src/empShareTypes

## 📦 Project
|Project|NPM|Info|Author|
|---|---|---|---|
|[@efox/emp](packages/emp)|[![release](https://img.shields.io/npm/v/@efox/emp.svg)](https://www.npmjs.com/package/@efox/emp)|Treasure chest|[Ken](https://github.com/ckken)|
|[@efox/plugin-vue-2](packages/plugin-vue-2)|[![release](https://img.shields.io/npm/v/@efox/plugin-vue-2)](https://www.npmjs.com/package/@efox/plugin-vue-2)| EMP Vue v2 plugin|[Ken](https://github.com/ckken)|
|[@efox/plugin-babel-vue-3](packages/plugin-babel-vue-3)|[![release](https://img.shields.io/npm/v/@efox/plugin-babel-vue-3)](https://www.npmjs.com/package/@efox/plugin-babel-vue-3)| EMP Babel for Vue 3 plugin|[MAXLZ1](https://github.com/MAXLZ1)|
|[@efox/eslint-config-react](packages/eslint-config-react)|[![release](https://img.shields.io/npm/v/@efox/eslint-config-react.svg)](https://www.npmjs.com/package/@efox/eslint-config-react)|ESLint React Config|[Ken](https://github.com/ckken)|
|[@efox/eslint-config-vue](packages/eslint-config-vue)|[![release](https://img.shields.io/npm/v/@efox/eslint-config-vue.svg)](https://www.npmjs.com/package/@efox/eslint-config-vue)|ESLint Vue Config|[Ken](https://github.com/ckken)|


## 👬 Community

<img src="docs/img/contact_me_qr.png" width="300" />

## 📖 Articles & Demos
<a href="https://juejin.cn/user/483440843559406/posts">[掘金]</a>
<a href="https://www.zhihu.com/column/efoxteam">[知乎]</a>
<a href="projects/antd-base">[Antd Demo]</a>
<a href="projects/demo">[ESM Demo]</a>
<a href="projects/multi-entries-app">[多入口 Demo]</a>
<a href="projects/vue-2-base">[vue 2 Demo]</a>
