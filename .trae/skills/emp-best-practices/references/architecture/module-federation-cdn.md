# EMP CLI 模块联邦与 CDN 集成指南

## 📋 项目架构概览

基于 `mf-host` 和 `mf-app` 示例，EMP CLI 展示了与 CDN 集成的复杂模块联邦架构：

**mf-host (远程应用程序):**
- **角色**: 向其他应用程序暴露组件的提供者
- **端口**: 6001
- **暴露的模块**: App、CountComp、Section 组件
- **依赖**: MobX 用于状态管理，@emp/share 用于联邦

**mf-app (Host 应用程序):**
- **角色**: 加载和使用远程模块的消费者
- **端口**: 6002
- **远程源**: 从 `mfHost@http://localhost:6001/emp.json` 消费
- **依赖**: 最小设置，仅使用 @emp/share

## 🔧 远程应用配置 (mf-host)

```typescript
// emp.config.ts
import {defineConfig} from '@empjs/cli'
import {pluginRspackEmpShare, externalReact} from '@empjs/share'
import pluginReact from '@empjs/plugin-react'

export default defineConfig(store => {
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: 'mfHost', // 远程应用的唯一标识符
        exposes: {
          './App': './src/App',           // 主应用组件
          './CountComp': './src/CountComp', // 带 MobX 的计数器
          './Section': './src/component/Section', // UI 组件
        },
        manifest: true, // 生成 emp.json 用于发现
        empRuntime: {
          framework: {
            global: 'EMP_ADAPTER_REACT',
            libs: [`https://unpkg.com/@empjs/cdn-react@0.19.1/dist/react.${store.mode}.umd.js`],
          },
          runtime: {
            lib: `https://unpkg.com/@empjs/share@3.11.4/output/sdk.js`,
          },
          setExternals: externalReact,
        },
      }),
    ],
    server: {
      port: 6001,
    },
  }
})
```

## 🔧 Host 应用配置 (mf-app)

```typescript
// emp.config.ts
import {defineConfig} from '@empjs/cli'
import {pluginRspackEmpShare, externalReact} from '@empjs/share'
import pluginReact from '@empjs/plugin-react'

export default defineConfig(store => {
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: store.uniqueName,
        shared: {
          react: {
            singleton: true, // 确保单个 React 实例
            requiredVersion: '18',
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '18',
          },
        },
        remotes: {
          mfHost: `mfHost@http://${store.server.ip}:6001/emp.json`,
        },
        empRuntime: {
          framework: {
            global: 'EMP_ADAPTER_REACT',
            libs: [`https://unpkg.com/@empjs/cdn-react@0.19.1/dist/react.${store.mode}.umd.js`],
          },
          runtime: {
            lib: `http://${store.server.ip}:2100/sdk.js`, // 开发环境本地 SDK
          },
          setExternals: externalReact,
        },
      }),
    ],
    server: {
      port: 6002,
    },
  }
})
```

## 🎯 外部依赖配置

`externalReact` 函数确保一致的框架外部化：

```typescript
// @emp/share 工具函数
export const externalReact = (o: any, globalVal: string) => {
  o = Object.assign(o, {
    react: `${globalVal}.React`,
    'react-dom': `${globalVal}.ReactDOM`,
    'react-dom/client': globalVal,
    'react/jsx-runtime': globalVal,
    'react/jsx-dev-runtime': globalVal,
    'react-router-dom': `${globalVal}.ReactRouterDOM`,
  })
  return o
}
```

## 📦 CDN 集成策略

### 框架 CDN 加载
```typescript
// 从 CDN 加载 React 框架
libs: [`https://unpkg.com/@empjs/cdn-react@0.19.1/dist/react.${store.mode}.umd.js`]

// 模块联邦运行时 SDK
lib: `https://unpkg.com/@empjs/share@3.11.4/output/sdk.js`

// 开发环境 vs 生产环境
store.mode === 'development' 
  ? `react.development.umd.js` 
  : `react.production.umd.js`
```

### Polyfill CDN 集成
```typescript
// 浏览器兼容性 polyfills
build: {
  polyfill: {
    mode: 'entry',
    entryCdn: 'https://unpkg.com/@empjs/polyfill@2025.9.12/dist/c71.js',
    browserslist: ['iOS >= 9', 'Android >= 4.4', 'last 2 versions'],
  },
}
```

## 🚀 远程模块消费模式

### 基础远程组件使用
```typescript
// mf-app 消费远程模块
import Host from 'mfHost/App'

const App = () => (
  <div>
    <Host 
      from="fromMainAppName" 
      nameformRemote="nameformRemote" 
      increment={1} 
    />
  </div>
)
```

### 高级用法与错误边界
```typescript
import React, {Suspense, lazy} from 'react'

