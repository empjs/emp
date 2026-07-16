# @empjs/cli

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![github][github-src]][github-href]
[![node][node-src]][node-href]

EMP 是一个基于 Rspack 的高性能模块联邦框架，专注于微前端和组件共享，支持 React、Vue 等多框架。

## 快速开始

### 环境要求
- Node.js `^20.19.0 || >=22.12.0`
- pnpm `10.x`（推荐使用仓库根 `packageManager` 指定的 `pnpm@10.33.0`）

### 安装
```bash
# 使用 pnpm 安装（推荐）
pnpm i @empjs/cli

# 或使用 npm
npm i @empjs/cli
```

### 项目脚本配置
在 `package.json` 中添加以下脚本：

```json
"scripts": {
  "dev": "emp dev",     // 开发模式
  "build": "emp build", // 生产构建
  "start": "emp serve", // 本地预览生产版本
  "stat": "emp build --analyze", // 包体积分析
  "emp": "emp"          // EMP CLI 命令
}
```

## 执行指令

### 开发模式
```bash
# 启动开发服务器
pnpm dev

# 指定环境
pnpm dev --env test

# 显式开启热更新
pnpm dev --hot

# 注入环境变量
pnpm dev --env-vars API_URL=https://example.com
```

### 构建
```bash
# 生产构建
pnpm build

# 分析包体积
pnpm stat

# watch 构建
pnpm build --watch

# watch 构建后启动本地预览
pnpm build --watch --serve
```

### 本地预览
```bash
# 预览生产构建
pnpm start
```

## 配置文件

### TypeScript 配置 (tsconfig.json)
```json
{
  "extends": "@empjs/cli/tsconfig/react",
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "~@/*": ["src/*"]
    },
    // 解决 scss 的 css module 提示问题
    "plugins": [
      {
        "name": "typescript-plugin-css-modules",
        "options": {
          "additionalData": "@import '~@/css/mixin';",
          "allowUnknownClassnames": true
        },
        "postcssOptions": {
          "useConfig": true
        }
      }
    ]
  },
  "include": ["src"]
}
```

### 基础配置 (emp-config.js/ts)
```js
import {defineConfig} from '@empjs/cli'

export default defineConfig(store => {
  return {
    // 配置 Rspack 链式操作
    chain(chainConfig) {},
  }
})
```

### Rspack 2 配置入口
`build.rspack` 用于显式接入 Rspack 2 的新增能力。EMP 不会默认开启高风险实验能力，业务需要按场景配置。

```js
import {defineConfig} from '@empjs/cli'

export default defineConfig(() => {
  return {
    build: {
      // ESM library 输出会自动使用 output.library.type = 'modern-module'
      useESM: true,
      target: 'es2018',
      // Rspack 2 支持 hashed module id；默认仍保持 development=named、production=deterministic
      moduleIds: 'hashed',
      rspack: {
        // 函数级 tree-shaking；错误标记 pure function 会删除实际有副作用调用
        experiments: {pureFunctions: true},
        // 大 chunk 强制拆分阈值；会影响请求数量和产物拆分形态
        splitChunks: {chunks: 'all', enforceSizeThreshold: 80000},
        parser: {
          javascript: {
            // 给第三方库或不可改源码手动声明纯函数名
            pureFunctions: ['createPureValue'],
          },
          css: {
            // false 时保留 CSS @import，交给浏览器或下游工具处理
            resolveImport: false,
          },
        },
        swc: {
          // 让 builtin:swc-loader 按文件扩展名推断 JS/TS/JSX/TSX parser
          detectSyntax: 'auto',
        },
      },
    },
  }
})
```

### React 与模块联邦配置示例
```js
import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {externalReact, pluginRspackEmpShare} from '@empjs/share'

export default defineConfig(store => {
  const ip = store.server.ip
  const port = 6001
  
  return {
    plugins: [
      // 添加 React 插件支持
      pluginReact(),
      
      // 配置模块联邦共享
      pluginRspackEmpShare({
        name: 'mfHost',
        // 暴露组件
        exposes: {
          './App': './src/App',
          './CountComp': './src/CountComp',
          './Section': './src/component/Section',
        },
        // 生成清单文件
        manifest: true,
        // 生成类型声明
        dts: {
          generateTypes: true,
        },
        // 配置运行时
        empRuntime: {
          framework: {
            global: 'EMP_ADAPTER_REACT',
            libs: [`https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.${store.mode}.umd.js`],
          },
          runtime: {
            lib: `http://${ip}:2100/sdk.js`,
          },
          setExternals: externalReact,
        },
      }),
    ],
    define: {ip, port},
    build: {
      polyfill: {
        mode: 'entry',
        entryCdn: 'https://unpkg.com/@empjs/polyfill@0.0.2/dist/es.js',
        browserslist: store.browserslistOptions.h5,
      },
      sourcemap: true,
    },
    server: {
      port,
      open: false,
      hot: true,
    },
    debug: {
      clearLog: false,
    },
  }
})
```

## 高级功能

### 模块联邦
EMP 提供了强大的模块联邦功能，支持组件共享和微前端架构：

- **暴露组件**：通过 `exposes` 配置暴露组件
- **远程加载**：使用 `remotes` 配置加载远程组件
- **类型支持**：通过 `dts` 配置生成类型声明

### 多框架支持
EMP 支持多种前端框架：

- React：使用 `@empjs/plugin-react`
- Vue 2：使用 `@empjs/plugin-vue2`
- Vue 3：使用 `@empjs/plugin-vue3`


## QQ 交流群 
<img width="200" src="https://github.com/empjs/emp/blob/main/docs/assets/qq.jpeg?raw=true" />



[npm-version-src]: https://img.shields.io/npm/v/@empjs/cli/latest?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/@empjs/cli
[npm-downloads-src]: https://img.shields.io/npm/dm/@empjs/cli?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/@empjs/cli
[github-src]: https://img.shields.io/badge/github-@emp/cli-blue?style=flat&colorA=18181B&colorB=F0DB4F
[github-href]: https://github.com/empjs/emp
[node-src]: https://img.shields.io/node/v/@empjs/cli?style=flat&colorA=18181B&colorB=F0DB4F
[node-href]: https://nodejs.org/en/about/previous-releases
