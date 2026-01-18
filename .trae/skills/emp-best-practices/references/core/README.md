# EMP CLI 架构分析与使用指南

## 📋 项目结构与核心模块

EMP CLI 是基于 Rspack 的高性能微前端构建工具，其核心设计目标是提供开箱即用的模块联邦支持和极致的构建性能。

### 核心模块
- **@empjs/cli**: 命令行入口，负责命令解析和生命周期管理
- **@empjs/share**: 模块联邦核心实现，封装了 Module Federation Plugin
- **@empjs/compiler**: 编译核心，基于 Rspack
- **@empjs/config**: 配置系统，支持 TypeScript 和动态配置

## ⚡ 主要命令

```bash
# 启动开发服务器
emp dev

# 构建生产环境
emp build

# 预览构建产物
emp serve

# 分析构建产物
emp build --analyze

# 初始化项目
emp init
```

## 🔧 配置系统

EMP 使用 `emp.config.ts` 进行配置，提供类型安全的配置体验。

```typescript
import { defineConfig } from '@empjs/cli'

export default defineConfig(store => {
  return {
    server: {
      port: 8000
    },
    build: {
      target: 'es2020'
    }
  }
})
```

### GlobalStore
配置函数接收 `GlobalStore` 对象，包含：
- `mode`: 当前构建模式
- `pkg`: package.json 内容
- `empConfig`: 最终的 EMP 配置

## 🏗️ 模块联邦实现原理

EMP 封装了 Rspack 的 Module Federation，简化了配置：

1. **Host 配置**: 自动处理远程模块加载
2. **Remote 配置**: 自动生成 manifest 和类型定义
3. **共享依赖**: 自动处理单例和版本控制

## 🚀 开发与构建流程

1. **初始化**: 加载配置和插件
2. **编译**: 启动 Rspack 编译
3. **服务**: 启动 DevServer 或输出静态文件

## ⚡ 性能优化

- **持久缓存**: 利用 Rspack 的文件系统缓存
- **并行构建**: 多核并行编译
- **按需加载**: 智能代码分割

## 🛠️ 常见问题

请参考 [故障排除指南](./troubleshooting.md) 获取详细解决方案。
