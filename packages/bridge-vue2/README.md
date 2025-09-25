# EMP Bridge Vue2

EMP Bridge Vue2 是一个用于在 React 应用中集成 Vue2 组件的桥接工具，它解决了 React 与 Vue2 之间组件共享和通信的问题。

## 功能特点

- 支持在 React 应用中使用 Vue2 组件
- 提供简单的 API 用于生产者和消费者之间的通信
- 自动处理 React 与 Vue2 之间的渲染和卸载方法差异
- 支持插件系统扩展 Vue2 功能

## 安装

```bash
# 使用 npm
npm install @empjs/bridge-vue2

# 使用 yarn
yarn add @empjs/bridge-vue2

# 使用 pnpm
pnpm add @empjs/bridge-vue2
```

## 基本用法

### 生产者（Vue2 应用导出组件）

```js
// 在 Vue2 应用中
import Vue from 'vue';

// 创建要共享的 Vue2 组件
const HelloVue = {
  name: 'HelloVue',
  props: {
    name: {
      type: String,
      default: 'Vue2'
    }
  },
  template: '<div>Hello from {{ name }}!</div>'
};

// 导出组件
export default HelloVue;
```

### 消费者（React 应用使用 Vue2 组件）

```jsx
// 在 React 应用中
import React from 'react';
import { createRemoteAppComponent } from '@empjs/bridge-react';
import { createBridgeComponent } from '@empjs/bridge-vue2';

// 导入远程 Vue2 组件
import v2App from 'v2h/HelloVue';

// 获取全局 Vue 实例（通过适配器注入）
const { EMP_ADAPTER_VUE_v2 } = window;
const { Vue } = EMP_ADAPTER_VUE_v2;

// 创建 Vue2 桥接组件
const BridgeComponent = createBridgeComponent(v2App, { Vue });

// 创建可在 React 中使用的组件
export const RemoteVue2App = createRemoteAppComponent(BridgeComponent, { React });

// 在 React 应用中使用
function App() {
  return (
    <div>
      <h1>My React App</h1>
      <RemoteVue2App name="vue2 in React" />
    </div>
  );
}
```

## 热更新支持

在开发环境中，您必须在 `bootstrap.ts` 添加热更新支持：

```js
// 只在热更新时加载 vue-2-hmr 模块
if (module.hot) {
  console.log('vue-2-hmr', module);
  import('src/adapter/vue-2-hmr');
}
```

vue-2-hmr: 预载组件
```js
import 'v2h/HelloVue'
```

## API 参考

### createBridgeComponent

用于生产者包装 Vue2 组件。

```typescript
function createBridgeComponent(
  Component: any,
  options: {
    Vue?: any;
    plugin?: (vue: any) => void;
  }
): BridgeProvider
```

参数:
- `Component`: 要导出的 Vue2 组件
- `options`: Vue2 相关配置
  - `Vue`: Vue2 实例
  - `plugin`: (可选) 用于扩展 Vue 功能的插件函数

### createRemoteAppComponent (来自 @empjs/bridge-react)

用于消费者加载远程组件。

```typescript
function createRemoteAppComponent(
  component: ComponentProvider,
  reactOptions: {
    React: any;
    ReactDOM?: any;
    createRoot?: Function;
  },
  options?: {
    onError?: (error: Error) => void;
  }
): React.ComponentType<any>
```

参数:
- `component`: 组件提供者函数，通常是 `createBridgeComponent` 的返回值
- `reactOptions`: 当前应用的 React 相关配置
  - `React`: React 实例
  - `ReactDOM`: (可选) ReactDOM 实例
  - `createRoot`: (可选) React 18+ 的 createRoot 方法
- `options`: (可选) 额外配置
  - `onError`: 错误处理回调函数

## 使用场景

1. 微前端架构中 React 与 Vue2 应用的集成
2. 在 React 项目中复用现有的 Vue2 组件
3. 逐步从 Vue2 迁移到 React 的过渡阶段

## 注意事项

- 确保正确提供 Vue2 实例
- 组件间通信仅限于 props 传递，不支持 Vue 的 provide/inject 或 React 的 Context API 跨框架共享
- 在使用前需要确保 Vue2 适配器已正确加载
- 复杂的状态管理需要在各自框架内部处理