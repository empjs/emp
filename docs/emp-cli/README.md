# @empjs/cli 深度分析文档

> EMP CLI 是一个基于 Rspack 的高性能模块联邦框架，专注于微前端和组件共享，支持 React、Vue 等多框架。

## 📚 文档目录

- [快速开始](./01-quick-start.md) - 安装、配置和基本使用
- [核心架构](./02-architecture.md) - 架构设计和核心概念
- [命令行工具](./03-cli-commands.md) - 所有 CLI 命令详解
- [配置详解](./04-configuration.md) - 完整配置选项说明
- [插件系统](./05-plugin-system.md) - 插件开发和使用
- [开发服务器](./06-dev-server.md) - 开发服务器实现原理
- [构建系统](./07-build-system.md) - 构建流程和优化
- [类型系统](./08-type-system.md) - TypeScript 配置和类型定义
- [API 参考](./09-api-reference.md) - 完整 API 文档
- [最佳实践](./10-best-practices.md) - 使用建议和示例

## 📦 包信息

- **包名**: `@empjs/cli`
- **版本**: `3.12.0`
- **许可证**: MIT
- **Node 版本要求**: >= 18.0.0
- **仓库**: [https://github.com/empjs/emp](https://github.com/empjs/emp)

## 🚀 核心特性

### 1. 基于 Rspack 的高性能构建
- 使用 Rspack 1.7.4 作为底层构建工具
- 支持增量编译和持久化缓存
- 内置性能分析工具（RsDoctor）

### 2. 模块联邦支持
- 完整的模块联邦功能
- 支持组件暴露和远程加载
- 自动生成类型声明文件

### 3. 多框架支持
- React（通过 `@empjs/plugin-react`）
- Vue 2（通过 `@empjs/plugin-vue2`）
- Vue 3（通过 `@empjs/plugin-vue3`）

### 4. 开发体验优化
- 热模块替换（HMR）
- 配置文件热重载
- 智能端口分配
- 自动打开浏览器

### 5. 生产优化
- 代码压缩和混淆
- CSS 提取和优化
- Tree Shaking
- 代码分割
- Polyfill 注入

## 🛠️ 主要依赖

### 核心依赖
- `@rspack/core`: 1.7.4 - Rspack 核心
- `@rspack/dev-server`: 1.2.1 - 开发服务器
- `@empjs/chain`: workspace:* - 链式配置工具
- `commander`: 11.1.0 - CLI 框架

### 插件和工具
- `@rsdoctor/rspack-plugin`: 1.5.0 - 性能分析
- `html-webpack-plugin`: 5.6.4 - HTML 生成
- `webpack-bundle-analyzer`: 4.10.2 - 包分析
- `ts-checker-rspack-plugin`: 1.1.6 - TypeScript 类型检查

### 样式处理
- `sass-embedded`: 1.93.2 - Sass 编译
- `sass-loader`: 16.0.5 - Sass 加载器
- `less-loader`: ^12.2.0 - Less 加载器

### 服务器相关
- `connect`: 3.7.0 - 中间件框架
- `compression`: 1.8.1 - Gzip 压缩
- `cors`: 2.8.5 - CORS 支持
- `serve-static`: 2.2.0 - 静态文件服务

## 📂 项目结构

```
packages/cli/
├── bin/                    # 可执行文件
│   └── emp.js             # CLI 入口
├── src/                    # 源代码
│   ├── script/            # 命令脚本
│   │   ├── index.ts       # 命令注册
│   │   ├── dev.ts         # 开发命令
│   │   ├── build.ts       # 构建命令
│   │   ├── serve.ts       # 预览命令
│   │   └── base.ts        # 基础脚本类
│   ├── server/            # 服务器实现
│   │   ├── connect/       # Connect 服务器
│   │   ├── express/       # Express 服务器
│   │   └── hono/          # Hono 服务器
│   ├── store/             # 全局状态管理
│   │   ├── index.ts       # 全局 Store
│   │   ├── empConfig.ts   # EMP 配置处理
│   │   ├── lifeCycle.ts   # 生命周期钩子
│   │   ├── server.ts      # 服务器配置
│   │   └── rspack/        # Rspack 配置
│   ├── helper/            # 工具函数
│   │   ├── logger.ts      # 日志工具
│   │   ├── buildPrint.ts  # 构建输出
│   │   ├── loadConfig.ts  # 配置加载
│   │   ├── getPort.ts     # 端口获取
│   │   └── utils.ts       # 通用工具
│   └── types/             # 类型定义
│       ├── config.ts      # 配置类型
│       ├── plugin.ts      # 插件类型
│       └── env.ts         # 环境类型
├── template/              # 模板文件
│   ├── index.html         # HTML 模板
│   └── favicon.ico        # 默认图标
├── tsconfig/              # TypeScript 配置
│   ├── base.json          # 基础配置
│   ├── react.json         # React 配置
│   └── vue.json           # Vue 配置
├── types/                 # 类型声明导出
│   ├── base/              # 基础类型
│   ├── react/             # React 类型
│   └── vue/               # Vue 类型
├── resource/              # 资源文件
├── dist/                  # 编译输出
└── package.json           # 包配置
```

## 🔧 快速开始

### 安装

```bash
# 使用 pnpm（推荐）
pnpm add @empjs/cli

# 使用 npm
npm install @empjs/cli

# 使用 yarn
yarn add @empjs/cli
```

### 配置 package.json

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

### 创建配置文件

在项目根目录创建 `emp-config.ts`:

```typescript
import { defineConfig } from '@empjs/cli'

export default defineConfig(store => {
  return {
    server: {
      port: 8000,
      open: true,
      hot: true
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    }
  }
})
```

### 运行项目

```bash
# 开发模式
pnpm dev

# 生产构建
pnpm build

# 预览构建结果
pnpm start
```

## 📖 深入学习

请查看各个章节的详细文档：

1. **[快速开始](./01-quick-start.md)** - 从零开始创建项目
2. **[核心架构](./02-architecture.md)** - 了解 EMP CLI 的设计理念
3. **[命令行工具](./03-cli-commands.md)** - 掌握所有命令和选项
4. **[配置详解](./04-configuration.md)** - 深入理解配置系统
5. **[插件系统](./05-plugin-system.md)** - 开发自定义插件
6. **[开发服务器](./06-dev-server.md)** - 了解开发服务器原理
7. **[构建系统](./07-build-system.md)** - 优化构建性能
8. **[类型系统](./08-type-system.md)** - TypeScript 最佳实践
9. **[API 参考](./09-api-reference.md)** - 完整 API 文档
10. **[最佳实践](./10-best-practices.md)** - 生产环境建议

## 🤝 社区支持

- **GitHub**: [https://github.com/empjs/emp](https://github.com/empjs/emp)
- **NPM**: [https://www.npmjs.com/package/@empjs/cli](https://www.npmjs.com/package/@empjs/cli)
- **QQ 交流群**: 见 README

## 📝 许可证

MIT License - 详见 [LICENSE](https://github.com/empjs/emp/blob/main/LICENSE)
