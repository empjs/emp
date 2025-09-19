# EMP Bridge React

EMP Bridge React 是一个用于跨 React 版本组件通信的桥接工具，它解决了不同 React 版本之间组件共享和通信的问题。

## 功能特点

- 支持不同 React 版本（16/17/18/19）之间的组件共享
- 提供简单的 API 用于生产者和消费者之间的通信
- 自动处理 React 不同版本的渲染和卸载方法差异
- 支持异步加载组件

## 安装

```bash
# 使用 npm
npm install @empjs/bridge-react

# 使用 yarn
yarn add @empjs/bridge-react

# 使用 pnpm
pnpm add @empjs/bridge-react
```

## 基本用法

### 生产者（导出组件的应用）

```tsx
// 在 React 16/17 应用中
import React from 'react';
import { createBridgeComponent } from '@empjs/bridge-react';

// 创建要共享的组件
const MyComponent = (props) => {
  return <div>Hello from React 16/17! {props.message}</div>;
};

// 导出桥接组件
export default createBridgeComponent(MyComponent, {
  React,
  ReactDOM: require('react-dom'),
  // React 18+ 才有 createRoot
  // createRoot: require('react-dom/client').createRoot
});
```

### 消费者（使用组件的应用）

```tsx
// 在 React 18/19 应用中
import React from 'react';
import { createRemoteAppComponent } from '@empjs/bridge-react';

// 导入远程组件（可以是动态导入）
import RemoteComponent from 'remote-app/MyComponent';

// 创建可在当前 React 版本中使用的组件
const BridgedComponent = createRemoteAppComponent(
  RemoteComponent,
  {
    React,
    ReactDOM: require('react-dom'),
    createRoot: require('react-dom/client').createRoot
  },
  {
    onError: (error) => console.error('Failed to load component:', error)
  }
);

// 在应用中使用
function App() {
  return (
    <div>
      <h1>My App (React 18/19)</h1>
      <BridgedComponent message="Passed from React 18/19" />
    </div>
  );
}
```

## API 参考

### createBridgeComponent

用于生产者包装应用级别导出模块。

```typescript
function createBridgeComponent(
  Component: React.ComponentType<any>,
  options: {
    React: any;
    ReactDOM: any;
    createRoot?: Function;
  }
): BridgeProvider
```

参数:
- `Component`: 要导出的 React 组件
- `options`: React 相关配置
  - `React`: React 实例
  - `ReactDOM`: ReactDOM 实例
  - `createRoot`: (可选) React 18+ 的 createRoot 方法

### createRemoteAppComponent

用于消费者加载应用级别模块。

```typescript
function createRemoteAppComponent(
  component: ComponentProvider,
  reactOptions: {
    React: any;
    ReactDOM: any;
    createRoot?: Function;
  },
  options?: {
    onError?: (error: Error) => void;
  }
): React.ComponentType<any>
```

参数:
- `component`: 组件提供者函数，可以是同步或异步的
- `reactOptions`: 当前应用的 React 相关配置
  - `React`: React 实例
  - `ReactDOM`: ReactDOM 实例
  - `createRoot`: (可选) React 18+ 的 createRoot 方法
- `options`: (可选) 额外配置
  - `onError`: 错误处理回调函数

## 使用场景

1. 微前端架构中不同 React 版本的应用集成
2. 逐步升级大型 React 应用时的版本兼容
3. 共享组件库到不同 React 版本的项目中

## 注意事项

- 确保正确提供对应版本的 React 和 ReactDOM 实例
- 对于 React 18+，需要提供 createRoot 方法
- 组件间通信仅限于 props 传递，不支持 Context API 跨版本共享