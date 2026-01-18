# 实现指南与配置详解

## 原理分析

EMP 的多框架互调基于以下机制：

1.  **DOM 挂载点托管**：Host 组件创建一个空的 DOM 节点（通常是 `div`）。
2.  **生命周期钩子**：
    *   `mount`: 在 DOM 节点创建后，调用 Remote 框架的渲染函数（如 `ReactDOM.render`, `new Vue().$mount`, `createApp().mount`）将 Remote 组件挂载到该节点。
    *   `unmount`: 在 Host 组件销毁时，调用 Remote 框架的销毁函数（如 `ReactDOM.unmountComponentAtNode`, `$destroy`, `unmount`）清理资源。
    *   `update`: 监听 Host 组件 Props 变化，手动更新 Remote 组件实例。

## 详细配置

### 1. `emp.config.ts`

Host 应用需要配置 `empRuntime` 来确保正确的全局环境。

```typescript
// emp.config.ts
export default defineConfig(store => {
  return {
    plugins: [
      pluginRspackEmpShare({
        // ...
        empRuntime: {
          framework: {
            // 设置全局变量，Bridge 将从这里读取 Vue/React 构造函数
            global: 'EMP_ADAPTER_REACT', 
            // 预加载必要的 CDN 资源，确保运行时环境就绪
            libs: [
              'https://unpkg.com/react@18/umd/react.production.min.js',
              'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
              // Vue 相关
              'https://unpkg.com/vue@3/dist/vue.global.js'
            ],
          },
        },
      }),
    ],
  }
})
```

### 2. 依赖管理

在 `package.json` 中，确保安装了对应版本的 Bridge 库。

```json
{
  "dependencies": {
    "@empjs/bridge-react": "^3.0.0",
    "@empjs/bridge-vue2": "^3.0.0",
    "@empjs/bridge-vue3": "^3.0.0"
  }
}
```

## 代码示例

### 通用适配器封装 (React Host)

为了简化使用，可以封装一个通用的高阶组件 (HOC)。

```typescript
// components/Vue3Adapter.tsx
import { createRemoteAppComponent } from '@empjs/bridge-react'
import { createBridgeComponent } from '@empjs/bridge-vue3'
import React from 'react'

const { EMP_ADAPTER_VUE } = window as any
const { Vue } = EMP_ADAPTER_VUE

export function withVue3(Component: any, plugins?: (app: any) => void) {
  const Bridge = createBridgeComponent(Component, {
    Vue,
    plugin: plugins
  })
  return createRemoteAppComponent(Bridge, { React })
}

// 使用
// import VueBtn from 'remote/Button'
// const ReactBtn = withVue3(VueBtn)
```

### 处理路由同步

跨框架路由同步是一个难点，通常建议：

1.  **单路由源**：Host 负责 URL 变化，Remote 监听 URL 变化并更新内部状态，但不直接操作 History API。
2.  **Memory History**：Remote 使用 Memory History，通过 Props 接收 Host 的路由状态。

```typescript
// Vue 3 Remote 中配置 Router
import { createRouter, createMemoryHistory } from 'vue-router'

export const createApp = (historyBase) => {
  const router = createRouter({
    history: createMemoryHistory(historyBase),
    routes: [...]
  })
  // ...
}
```

在 Host 中传递路由信息：

```typescript
// React Host
const ReactVue3App = createRemoteAppComponent(BridgeComponent, { 
  React,
  // 传递初始路由
  initialPath: window.location.pathname 
})
```

## 常见问题

1.  **Context 丢失**：React Context 无法跨越 Vue 组件传递。如果需要共享状态，请使用 Event Bus (如 `mitt`) 或 Redux/Pinia 等独立于 UI 框架的状态管理库。
2.  **样式冲突**：Remote 组件的全局样式可能污染 Host。建议 Remote 组件使用 Scoped CSS 或 CSS Modules。
3.  **事件冒泡**：React 的合成事件系统可能无法捕获 Vue 组件内部的原生事件。建议通过 Props 传递回调函数来处理交互。
