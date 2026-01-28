# 插件系统

本章节介绍 @empjs/cli 的插件系统，包括如何使用现有插件和开发自定义插件。

## 插件概述

EMP CLI 的插件系统允许你扩展构建功能，添加框架支持、优化构建过程等。

### 插件类型

```typescript
export type EMP3PluginType = {
  name: string
  rsConfig: (store: GlobalStore) => Promise<void>
}

export type EMP3PluginFnType = (options: any) => EMP3PluginType
```

## 官方插件

### @empjs/plugin-react

React 框架支持插件。

#### 安装

```bash
pnpm add @empjs/plugin-react
```

#### 使用

```typescript
import { defineConfig } from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'

export default defineConfig(store => {
  return {
    plugins: [
      pluginReact({
        // 选项
      })
    ]
  }
})
```

#### 选项

```typescript
pluginReact({
  // React 刷新配置
  refresh: true,
  
  // JSX 运行时
  runtime: 'automatic',  // 'automatic' | 'classic'
  
  // 开发模式配置
  development: store.mode === 'development'
})
```

### @empjs/plugin-vue2

Vue 2 框架支持插件。

#### 安装

```bash
pnpm add @empjs/plugin-vue2 vue@2
```

#### 使用

```typescript
import { defineConfig } from '@empjs/cli'
import pluginVue2 from '@empjs/plugin-vue2'

export default defineConfig(store => {
  return {
    plugins: [
      pluginVue2()
    ]
  }
})
```

### @empjs/plugin-vue3

Vue 3 框架支持插件。

#### 安装

```bash
pnpm add @empjs/plugin-vue3 vue@3
```

#### 使用

```typescript
import { defineConfig } from '@empjs/cli'
import pluginVue3 from '@empjs/plugin-vue3'

export default defineConfig(store => {
  return {
    plugins: [
      pluginVue3()
    ]
  }
})
```

### @empjs/share

模块联邦共享插件。

#### 安装

```bash
pnpm add @empjs/share
```

#### 使用

```typescript
import { defineConfig } from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import { pluginRspackEmpShare, externalReact } from '@empjs/share'

export default defineConfig(store => {
  const ip = store.server.ip
  const port = 8001
  
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        // 应用名称
        name: 'host',
        
        // 暴露的组件
        exposes: {
          './App': './src/App',
          './Button': './src/components/Button'
        },
        
        // 远程模块
        remotes: {
          'remote': 'remote@http://localhost:8002/emp.js'
        },
        
        // 共享依赖
        shared: {
          react: {
            singleton: true,
            requiredVersion: '^18.0.0'
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^18.0.0'
          }
        },
        
        // 生成清单文件
        manifest: true,
        
        // 类型声明
        dts: {
          generateTypes: true,
          consumeTypes: true
        },
        
        // EMP 运行时
        empRuntime: {
          framework: {
            global: 'EMP_ADAPTER_REACT',
            libs: [`https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.${store.mode}.umd.js`]
          },
          runtime: {
            lib: `http://${ip}:2100/sdk.js`
          },
          setExternals: externalReact
        }
      })
    ],
    server: {
      port
    }
  }
})
```

#### 配置选项

```typescript
{
  // 应用名称（必填）
  name: string
  
  // 暴露的模块
  exposes?: {
    [key: string]: string
  }
  
  // 远程模块
  remotes?: {
    [key: string]: string
  }
  
  // 共享依赖
  shared?: {
    [key: string]: {
      singleton?: boolean
      requiredVersion?: string
      eager?: boolean
    }
  }
  
  // 生成清单文件
  manifest?: boolean
  
  // 类型声明配置
  dts?: {
    generateTypes?: boolean  // 生成类型
    consumeTypes?: boolean   // 消费类型
    typingsPath?: string     // 类型文件路径
  }
  
  // EMP 运行时配置
  empRuntime?: {
    framework?: {
      global: string
      libs: string[]
    }
    runtime?: {
      lib: string
    }
    setExternals?: (config: any) => void
  }
}
```

## 开发自定义插件

### 基本结构

```typescript
import type { EMP3PluginFnType } from '@empjs/cli'

