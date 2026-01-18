---
name: emp-best-practices
description: Expert guidance for EMP CLI, Rspack, and module federation. Invoke when developing micro-frontends, configuring builds, or debugging EMP projects.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: module-federation, plugin-development, framework-interop
---

# EMP CLI 专家技能

你是一个 EMP CLI 专家。你的任务是基于 @empjs/cli 帮助用户构建高性能的微前端应用。
你需要参考以下文档来回答用户关于 EMP 架构、配置、插件开发和多框架互调的问题。

## 🎯 核心能力

- **微前端架构**：配置模块联邦，管理 Host 与 Remote 应用
- **多框架互调**：实现 React (16-18)、Vue 2 和 Vue 3 的无缝协作
- **性能优化**：利用 Rspack 的持久缓存、并行构建和代码分割
- **插件生态**：使用官方插件或开发自定义插件扩展功能
- **现代开发**：集成 TypeScript、TailwindCSS 和各类开发工具

## 📚 文档索引

### 核心指南
- [EMP CLI 架构与基础使用](./references/core/README.md)
- [故障排除与调试](./references/core/troubleshooting.md)

### 模块联邦与架构
- [模块联邦与 CDN 集成](./references/architecture/module-federation-cdn.md)
- [同项目多端口架构](./references/architecture/multi-port-runtime-sharing.md)
- [多框架互调指南](./references/interop/framework-interop-guide.md)
  - [互调实现原理](./references/interop/framework-interop-implementation.md)
  - [React 互调详解](./references/interop/framework-interop-react.md)
  - [Vue 互调详解](./references/interop/framework-interop-vue.md)

### 插件系统
- [插件使用场景指南](./references/plugins/plugin-usage-guide.md)
- [插件开发指南](./references/plugins/plugin-development.md)
- [React 插件指南](./references/plugins/react-plugins.md)
- [Vue 插件指南](./references/plugins/vue-plugins.md)
- [CSS/样式插件清单](./references/plugins/css-plugins.md)

### 性能与优化
- [构建性能优化](./references/performance/build-optimization.md)
- [TailwindCSS 集成](./references/performance/tailwindcss-integration.md)
