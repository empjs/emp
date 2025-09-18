# @empjs/adapter-react

一个最简化的 React 适配器，用于 EMP 微前端框架。

## 特性

- 🚀 最少代码实现
- 📦 支持 React 16/17/18/19
- 🔄 支持异步组件加载
- 🎯 TypeScript 支持
- 📱 支持 ESM 和 CJS

## 安装

```bash
npm install @empjs/adapter-react
```

## 使用

### 基础用法

```typescript
import { reactAdapter } from '@empjs/adapter-react'

// 适配一个组件
const WrappedComponent = reactAdapter.adapter(MyComponent)

// 使用适配后的组件
<WrappedComponent {...props} />
```

### 自定义配置

```typescript
import { ReactAdapter } from '@empjs/adapter-react'

const adapter = new ReactAdapter({
  scope: 'myScope',
  React: CustomReact,
  ReactDOM: CustomReactDOM
})

const WrappedComponent = adapter.adapter(MyComponent)
```

### 获取共享配置

```typescript
import { reactAdapter } from '@empjs/adapter-react'

// 获取用于模块联邦的共享配置
const sharedConfig = reactAdapter.shared
```

## API

### ReactAdapter

#### constructor(options?)

创建一个新的适配器实例。

**参数:**
- `options` (可选): `ReactAdapterOptions` - 适配器配置选项
  - `React?` (可选): `any` - 自定义的 React 库实例，默认使用内置的 React
  - `ReactDOM?` (可选): `any` - 自定义的 ReactDOM 库实例，默认使用内置的 ReactDOM
  - `createRoot?` (可选): `any` - 自定义的 createRoot 方法，默认使用 ReactDOM.createRoot
  - `scope?` (可选): `string` - 组件作用域名称，默认为 'default'

**示例:**
```typescript
// 使用默认配置
const adapter = new ReactAdapter()

// 使用自定义配置
const adapter = new ReactAdapter({
  scope: 'myApp',
  React: CustomReact,
  ReactDOM: CustomReactDOM
})
```

#### setup(options)

更新适配器配置。

**参数:**
- `options`: `ReactAdapterOptions` - 要更新的配置选项

**示例:**
```typescript
const adapter = new ReactAdapter()

// 更新配置
adapter.setup({
  scope: 'newScope',
  React: AnotherReact
})
```

#### adapter(component, scope?, ReactLib?, ReactDOMLib?)

适配一个 React 组件，返回包装后的组件。这是适配器的核心方法，用于将普通组件或异步组件包装成可在微前端环境中使用的组件。

**参数:**
- `component`: `any` - 要适配的 React 组件，可以是：
  - 普通的 React 组件类或函数组件
  - 返回组件的 Promise（用于动态导入）
- `scope?` (可选): `string` - 组件的作用域名称，默认使用实例配置的 scope
- `ReactLib?` (可选): `any` - 要使用的 React 库，默认使用实例配置的 React
- `ReactDOMLib?` (可选): `any` - 要使用的 ReactDOM 库，默认使用实例配置的 ReactDOM

**返回值:**
- `React.ComponentType<P>` - 包装后的 React 组件

**示例:**
```typescript
// 适配普通组件
const MyComponent = () => <div>Hello World</div>
const WrappedComponent = reactAdapter.adapter(MyComponent)

// 适配异步组件
const AsyncComponent = import('./RemoteComponent')
const WrappedAsyncComponent = reactAdapter.adapter(AsyncComponent, 'remote')

// 使用自定义参数
const CustomWrapped = reactAdapter.adapter(
  MyComponent,
  'customScope',
  CustomReact,
  CustomReactDOM
)

// 在 JSX 中使用
<WrappedComponent prop1="value1" prop2="value2" />
```

#### shared

获取模块联邦的共享配置。这个 getter 属性返回用于 Webpack Module Federation 的共享依赖配置。

**返回值:**
- `Record<string, SharedConfig>` - 包含 react 和 react-dom 的共享配置对象

**SharedConfig 类型:**
```typescript
interface SharedConfig {
  lib: () => any           // 库的获取函数
  version: string          // 库的版本号
  scope: string           // 作用域名称
  shareConfig: {
    singleton: boolean     // 是否为单例模式
    requiredVersion: string // 所需的版本范围
  }
}
```

**示例:**
```typescript
const sharedConfig = reactAdapter.shared

// 返回的配置结构：
// {
//   react: {
//     lib: () => React,
//     version: "19.1.1",
//     scope: "default",
//     shareConfig: {
//       singleton: true,
//       requiredVersion: "^19.1.1"
//     }
//   },
//   "react-dom": {
//     lib: () => ReactDOM,
//     version: "19.1.1", 
//     scope: "default",
//     shareConfig: {
//       singleton: true,
//       requiredVersion: "^19.1.1"
//     }
//   }
// }

// 在 Webpack 配置中使用
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      shared: reactAdapter.shared
    })
  ]
}
```

### 默认实例

包提供了一个预配置的默认实例：

```typescript
import { reactAdapter } from '@empjs/adapter-react'

// 直接使用默认实例
const WrappedComponent = reactAdapter.adapter(MyComponent)
```

## License

MIT