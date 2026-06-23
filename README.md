<p align="center">
  <img src="docs/assets/emp-v4-logo.png" width="220" alt="EMP v4">
</p>

<h1 align="center">EMP v4</h1>

<p align="center">
  <em>基于 Rspack 2 的微前端构建工具。配置保持熟悉，底层换成新的引擎。</em>
</p>

<p align="center">
  <a href="https://npmjs.com/package/@empjs/cli"><img src="https://img.shields.io/npm/v/@empjs/cli?style=flat-square&color=111111&label=%40empjs%2Fcli" alt="npm version"></a>
  <a href="https://npmjs.com/package/@empjs/cli"><img src="https://img.shields.io/npm/dm/@empjs/cli?style=flat-square&color=111111&label=downloads" alt="npm downloads"></a>
  <a href="https://github.com/empjs/emp"><img src="https://img.shields.io/github/stars/empjs/emp?style=flat-square&color=111111&label=stars" alt="GitHub stars"></a>
  <a href="https://nodejs.org/en/about/previous-releases"><img src="https://img.shields.io/node/v/@empjs/cli?style=flat-square&color=111111&label=node" alt="Node version"></a>
  <img src="https://img.shields.io/badge/license-MIT-111111?style=flat-square" alt="MIT license">
</p>

<p align="center">
  <strong>Node ^20.19.0 || >=22.12.0 · pnpm 10 · Rspack 2 · Module Federation 2.x</strong>
</p>

---

EMP 是面向微前端项目的构建工具。它把 Rspack、Module Federation、TypeScript 和常用框架插件收在一套配置里，业务项目不需要自己拼完整的联邦运行时。

v4 的重点是升级底座：`@empjs/cli` 切到 Rspack 2，`@empjs/share` 改用官方 Module Federation 2.x 包，同时保留 `pluginRspackEmpShare(...)` 这条用户侧 API。

## 一个配置

```ts
import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import pluginRspackEmpShare from '@empjs/share/rspack'

export default defineConfig(() => ({
  plugins: [
    pluginReact(),
    pluginRspackEmpShare({
      name: 'host',
      remotes: {
        remote: 'remote@http://localhost:6002/emp.json',
      },
      shared: {
        react: {singleton: true},
        'react-dom': {singleton: true},
      },
      manifest: true,
      dts: true,
    }),
  ],
}))
```

## v4 改了什么

- 构建器升级到 Rspack 2。
- Module Federation 使用官方 2.x 依赖，不再依赖历史 fork 包。
- 包管理器基线为 pnpm 10。
- 发布包采用 ESM-first 形态，同时保留 CJS 兼容出口。
- 现有 `pluginRspackEmpShare(...)` 调用不需要重写。

## 安装

创建项目：

```bash
pnpm create emp@latest
cd <your-app>
pnpm dev
```

已有项目可以直接使用 CLI：

```json
{
  "scripts": {
    "dev": "emp dev",
    "build": "emp build",
    "start": "emp serve",
    "stat": "emp build --analyze"
  }
}
```

## 常用命令

在本仓库调试：

```bash
pnpm install
pnpm emp
pnpm emp:build
pnpm mf
pnpm mf:prod
```

`@empjs/cli` 对外提供：

```bash
emp dev
emp build
emp serve
emp build --analyze
```

## 包结构

| 包 | 说明 |
| --- | --- |
| `@empjs/cli` | 配置加载、开发服务、生产构建、本地预览 |
| `@empjs/chain` | Rspack chain 封装和插件序列化 |
| `@empjs/share` | Module Federation 封装、runtime facade、框架适配 |
| `@empjs/plugin-react` | React 和 React Refresh 接入 |
| `@empjs/plugin-vue2` / `@empjs/plugin-vue3` | Vue 接入 |
| `@empjs/plugin-lightningcss` | Lightning CSS 接入 |
| `@empjs/plugin-tailwindcss*` | Tailwind 不同版本线的接入 |
| `@empjs/biome-config` | 共享 Biome 配置和 CLI 代理 |

## 文档

- [快速开始](https://empjs.dev/guide/start/quick-start.html)
- [配置总览](https://empjs.dev/config/index.html)
- [插件总览](https://empjs.dev/plugin/)
- [交流区](https://github.com/empjs/emp/discussions/364)
- [官网仓库](https://github.com/empjs/official)
- [项目脚手架](https://github.com/empjs/create-emp)

## QQ 交流群

<img width="200" src="docs/assets/qq.jpeg" alt="EMP QQ group" />
