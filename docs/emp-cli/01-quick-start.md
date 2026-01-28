# 快速开始

本章节将帮助你快速上手 @empjs/cli，从安装到运行第一个项目。

## 环境要求

在开始之前，请确保你的开发环境满足以下要求：

- **Node.js**: >= 18.0.0
- **包管理器**: pnpm 8+ (推荐) / npm / yarn

### 检查环境

```bash
# 检查 Node.js 版本
node -v  # 应该显示 v18.0.0 或更高版本

# 检查 pnpm 版本（如果使用 pnpm）
pnpm -v  # 应该显示 8.0.0 或更高版本
```

### 安装 pnpm（可选但推荐）

```bash
# 使用 npm 安装 pnpm
npm install -g pnpm

# 或使用 corepack（Node.js 16.13+）
corepack enable
corepack prepare pnpm@latest --activate
```

## 安装 @empjs/cli

### 方式一：作为项目依赖安装（推荐）

```bash
# 使用 pnpm
pnpm add @empjs/cli

# 使用 npm
npm install @empjs/cli

# 使用 yarn
yarn add @empjs/cli
```

### 方式二：全局安装

```bash
# 使用 pnpm
pnpm add -g @empjs/cli

# 使用 npm
npm install -g @empjs/cli
```

## 项目初始化

### 1. 创建项目目录

```bash
mkdir my-emp-app
cd my-emp-app
```

### 2. 初始化 package.json

```bash
pnpm init
```

### 3. 安装 @empjs/cli

```bash
pnpm add @empjs/cli
```

### 4. 配置 package.json 脚本

编辑 `package.json`，添加以下脚本：

```json
{
  "name": "my-emp-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "emp dev",
    "build": "emp build",
    "start": "emp serve",
    "stat": "emp build --analyze"
  },
  "dependencies": {
    "@empjs/cli": "^3.12.0"
  }
}
```

## 创建基础项目结构

### 1. 创建目录结构

```bash
mkdir -p src
```

### 2. 创建 HTML 模板

创建 `src/index.html`:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My EMP App</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

### 3. 创建入口文件

创建 `src/index.js`:

```javascript
console.log('Hello EMP!')

const root = document.getElementById('root')
if (root) {
  root.innerHTML = '<h1>Welcome to EMP!</h1>'
}
```

### 4. 创建配置文件

创建 `emp-config.ts`:

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

## React 项目快速开始

### 1. 安装依赖

```bash
# 安装 React 相关依赖
pnpm add react react-dom

# 安装 EMP React 插件
pnpm add @empjs/plugin-react

# 安装类型定义（如果使用 TypeScript）
pnpm add -D @types/react @types/react-dom
```

### 2. 配置 TypeScript

创建 `tsconfig.json`:

```json
{
  "extends": "@empjs/cli/tsconfig/react",
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
```

### 3. 更新 EMP 配置

更新 `emp-config.ts`:

```typescript
import { defineConfig } from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'

export default defineConfig(store => {
  return {
    plugins: [
      pluginReact()
    ],
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

### 4. 创建 React 组件

创建 `src/App.tsx`:

```tsx
import React from 'react'

export default function App() {
  return (
    <div>
      <h1>Welcome to EMP with React!</h1>
      <p>Start building your micro-frontend application.</p>
    </div>
  )
}
```

### 5. 更新入口文件

更新 `src/index.tsx`:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

## 运行项目

### 开发模式

```bash
pnpm dev
```

这将启动开发服务器，默认在 `http://localhost:8000` 上运行。

**开发模式特性：**
- 热模块替换（HMR）
- 快速增量编译
- 源码映射（Source Maps）
- 详细的错误提示

### 指定环境变量

```bash
# 指定部署环境
pnpm dev --env test

# 自定义环境变量
pnpm dev --env-vars API_URL=https://api.example.com

# 多个环境变量
pnpm dev --env-vars API_URL=https://api.example.com --env-vars DEBUG=true
```

### 开启性能分析

```bash
# 开启 RsDoctor 性能分析
pnpm dev --doctor
```

## 构建项目

### 生产构建

```bash
pnpm build
```

这将在 `dist` 目录下生成优化后的生产代码。

**生产构建特性：**
- 代码压缩和混淆
- Tree Shaking
- CSS 提取和优化
- 资源哈希命名
- 代码分割

### 构建选项

```bash
# 生成包分析报告
pnpm build --analyze

# 生成类型声明文件
pnpm build --ts

# Watch 模式构建
pnpm build --watch

# Watch 模式并启动预览服务器
pnpm build --watch --serve
```

## 预览构建结果

```bash
pnpm start
```

这将启动一个静态文件服务器，预览构建后的应用。

## 项目结构示例

完整的项目结构应该如下：

```
my-emp-app/
├── src/
│   ├── index.html          # HTML 模板
│   ├── index.tsx           # 入口文件
│   ├── App.tsx             # 主组件
│   └── favicon.ico         # 网站图标（可选）
├── dist/                   # 构建输出目录
├── node_modules/           # 依赖包
├── emp-config.ts           # EMP 配置文件
├── tsconfig.json           # TypeScript 配置
├── package.json            # 项目配置
└── pnpm-lock.yaml         # 依赖锁定文件
```

## 常见问题

### 1. 端口被占用

如果默认端口 8000 被占用，EMP CLI 会自动寻找可用端口。你也可以手动指定端口：

```typescript
// emp-config.ts
export default defineConfig(store => {
  return {
    server: {
      port: 3000  // 使用自定义端口
    }
  }
})
```

### 2. 热更新不工作

确保配置中启用了热更新：

```typescript
export default defineConfig(store => {
  return {
    server: {
      hot: true  // 启用热更新
    }
  }
})
```

### 3. TypeScript 类型错误

确保正确继承了 EMP 的 TypeScript 配置：

```json
{
  "extends": "@empjs/cli/tsconfig/react"
}
```

### 4. 构建后文件路径错误

检查 `base` 配置：

```typescript
export default defineConfig(store => {
  return {
    base: '/',  // 或者你的子路径，如 '/app/'
  }
})
```

## 下一步

现在你已经成功运行了第一个 EMP 项目！接下来可以：

- 📖 阅读 [核心架构](./02-architecture.md) 了解 EMP 的设计理念
- 🔧 查看 [配置详解](./04-configuration.md) 深入了解配置选项
- 🔌 学习 [插件系统](./05-plugin-system.md) 扩展功能
- 🚀 探索 [最佳实践](./10-best-practices.md) 优化你的应用

## 相关资源

- [官方示例](https://github.com/empjs/emp/tree/main/examples)
- [API 参考](./09-api-reference.md)
- [命令行工具](./03-cli-commands.md)