export const myPlugin: EMP3PluginFnType = (options = {}) => {
  return {
    name: 'my-plugin',
    async rsConfig(store) {
      // 修改 Rspack 配置
      // store.rsConfig 可以直接修改
      // store.chainConfig 可以使用链式 API
    }
  }
}
```

### 访问 Store

```typescript
export const myPlugin: EMP3PluginFnType = (options = {}) => {
  return {
    name: 'my-plugin',
    async rsConfig(store) {
      // 访问运行模式
      const isDev = store.mode === 'development'
      
      // 访问配置
      const empConfig = store.empConfig
      const rsConfig = store.rsConfig
      
      // 访问路径
      const appSrc = store.appSrc
      const outDir = store.outDir
      
      // 访问服务器信息
      const port = store.server.port
      const ip = store.server.ip
    }
  }
}
```

### 修改 Rspack 配置

#### 方式一：直接修改

```typescript
export const myPlugin: EMP3PluginFnType = (options = {}) => {
  return {
    name: 'my-plugin',
    async rsConfig(store) {
      // 添加插件
      store.rsConfig.plugins = store.rsConfig.plugins || []
      store.rsConfig.plugins.push(new MyRspackPlugin())
      
      // 修改 loader
      store.rsConfig.module = store.rsConfig.module || {}
      store.rsConfig.module.rules = store.rsConfig.module.rules || []
      store.rsConfig.module.rules.push({
        test: /\.custom$/,
        use: 'custom-loader'
      })
    }
  }
}
```

#### 方式二：使用链式 API

```typescript
export const myPlugin: EMP3PluginFnType = (options = {}) => {
  return {
    name: 'my-plugin',
    async rsConfig(store) {
      // 添加 loader
      store.chainConfig.module
        .rule('custom')
        .test(/\.custom$/)
        .use('custom-loader')
        .loader('custom-loader')
        .options({
          // loader 选项
        })
      
      // 添加插件
      store.chainConfig
        .plugin('my-plugin')
        .use(MyRspackPlugin, [{
          // 插件选项
        }])
      
      // 修改已有配置
      store.chainConfig.module
        .rule('js')
        .use('babel-loader')
        .tap(options => ({
          ...options,
          plugins: [
            ...options.plugins,
            'my-babel-plugin'
          ]
        }))
    }
  }
}
```

### 插件示例

#### 示例 1：环境变量注入插件

```typescript
import type { EMP3PluginFnType } from '@empjs/cli'
import { rspack } from '@rspack/core'

export const envPlugin: EMP3PluginFnType = (env = {}) => {
  return {
    name: 'env-plugin',
    async rsConfig(store) {
      const defines = {}
      
      for (const [key, value] of Object.entries(env)) {
        defines[`process.env.${key}`] = JSON.stringify(value)
      }
      
      store.chainConfig
        .plugin('env-plugin')
        .use(rspack.DefinePlugin, [defines])
    }
  }
}

// 使用
export default defineConfig(store => {
  return {
    plugins: [
      envPlugin({
        API_URL: 'https://api.example.com',
        VERSION: '1.0.0'
      })
    ]
  }
})
```

#### 示例 2：自定义 Loader 插件

```typescript
import type { EMP3PluginFnType } from '@empjs/cli'

export const markdownPlugin: EMP3PluginFnType = (options = {}) => {
  return {
    name: 'markdown-plugin',
    async rsConfig(store) {
      store.chainConfig.module
        .rule('markdown')
        .test(/\.md$/)
        .use('html-loader')
        .loader('html-loader')
        .end()
        .use('markdown-loader')
        .loader('markdown-loader')
        .options(options)
    }
  }
}

// 使用
export default defineConfig(store => {
  return {
    plugins: [
      markdownPlugin({
        // markdown-loader 选项
      })
    ]
  }
})
```

#### 示例 3：代码分析插件

```typescript
import type { EMP3PluginFnType } from '@empjs/cli'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

export const analyzerPlugin: EMP3PluginFnType = (options = {}) => {
  return {
    name: 'analyzer-plugin',
    async rsConfig(store) {
      if (store.mode === 'production') {
        store.chainConfig
          .plugin('bundle-analyzer')
          .use(BundleAnalyzerPlugin, [{
            analyzerMode: 'static',
            openAnalyzer: false,
            ...options
          }])
      }
    }
  }
}
```

#### 示例 4：复制文件插件

```typescript
import type { EMP3PluginFnType } from '@empjs/cli'
import { rspack } from '@rspack/core'

export const copyPlugin: EMP3PluginFnType = (patterns = []) => {
  return {
    name: 'copy-plugin',
    async rsConfig(store) {
      store.chainConfig
        .plugin('copy-plugin')
        .use(rspack.CopyRspackPlugin, [{
          patterns
        }])
    }
  }
}

