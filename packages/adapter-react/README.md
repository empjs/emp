# @empjs/adapter-react

一个轻量级的 React 适配器，用于 EMP 微前端框架中跨 React 版本渲染组件。

## 特性

- 🚀 简洁高效的实现
- 📦 支持 React 16/17/18/19 多版本兼容
- 🔄 支持异步组件加载和动态导入
- 🎯 完整的 TypeScript 类型支持
- 🛡️ 稳定的跨版本渲染机制

## 安装

```bash
npm install @empjs/adapter-react
```

## 使用

[DEMO](https://github.com/empjs/emp/blob/main/apps/adapter-app/src/App.tsx)

### 基础用法

```typescript
import { reactAdapter } from '@empjs/adapter-react'
import MyComponent from './MyComponent'

// 适配一个组件
const WrappedComponent = reactAdapter.adapter(MyComponent)

// 使用适配后的组件
<WrappedComponent {...props} />
```

### 自定义配置

```typescript
import { ReactAdapter } from '@empjs/adapter-react'
import React from 'react'
import ReactDOM from 'react-dom'

// 创建自定义适配器实例
const adapter = new ReactAdapter({
  React,
  ReactDOM,
  createRoot: ReactDOM.createRoot, // React 18+ 需要
  scope: 'default'
})

// 适配组件
const WrappedComponent = adapter.adapter(MyComponent)
```

### 从全局对象获取配置

```typescript
import { ReactAdapter } from '@empjs/adapter-react'

// 从全局对象获取 React18 的对象
const { EMP_ADAPTER_REACT } = window as any
const react18 = new ReactAdapter(EMP_ADAPTER_REACT)
const RemoteApp = react18.adapter(remoteComponent)
```

### 适配异步组件

```typescript
import { reactAdapter } from '@empjs/adapter-react'

// 适配动态导入的组件
const AsyncComponent = import('./RemoteComponent')
const WrappedAsyncComponent = reactAdapter.adapter(AsyncComponent, 'default')

// 在 JSX 中使用
<WrappedAsyncComponent {...props} />
```

## API

### ReactAdapter

#### constructor(options?)

创建一个新的适配器实例。

**参数:**
- `options` (可选): `ReactAdapterOptions` - 适配器配置选项
  - `React?`: 自定义的 React 库实例
  - `ReactDOM?`: 自定义的 ReactDOM 库实例
  - `createRoot?`: React 18+ 的 createRoot 方法
  - `scope?`: 组件导出的作用域名称，默认为 'default'

**示例:**
```typescript
// 使用默认配置
const adapter = new ReactAdapter()

// 使用自定义配置
const adapter = new ReactAdapter({
  React: CustomReact,
  ReactDOM: CustomReactDOM,
  createRoot: CustomReactDOM.createRoot
})
```

#### adapter(component, scope?, React?, ReactDOM?)

适配一个 React 组件，返回包装后的组件。

**参数:**
- `component`: 要适配的 React 组件或异步组件
- `scope?` (可选): 组件的作用域名称，默认使用实例配置的 scope
- `React?` (可选): 要使用的 React 库，默认使用实例配置的 React
- `ReactDOM?` (可选): 要使用的 ReactDOM 库，默认使用实例配置的 ReactDOM

**返回值:**
- 包装后的 React 组件

**示例:**
```typescript
// 基本用法
const WrappedComponent = reactAdapter.adapter(MyComponent)

// 指定作用域
const WrappedWithScope = reactAdapter.adapter(MyComponent, 'customScope')

// 使用自定义 React 和 ReactDOM
const CustomWrapped = reactAdapter.adapter(
  MyComponent,
  'default',
  CustomReact,
  CustomReactDOM
)
```

## 工作原理

`ReactAdapter` 通过以下机制实现跨 React 版本的组件渲染：

1. 使用类组件包装原始组件，提供统一的渲染容器
2. 自动检测 React 版本并使用对应的渲染方法：
   - React 16/17: 使用 `ReactDOM.render` 和 `ReactDOM.unmountComponentAtNode`
   - React 18+: 使用 `createRoot` 创建根节点并调用 `render` 和 `unmount` 方法
3. 支持异步组件加载，等待 Promise 解析后再渲染
4. 处理组件的生命周期，确保正确挂载、更新和卸载

## 实际应用示例

### 在微前端环境中使用

```typescript
// 主应用
import { ReactAdapter } from '@empjs/adapter-react'
import remoteApp from 'remote/App'
import React from 'react'

// 从全局配置初始化适配器
const { EMP_ADAPTER_REACT } = window as any
const react18 = new ReactAdapter(EMP_ADAPTER_REACT)

// 适配远程应用组件
const RemoteApp = react18.adapter(remoteApp)

// 在 React 16 环境中使用 React 18 组件
const App = () => (
  <div>
    <h1>主应用 (React 16)</h1>
    <RemoteApp>
      <div>这是来自主应用的子内容</div>
    </RemoteApp>
  </div>
)

export default App
```

## 注意事项

- 确保为 React 18+ 提供 `createRoot` 方法
- 异步组件需要通过 `scope` 参数指定导出的组件名称
- 适配器会自动处理不同 React 版本的渲染差异，无需手动判断
