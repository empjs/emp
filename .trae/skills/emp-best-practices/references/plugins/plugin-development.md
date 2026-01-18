# EMP CLI 插件开发指南

本指南详细介绍了如何开发自定义 EMP CLI 插件，包括核心接口、开发模式、测试策略和发布流程。

## 🛠️ 插件开发基础

### 核心接口

所有 EMP CLI 插件都遵循统一的标准接口：

```typescript
export type EMP3PluginType = {
  name: string                           // 插件唯一标识
  rsConfig: (store: GlobalStore) => Promise<void>  // 配置函数
}

export type EMP3PluginFnType = (o: any) => EMP3PluginType
```

### 标准插件模板

```typescript
export default (options = {}) => {
  return {
    name: '@empjs/plugin-example',
    async rsConfig(store: GlobalStore) {
      // 1. 配置验证和默认值设置
      const config = validateConfig(options)
      
      // 2. 条件性插件逻辑
      if (config.enabled) {
        await setupPlugin(store, config)
      }
      
      // 3. 错误处理
      try {
        await configureBuild(store, config)
      } catch (error) {
        store.logger.error(`Plugin ${this.name} failed:`, error)
        throw error
      }
    }
  }
}
```

## 🏗️ GlobalStore 详解

GlobalStore 是插件与 EMP CLI 交互的核心对象：

```typescript
interface GlobalStore {
  // 核心配置
  chain: RspackChain                     // Rspack 配置链
  empConfig: EMPConfig                   // EMP CLI 配置
  mode: string                           // 构建模式 (development/production)
  isDev: boolean                        // 是否开发环境
  
  // 包信息
  pkg: PackageJson                      // package.json 内容
  dependencies: Record<string, string>   // 依赖版本信息
  
  // 文件系统工具
  resolve: (path: string) => string     // 路径解析
  getProjectRoot: () => string          // 项目根目录
  
  // 配置工具
  deepAssign: (target: any, source: any) => any  // 深度合并
  compareVersion: (a: string, b: string) => number  // 版本比较
  
  // 日志系统
  logger: {
    info: (message: string) => void
    warn: (message: string) => void
    error: (message: string, error?: Error) => void
    debug: (message: string) => void
  }
}
```

## 🔧 配置修改模式

### 1. 链式修改模式
使用 `rspack-chain` 进行配置修改：

```typescript
export default (options = {}) => {
  return {
    name: '@empjs/plugin-example',
    async rsConfig(store) {
      // 修改模块规则
      store.chain.module
        .rule('example-rule')
        .test(/\.example$/)
        .use('example-loader')
        .loader(require.resolve('example-loader'))
        .options({ ...options.loaderOptions })
      
      // 添加插件
      store.chain.plugin('example-plugin')
        .use(ExamplePlugin, [options.pluginOptions])
    }
  }
}
```

### 2. 条件配置模式

```typescript
export default (options = {}) => {
  return {
    name: '@empjs/plugin-example',
    async rsConfig(store) {
      const { isDev, mode } = store
      
      // 环境特定配置
      if (isDev) {
        setupDevelopment(store, options)
      } else {
        setupProduction(store, options)
      }
    }
  }
}
```

## 📦 常见插件类型

### 1. 框架集成插件
负责处理特定框架（如 React, Vue）的构建配置。参考 [React 插件指南](./react-plugins.md) 和 [Vue 插件指南](./vue-plugins.md)。

### 2. 资源处理插件
处理图片、字体等静态资源：

```typescript
export default (options = {}) => {
  return {
    name: '@empjs/plugin-resource-handler',
    async rsConfig(store) {
      if (options.images !== false) {
        store.chain.module
          .rule('images')
          .test(/\.(png|jpe?g|gif|webp)$/i)
          .type('asset')
      }
    }
  }
}
```

### 3. 开发体验插件
增强开发服务器功能或调试体验：

```typescript
export default (options = {}) => {
  return {
    name: '@empjs/plugin-dev-experience',
    async rsConfig(store) {
      if (!store.isDev) return
      
      store.chain.devtool('eval-cheap-module-source-map')
    }
  }
}
```

## 🧪 插件测试

### 单元测试示例

```typescript
// tests/plugin.test.ts
import myPlugin from '../src/index'

const mockStore = {
  chain: {
    module: {
      rule: jest.fn().mockReturnThis(),
      // ... mock chain methods
    },
    plugin: jest.fn().mockReturnThis()
  },
  isDev: true,
  logger: { info: jest.fn(), error: jest.fn() }
} as any

describe('My Plugin', () => {
  test('should configure correctly', async () => {
    const plugin = myPlugin()
    await plugin.rsConfig(mockStore)
    expect(mockStore.chain.module.rule).toHaveBeenCalledWith('example-rule')
  })
})
```

## 🚀 发布指南

### package.json 配置

```json
{
  "name": "@empjs/plugin-example",
  "version": "1.0.0",
  "peerDependencies": {
    "@empjs/cli": "^3.0.0"
  },
  "devDependencies": {
    "@empjs/cli": "^3.0.0",
    "typescript": "^4.9.0"
  }
}
```

### 最佳实践

1.  **命名规范**: 使用 `@empjs/plugin-` 前缀。
2.  **配置设计**: 提供合理的默认值，支持 TypeScript 类型定义。
3.  **错误处理**: 优雅处理配置错误，提供清晰的日志。
4.  **性能**: 避免在 `rsConfig` 中执行耗时操作，尽量使用异步加载。

更多使用场景请参考 [插件使用场景指南](./plugin-usage-guide.md)。
