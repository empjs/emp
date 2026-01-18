# React 互调指南

本指南专注于在 React 环境中加载不同版本的 React 组件（如 React 16 Host 加载 React 18 Remote）。

## 场景描述

在微前端升级过程中，可能会出现 Host 应用仍停留在旧版本（React 16/17），而新开发的 Remote 应用使用了 React 18 的情况。EMP Bridge 可以解决版本冲突问题。

## 实现步骤

### 1. 引入 Bridge 组件

```typescript
import { createBridgeComponent, createRemoteAppComponent } from '@empjs/bridge-react'
import React from 'react'
// 引入远程 React 18 组件
import RemoteApp from 'ah/App'
```

### 2. 获取适配器环境

确保 `window.EMP_ADAPTER_REACT` 已经注入（通常由 Host 的 `emp.config.ts` 配置）。

```typescript
const { EMP_ADAPTER_REACT } = window as any
```

### 3. 创建桥接组件

使用 `createBridgeComponent` 将远程组件与适配器环境绑定。

```typescript
// 将 RemoteApp (React 18) 包装，使其能在 React 16 环境下运行
const BridgeComponent = createBridgeComponent(RemoteApp, EMP_ADAPTER_REACT)
```

### 4. 导出组件

```typescript
// 最终导出为当前环境 (React 16) 可用的组件
export const Remote18App = createRemoteAppComponent(BridgeComponent, { React })
```

## 完整示例

参考 `projects/adapter-app/src/adapter/React18.ts`:

```typescript
import {createBridgeComponent, createRemoteAppComponent} from '@empjs/bridge-react'
import AhApp from 'ah/App'
import React from 'react'

const {EMP_ADAPTER_REACT} = window as any

const BridgeComponent = createBridgeComponent(AhApp, EMP_ADAPTER_REACT)
export const Remote18App = createRemoteAppComponent(BridgeComponent, {React})
```

## 类适配器模式

除了函数式 API，EMP 还提供了类适配器 `ReactAdapter`，提供更细粒度的控制。

参考 `projects/adapter-app/src/components/app-adapter.tsx`:

```typescript
import {ReactAdapter} from '@empjs/adapter-react'
import ahApp from 'ah/App'
import React from 'react'

const {EMP_ADAPTER_REACT} = window as any
// 实例化适配器
const react18 = new ReactAdapter(EMP_ADAPTER_REACT)
// 适配组件
const Remote18App = react18.adapter(ahApp)

const App = () => (
  <div>
    <Remote18App />
  </div>
)
```