// 使用
export default defineConfig(store => {
  return {
    plugins: [
      copyPlugin([
        { from: 'public', to: 'dist' }
      ])
    ]
  }
})
```

### 异步操作

插件可以执行异步操作：

```typescript
export const asyncPlugin: EMP3PluginFnType = (options = {}) => {
  return {
    name: 'async-plugin',
    async rsConfig(store) {
      // 异步获取配置
      const config = await fetchConfig()
      
      // 应用配置
      store.rsConfig.plugins.push(
        new MyPlugin(config)
      )
    }
  }
}
```

### 插件间通信

通过 store 共享数据：

```typescript
// 插件 A：设置数据
export const pluginA: EMP3PluginFnType = () => {
  return {
    name: 'plugin-a',
    async rsConfig(store) {
      // 在 store 上设置自定义属性
      ;(store as any).customData = {
        value: 'from plugin A'
      }
    }
  }
}

// 插件 B：读取数据
export const pluginB: EMP3PluginFnType = () => {
  return {
    name: 'plugin-b',
    async rsConfig(store) {
      // 读取插件 A 设置的数据
      const data = (store as any).customData
      console.log(data.value)  // 'from plugin A'
    }
  }
}
```

## 插件最佳实践

### 1. 命名规范

```typescript
// 好的命名
export const pluginReact: EMP3PluginFnType = () => ({ ... })
export const pluginVue: EMP3PluginFnType = () => ({ ... })

// 避免
export const react: EMP3PluginFnType = () => ({ ... })
```

### 2. 选项验证

```typescript
export const myPlugin: EMP3PluginFnType = (options = {}) => {
  // 验证选项
  if (!options.required) {
    throw new Error('myPlugin: required option is missing')
  }
  
  return {
    name: 'my-plugin',
    async rsConfig(store) {
      // ...
    }
  }
}
```

### 3. 环境检测

```typescript
export const myPlugin: EMP3PluginFnType = (options = {}) => {
  return {
    name: 'my-plugin',
    async rsConfig(store) {
      const isDev = store.mode === 'development'
      
      if (isDev) {
        // 开发模式配置
      } else {
        // 生产模式配置
      }
    }
  }
}
```

### 4. 条件应用

```typescript
export const myPlugin: EMP3PluginFnType = (options = {}) => {
  return {
    name: 'my-plugin',
    async rsConfig(store) {
      // 只在特定条件下应用
      if (options.enabled === false) {
        return
      }
      
      // 应用配置
    }
  }
}
```

### 5. 错误处理

```typescript
export const myPlugin: EMP3PluginFnType = (options = {}) => {
  return {
    name: 'my-plugin',
    async rsConfig(store) {
      try {
        // 可能失败的操作
        const config = await fetchConfig()
        store.rsConfig.plugins.push(new MyPlugin(config))
      } catch (error) {
        console.error('myPlugin error:', error)
        // 决定是抛出错误还是继续
      }
    }
  }
}
```

## 插件调试

### 1. 日志输出

```typescript
export const myPlugin: EMP3PluginFnType = (options = {}) => {
  return {
    name: 'my-plugin',
    async rsConfig(store) {
      if (store.debug.loggerLevel === 'debug') {
        console.log('[my-plugin] Options:', options)
        console.log('[my-plugin] Store:', store)
      }
    }
  }
}
```

### 2. 配置检查

```typescript
export const myPlugin: EMP3PluginFnType = (options = {}) => {
  return {
    name: 'my-plugin',
    async rsConfig(store) {
      // 应用配置
      
      // 检查最终配置
      if (store.debug.showRsconfig) {
        console.log('[my-plugin] Final config:', store.rsConfig)
      }
    }
  }
}
```

## 发布插件

### 1. 包结构

```
my-emp-plugin/
├── src/
│   └── index.ts
├── dist/
│   ├── index.js
│   └── index.d.ts
├── package.json
├── README.md
└── tsconfig.json
```

### 2. package.json

```json
{
  "name": "@scope/emp-plugin-xxx",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "peerDependencies": {
    "@empjs/cli": "^3.0.0"
  }
}
```

### 3. 文档

在 README.md 中包含：
- 插件功能说明
- 安装方法
- 使用示例
- 配置选项
- 注意事项

## 下一步

- 📖 查看 [开发服务器](./06-dev-server.md) 了解服务器配置
- 🚀 阅读 [最佳实践](./10-best-practices.md) 优化插件
- 📖 查看 [API 参考](./09-api-reference.md) 了解更多 API
