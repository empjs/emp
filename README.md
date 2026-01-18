<p align="center">
    <img width="100%" src="docs/assets/banner.jpg" alt="emp">
</p>

# EMP ⚡ 3.0
[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![github][github-src]][github-href]
[![node][node-src]][node-href]

<b>下一代构建实现微前端 高性能解决方案、力争配置尽可能保持一致，开箱即用。</b>

+ 🔑 基于Rspack + Module Federation + Typescript、聚焦高性能 & 微前端
+ 🛠️ 多种开发需求、支持开箱即用。
+ 🔩 通用的插件、共享 webpackChain 插件接口.

## 文档
+ 🚀 [快速开始](https://empjs.dev/guide/start/quick-start.html)
+ 🍭 [配置总览](https://empjs.dev/config/index.html)
+ 📦 [插件总览](https://empjs.dev/plugin/)
+ 📚 [交流区](https://github.com/empjs/emp/discussions/364)
+ 🎨 [官网Github](https://github.com/empjs/official)
+ 🎯 [工程初始化](https://github.com/empjs/create-emp)

## EMP CLI Best Practices Skill

本仓库内置了一个针对 EMP CLI 的最佳实践技能，位于：

- `.trae/skills/emp-best-practices`

该技能为下列场景提供结构化的参考文档，方便在 IDE（如 Trae）中按需、按主题加载，减少不必要的上下文与 token 消耗。

### 技能内容结构

- 核心指南  
  - 架构与基础使用：`references/core/README.md`  
  - 故障排除与调试：`references/core/troubleshooting.md`
- 模块联邦与架构  
  - 模块联邦与 CDN 集成：`references/architecture/module-federation-cdn.md`  
  - 同项目多端口运行时共享：`references/architecture/multi-port-runtime-sharing.md`
- 多框架互调  
  - 概览与模式：`references/interop/framework-interop-guide.md`  
  - 实现细节与配置：`references/interop/framework-interop-implementation.md`  
  - React 侧互调实践：`references/interop/framework-interop-react.md`  
  - Vue 侧互调实践：`references/interop/framework-interop-vue.md`
- 插件系统  
  - 插件使用场景与组合：`references/plugins/plugin-usage-guide.md`  
  - 插件开发与扩展：`references/plugins/plugin-development.md`  
  - 框架插件清单 (React/Vue)：`references/plugins/framework-plugins.md`  
  - CSS / 样式插件清单：`references/plugins/css-plugins.md`
- 性能与样式  
  - 构建性能优化：`references/performance/build-optimization.md`  
  - TailwindCSS 集成技巧：`references/performance/tailwindcss-integration.md`

### 在 IDE / Agent 中的使用方式

- 在 Trae 或其他支持技能的 IDE 中打开本仓库时，可以启用 `emp-best-practices` 技能，让 Agent 优先从上述文档中检索答案，而不是扫描整个仓库。
- 如果只关注某一类能力（例如「多框架互调」或「插件开发」），Agent 会根据当前问题只加载对应子目录下的文档，降低上下文体积。
- 手工查阅时，可以先打开 `.trae/skills/emp-best-practices/SKILL.md` 查看索引，再跳转到对应的 `references/*` 文档。

[npm-version-src]: https://img.shields.io/npm/v/@empjs/cli?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/@empjs/cli
[npm-downloads-src]: https://img.shields.io/npm/dm/@empjs/cli?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/@empjs/cli
[github-src]: https://img.shields.io/badge/github-@emp/cli-blue?style=flat&colorA=18181B&colorB=F0DB4F
[github-href]: https://github.com/empjs/emp
[node-src]: https://img.shields.io/node/v/@empjs/cli?style=flat&colorA=18181B&colorB=F0DB4F
[node-href]: https://nodejs.org/en/about/previous-releases

## QQ 交流群 
<img width="200" src="docs/assets/qq.jpeg" />