const RemoteComponent = lazy(() => import('mfHost/CountComp'))

const App = () => (
  <ErrorBoundary fallback={<div>Failed to load remote component</div>}>
    <Suspense fallback={<div>Loading remote component...</div>}>
      <RemoteComponent initialValue={42} />
    </Suspense>
  </ErrorBoundary>
)
```

## 🔄 跨联邦边界的状态共享

### MobX Store 共享
```typescript
// mf-host/src/CountComp.tsx
import {observer} from 'mobx-react-lite'
import {useStore} from './store'

const CountComp = observer(() => {
  const {counter} = useStore()
  
  return (
    <div>
      <span>{counter.count}</span>
      <button onClick={counter.increment}>+</button>
    </div>
  )
})

// Store 可以在应用程序之间共享
export const useCounterStore = () => useStore()
```

### 基于 Props 的通信
```typescript
// mf-app 使用带状态的远程组件
import Host from 'mfHost/App'

const App = () => {
  const [sharedState, setSharedState] = useState('shared data')
  
  return (
    <Host 
      sharedData={sharedState}
      onStateChange={setSharedState}
      timestamp={Date.now()}
    />
  )
}
```

## 🎭 开发工作流集成

### 本地开发设置
```typescript
// 开发环境使用本地 SDK
runtime: {
  lib: `http://${store.server.ip}:2100/sdk.js`,
}

// 生产环境 CDN
runtime: {
  lib: `https://unpkg.com/@empjs/share@3.11.4/output/sdk.js`,
}
```

### 热模块替换
```typescript
// HMR 跨联邦边界工作
server: {
  port: 6001, // mf-host
  // port: 6002, // mf-app
  hot: true,
  open: true,
}
```

## 📈 性能优化技术

### 包体积优化
```typescript
// 外部化框架依赖
empRuntime: {
  setExternals: externalReact, // 外部化 React
  framework: {
    libs: [`https://unpkg.com/@empjs/cdn-react@0.19.1/dist/react.${store.mode}.umd.js`],
  },
}

// 共享依赖的单例模式
shared: {
  react: { singleton: true, requiredVersion: '18' },
  'react-dom': { singleton: true, requiredVersion: '18' },
}
```

### 加载性能
```typescript
// 延迟加载远程模块
const RemoteComponent = React.lazy(() => import('mfHost/Component'))

// 预加载关键远程模块
const preloadRemote = () => {
  import('mfHost/App') // 在后台预加载
}
```

## 🛡️ 错误处理与调试

### 远程模块的错误边界
```typescript
class RemoteErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Remote module error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <div>Remote application unavailable</div>
    }
    return this.props.children
  }
}
```

### 开发调试
```typescript
// 启用源映射进行调试
build: {
  sourcemap: store.mode === 'development',
}

// 故障排除的详细日志
debug: {
  loggerLevel: store.mode === 'development' ? 'debug' : 'info',
}
```

## 🚀 部署策略

### 多环境配置
```typescript
export default defineConfig(store => {
  const isDev = store.mode === 'development'
  const isProd = store.mode === 'production'
  
  const cdnBase = isDev 
    ? `http://${store.server.ip}:2100` 
    : 'https://unpkg.com/@empjs/share'
  
  return {
    plugins: [
      pluginRspackEmpShare({
        empRuntime: {
          runtime: {
            lib: `${cdnBase}/sdk.js`,
          },
        },
      }),
    ],
  }
})
```

### 发现的清单生成
```typescript
// 始终生成清单以进行远程发现
pluginRspackEmpShare({
  manifest: true, // 创建 emp.json
  dts: { generateTypes: true }, // TypeScript 声明
})
```

## 📋 最佳实践总结

### 1. 配置管理
- 使用 `externalReact` 进行一致的框架外部化
- 启用 `manifest: true` 进行远程发现
- 为共享依赖配置单例模式

### 2. CDN 策略
- 使用可靠的 CDN (unpkg, jsdelivr) 进行框架库加载
- 开发环境与生产环境的环境特定 CDN URL
- 本地 SDK 以加快开发迭代

### 3. 性能优化
- 外部化框架依赖以减少包体积
- 为非关键远程模块实施延迟加载
- 使用单例模式防止重复依赖

### 4. 错误处理
- 用错误边界包装远程组件
- 为失败的远程加载实施回退 UI
- 使用 Suspense 处理加载状态

### 5. 开发体验
- 跨联邦边界启用 HMR
- 使用源映射进行调试
- 为多个应用程序配置适当的端口管理

这个全面的模块联邦实现展示了 EMP CLI 如何通过 CDN 集成实现复杂的微前端架构，同时提供性能优化和出色的开发体验。
