# Vue 互调指南

本指南专注于在 React 环境中加载 Vue 2 和 Vue 3 组件。

## Vue 2 互调

### 1. 场景与依赖
适用于 React Host 需要加载遗留 Vue 2 微应用的情况。
依赖：`@empjs/bridge-vue2`

### 2. 代码实现

参考 `projects/adapter-app/src/adapter/Vue2.tsx`:

```typescript
import {createRemoteAppComponent} from '@empjs/bridge-react'
import {createBridgeComponent} from '@empjs/bridge-vue2'
import React from 'react'
// 必须预加载 Vue 2 的导出，包括 Vue 实例、插件、Store 等
import {Content, HelloVue, plugin, store, Table} from 'src/adapter/Vue2Exports'

const {EMP_ADAPTER_VUE_v2} = window as any
const {Vue} = EMP_ADAPTER_VUE_v2

function createVue2BridgeComponent(Vue2Component: any) {
  // 创建桥接组件，注入 Vue 构造函数、插件和实例选项（如 store）
  const BridgeComponent = createBridgeComponent(Vue2Component, {
    Vue, 
    plugin, 
    instanceOptions: {store}
  })
  // 转换为 React 组件
  return createRemoteAppComponent(BridgeComponent, {React})
}

export const Vue2Hello = createVue2BridgeComponent(HelloVue)
export const Vue2Content = createVue2BridgeComponent(Content)
```

### 3. Vue 2 导出规范
Vue 2 应用端 (`Vue2Exports.ts`) 需要导出组件和必要的运行时上下文：

```typescript
import Vue from 'vue'
import store from './store'
import HelloVue from './components/Hello.vue'

// 导出组件
export { HelloVue }
// 导出 store
export { store }
// 导出插件安装函数
export const plugin = (Vue: any) => {
  // 安装全局插件
  // Vue.use(ElementUI)
}
```

## Vue 3 互调

### 1. 场景与依赖
适用于 React Host 集成新的 Vue 3 模块。
依赖：`@empjs/bridge-vue3`

### 2. 代码实现

参考 `projects/adapter-app/src/adapter/Vue3.ts`:

```typescript
import {createRemoteAppComponent} from '@empjs/bridge-react'
import {createBridgeComponent} from '@empjs/bridge-vue3'
import React from 'react'
import v3App from 'v3h/Info'

const {EMP_ADAPTER_VUE} = window as any
const {Vue, Pinia} = EMP_ADAPTER_VUE

const BridgeComponent = createBridgeComponent(v3App, {
  Vue,
  // Vue 3 使用 plugin 函数来配置 app 实例
  plugin: (app) => {
    const pinia = Pinia.createPinia()
    app.use(pinia)
    // app.use(router)
  },
})

export const RemoteVue3App = createRemoteAppComponent(BridgeComponent, {React})
```

### 3. 关键配置
- **Pinia/Router**: 需要在 `plugin` 回调中手动挂载，确保每个实例有独立的状态管理。
- **全局变量**: 确保 `EMP_ADAPTER_VUE` 包含 `Vue` 和 `Pinia` 等库的引用。
