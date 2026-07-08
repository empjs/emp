<p align="center">
  <img src="docs/assets/emp-v4-logo.png" width="220" alt="EMP v4">
</p>

<h1 align="center">EMP v4</h1>

<p align="center">
  <em>高性能、微前端构建 · ESM 输出 · TS 7 类型基线</em>
</p>

<p align="center">
  <a href="https://npmjs.com/package/@empjs/cli?activeTab=versions"><img src="https://img.shields.io/npm/v/@empjs/cli/rc?style=flat-square&color=111111&label=%40empjs%2Fcli%40rc" alt="@empjs/cli rc version"></a>
  <a href="https://rspack.rs/"><img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fregistry.npmjs.org%2F%40empjs%252Fcli%2Frc&query=%24.dependencies%5B%22%40rspack%2Fcore%22%5D&style=flat-square&color=2563eb&label=Rspack" alt="Rspack dependency version"></a>
  <a href="https://module-federation.io/"><img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fregistry.npmjs.org%2F%40empjs%252Fshare%2Frc&query=%24.dependencies%5B%22%40module-federation%2Fsdk%22%5D&style=flat-square&color=0f766e&label=Module%20Federation" alt="Module Federation dependency version"></a>
  <a href="https://nodejs.org/en/about/previous-releases"><img src="https://img.shields.io/node/v/@empjs/cli/rc?style=flat-square&color=339933&label=Node" alt="Node engine version"></a>
  <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fempjs%2Femp%2Fv4%2Fpackage.json&query=%24.packageManager&style=flat-square&color=f69220&label=package%20manager" alt="package manager version">
  <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fregistry.npmjs.org%2F%40empjs%252Fcli%2Frc&query=%24.license&style=flat-square&color=111111&label=license" alt="license">
</p>

<p align="center">
  <strong>微前端联邦 · Rspack 2 构建 · ESM 优先输出 · TypeScript 7 RC · 框架插件生态</strong>
</p>

---

EMP 是面向高性能微前端工程的构建工具。它把 Rspack 2、Module Federation 2、ESM 输出、TypeScript 7 RC 类型基线和常用框架插件收在一套配置模型里，让 host、remote、shared、manifest、DTS 和运行时适配都由工具链统一处理。

v4 的重点是换到新的构建、联邦与类型底座，同时尽量保留 EMP 既有的使用习惯。业务项目可以继续围绕 EMP 插件组织配置，把更多精力放在模块拆分、依赖共享和应用交付上。

当前 v4 发布版本以 npm 的 `@empjs/cli@rc` dist-tag 为准；顶部 badge 从 npm rc manifest 和 `v4` 分支的 `packageManager` 字段动态读取，README 不再维护手写版本号。

v4 试用和迁移步骤见 [EMP v4 迁移指南](docs/v4-alpha-migration.md)。

## 核心功能

- 微前端联邦：封装 host、remote、shared、runtime、manifest 和类型声明生成。
- Rspack 构建：覆盖开发服务、生产构建、本地预览和构建分析等常见流程。
- ESM 优先输出：支持 `build.useESM`、`modern-module` library 和 `preserveModules`，让现代浏览器、联邦 remote 与静态服务直接消费标准模块产物。
- TS 7 类型基线：根脚本固定 TypeScript 7 RC，并通过 tsconfig、CLI、plugin、share、chain 的兼容检查守住 DTS 与样式类型边界。
- 框架插件：提供 React、Vue 2、Vue 3、Tailwind CSS、Lightning CSS 等接入能力。
- 共享依赖治理：统一处理单例依赖、版本协商和运行时加载，减少重复配置。
- 工程化基础：提供 CLI、chain 配置层、共享 Biome 配置和包内类型声明。

## v4 优势

- Rspack 2 构建基础：获得新的性能和能力，同时沿用 webpack 生态里熟悉的配置模型。
- 官方 Module Federation：`@empjs/share` 使用官方 2.x 包，减少历史 fork 带来的维护成本。
- 平滑迁移：保留 `pluginRspackEmpShare(...)` 这条用户侧 API，已有项目不需要重写联邦配置。
- ESM-first 输出：`build.useESM` 会自动切到 Rspack `modern-module` 产物形态，同时保留必要的 CJS 兼容出口。
- TS 7 就绪链路：`ci:verify` 覆盖 TypeScript 7 RC 的 tsconfig、CLI 和核心包类型检查，提前暴露 DTS、样式模块和联邦类型兼容问题。
- Node 生态对齐：Node 基线跟随 ESM-only 工具链要求，覆盖 `require(esm)` 默认启用后的运行环境。



## QQ 交流群

<img width="200" src="docs/assets/qq.jpeg" alt="EMP QQ group" />
