# EMP 多框架互调指南

本指南详细介绍了如何使用 EMP CLI 的 Bridge 系统实现 React、Vue 2 和 Vue 3 之间的无缝互调。

## 目录

- [核心概念](#核心概念)
- [配置要求](#配置要求)
- [React 互调](#react-互调)
- [Vue 2 互调](#vue-2-互调)
- [Vue 3 互调](#vue-3-互调)

## 核心概念

EMP 的互调方案基于 **Bridge Component** 模式：

1.  **Remote Component**: 原始的远程组件（React/Vue）。
2.  **Bridge Component**: 使用特定框架的 Bridge 函数（如 `createBridgeComponent`）将原始组件包装，处理生命周期、Props 传递和挂载逻辑。
3.  **Host Component**: 使用 Host 框架的 Adapter 函数（如 `createRemoteAppComponent`）将 Bridge 组件转换为 Host 可识别的组件。

## 配置要求

在 `emp.config.ts` 中，需要配置 `empRuntime` 以注入必要的全局变量和运行时库。

```typescript
import { defineConfig } from '@empjs/cli'
import { pluginRspackEmpShare } from '@empjs/share'

export default defineConfig(store => {
  return {
    plugins: [
      pluginRspackEmpShare({
        // ...
        empRuntime: {
          framework: {
            // 定义全局变量名，用于访问适配器
            global: 'EMP_ADAPTER_REACT',
            // 注入 CDN 依赖
            libs: [
               `https://unpkg.com/@empjs/cdn-vue@0.2.1/dist/vueRouter.${store.mode}.umd.js`,
               // 其他必要的库...
            ],
          },
        },
      }),
    ],
  }
})
```

## React 互调

### 加载不同版本的 React 组件

适用于 React 16/17 项目加载 React 18 组件，反之亦然。

```typescript
import { createBridgeComponent, createRemoteAppComponent } from '@empjs/bridge-react'
import RemoteApp from 'remoteApp/App'
import React from 'react'

// 从全局变量获取适配器上下文
const { EMP_ADAPTER_REACT } = window as any

// 创建桥接
const BridgeComponent = createBridgeComponent(RemoteApp, EMP_ADAPTER_REACT)

// 导出为当前环境可用的 React 组件
export const RemoteReactComponent = createRemoteAppComponent(BridgeComponent, { React })
```

## Vue 2 互调

### React 加载 Vue 2 组件

```typescript
import { createRemoteAppComponent } from '@empjs/bridge-react'
import { createBridgeComponent } from '@empjs/bridge-vue2'
import React from 'react'
import { HelloVue, store } from 'remoteVue2App/Exports'

const { EMP_ADAPTER_VUE_v2 } = window as any
const { Vue } = EMP_ADAPTER_VUE_v2

// 封装工厂函数
function createVue2Bridge(Component: any, options: any = {}) {
  const Bridge = createBridgeComponent(Component, { 
    Vue, 
    ...options 
  })
  return createRemoteAppComponent(Bridge, { React })
}

// 使用
export const ReactVue2Hello = createVue2Bridge(HelloVue, { 
  instanceOptions: { store } // 传入 Vuex store
})
```

## Vue 3 互调

### React 加载 Vue 3 组件

```typescript
import { createRemoteAppComponent } from '@empjs/bridge-react'
import { createBridgeComponent } from '@empjs/bridge-vue3'
import React from 'react'
import Vue3App from 'remoteVue3App/App'

const { EMP_ADAPTER_VUE } = window as any
const { Vue, Pinia } = EMP_ADAPTER_VUE

const BridgeComponent = createBridgeComponent(Vue3App, {
  Vue,
  // 插件安装回调
  plugin: (app) => {
    const pinia = Pinia.createPinia()
    app.use(pinia)
    // app.use(router)
  },
})

export const ReactVue3App = createRemoteAppComponent(BridgeComponent, { React })
```

## 最佳实践

1.  **样式隔离**：建议使用 CSS Modules 或 Shadow DOM 来避免不同框架间的样式冲突。
2.  **上下文共享**：对于 Router 和 Store，尽量在 Host 端统一管理，或者通过 Props/Event Bus 显式传递状态，避免复杂的上下文嵌套。
3.  **懒加载**：始终使用 `React.lazy` 或类似机制异步加载跨框架组件，配合 `Suspense` 和 `ErrorBoundary` 提升用户体验。

```typescript
const RemoteComponent = React.lazy(() => import('./adapter/Vue3Component'))

const App = () => (
  <ErrorBoundary>
    <Suspense fallback="Loading...">
      <RemoteComponent />
    </Suspense>
  </ErrorBoundary>
)
```
