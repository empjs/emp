<p align="center">
  <img src="docs/assets/emp-v4-readme-logo.png" width="240" alt="EMP Federation Fox">
</p>

<h1 align="center">EMP v4 🦊</h1>

<p align="center">
  <strong>高性能微前端联邦构建 · Rspack 2 · Module Federation 2 · ESM 输出 · TypeScript 7 stable</strong>
</p>

<p align="center">
  <a href="https://npmjs.com/package/@empjs/cli"><img src="https://img.shields.io/npm/v/@empjs/cli/latest?style=flat-square&color=111111&label=%40empjs%2Fcli" alt="@empjs/cli latest version"></a>
  <a href="https://rspack.rs/"><img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fregistry.npmjs.org%2F%40empjs%252Fcli%2Flatest&query=%24.dependencies%5B%22%40rspack%2Fcore%22%5D&style=flat-square&color=2563eb&label=Rspack" alt="Rspack dependency version from @empjs/cli@latest"></a>
  <a href="https://module-federation.io/"><img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fregistry.npmjs.org%2F%40empjs%252Fshare%2Flatest&query=%24.dependencies%5B%22%40module-federation%2Fsdk%22%5D&style=flat-square&color=0f766e&label=Module%20Federation" alt="Module Federation dependency version from @empjs/share@latest"></a>
  <a href="https://nodejs.org/en/about/previous-releases"><img src="https://img.shields.io/node/v/@empjs/cli/latest?style=flat-square&color=339933&label=Node" alt="Node engine version from @empjs/cli@latest"></a>
  <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fempjs%2Femp%2Fmain%2Fpackage.json&query=%24.packageManager&style=flat-square&color=f69220&label=package%20manager" alt="package manager version">
  <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fregistry.npmjs.org%2F%40empjs%252Fcli%2Flatest&query=%24.license&style=flat-square&color=111111&label=license" alt="license from @empjs/cli@latest">
</p>

---

EMP 是一套面向现代 Web 的微前端工程工具：用统一配置完成 host、remote、shared、manifest、DTS 与运行时适配，让团队专注模块拆分与交付。⚡

## ✨ 核心能力

- **联邦构建**：内置 host、remote、共享依赖和类型声明生成。
- **高性能底座**：基于 Rspack 2，覆盖开发、构建、预览与分析。
- **ESM 优先输出**：支持 `build.useESM`、`modern-module` 与 `preserveModules`。
- **TS 7 稳定类型基线**：守住 CLI、插件、DTS 和样式类型兼容性。
- **框架生态**：开箱支持 React、Vue 2 / 3、Tailwind CSS、Lightning CSS 等。

## 🚀 为什么选择 EMP v4

- **更现代**：升级到 Module Federation 2，并保持熟悉的 EMP 配置体验。
- **更易迁移**：继续支持 `pluginRspackEmpShare(...)`，减少既有项目改造。
- **更易维护**：统一处理版本协商、单例依赖和运行时加载，减少重复配置。

## 📚 开始使用

快速开始和迁移步骤见 [EMP v4 迁移指南](docs/v4-migration.md)。EMP v4 正式版从 npm `latest` 安装。

<sub>顶部 badge 从 npm `latest` manifest 和 `main` 分支的 `packageManager` 字段动态读取，无需手写维护版本号。</sub>

## 💬 QQ 交流群

<img width="200" src="docs/assets/qq.jpeg" alt="EMP QQ group" />

<!-- EMP Federation Fox: docs/assets/emp-federation-fox-full.png is used on the website hero. -->
