# EMP 框架跨框架组件集成教程：React 17 调用 React 18、Vue 2 和 Vue 3 组件

本教程将指导您如何在 EMP 微前端框架中实现跨框架组件集成，特别是如何在 React 17 应用中使用 React 18、Vue 2 和 Vue 3 组件。

## 1. 项目设置和依赖安装

首先，我们需要设置一个基于 EMP 框架的 React 17 项目，并安装必要的依赖。

### 创建项目

使用 EMP CLI 创建一个新项目：

```bash
# 安装 EMP CLI
npm install -g @empjs/cli

# 创建项目
emp create my-cross-framework-app
cd my-cross-framework-app
```

### 安装必要依赖

在 `package.json` 中添加以下依赖：

```json
{
  "dependencies": {
    "@empjs/adapter-react": "^latest",
    "@empjs/bridge-react": "^latest",
    "@empjs/bridge-vue2": "^latest",
    "@empjs/bridge-vue3": "^latest",
    "@empjs/share": "^latest",
    "react": "17",
    "react-dom": "17"
  },
  "devDependencies": {
    "@empjs/cli": "^latest",
    "@empjs/plugin-react": "^latest",
    "@types/react": "17",
    "@types/react-dom": "17"
  }
}
```

然后运行：

```bash
npm install
# 或
yarn
# 或
pnpm install
```

## 2. 配置 EMP 项目

创建或修改 `emp.config.ts` 文件，配置远程应用和运行时适配器：

```typescript
import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {pluginRspackEmpShare} from '@empjs/share'

export default defineConfig(store => {
  const ip = store.server.ip
  const port = 7702
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: 'myApp',
        exposes: {},
        experiments: {
          asyncStartup: true,
        },
        remotes: {
          // React 18 远程应用
          react18App: `react18App@http://${ip}:7701/emp.json`,
          // Vue 3 远程应用
          vue3App: `vue3App@http://${ip}:9901/emp.json`,
          // Vue 2 远程应用
          vue2App: `vue2App@http://${ip}:9902/emp.json`,
        },
        empRuntime: {
          framework: {
            global: 'EMP_ADAPTER_REACT',
            libs: [
              // React 18 适配器
              `https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.${store.mode}.umd.js`,
              // Vue 3 + Router + Pinia 适配器
              `https://unpkg.com/@empjs/cdn-vue-router-pinia@3.5.0/dist/vueRouter.${store.mode}.umd.js`,
              // Vue 2 适配器
              `https://unpkg.com/@empjs/cdn-vue@0.2.1/dist/vueRouter.${store.mode}.umd.js`,
            ],
          },
          runtime: {
            lib: `https://unpkg.com/@empjs/share@3.10.1/output/sdk.js`,
          },
        },
      }),
    ],
    server: {
      port,
      open: false,
    },
  }
})
```

## 3. 创建适配器组件

### React 18 适配器

创建 `src/adapter/React18.ts` 文件：

```typescript
import {createBridgeComponent, createRemoteAppComponent} from '@empjs/bridge-react'
import React18App from 'react18App/App'
// React 17 组件
import React from 'react'

// 从全局对象获取 React 18 适配器
const {EMP_ADAPTER_REACT} = window as any

// 创建桥接组件
const BridgeComponent = createBridgeComponent(React18App, EMP_ADAPTER_REACT)

// 导出可在 React 17 中使用的 React 18 组件
export const Remote18App = createRemoteAppComponent(BridgeComponent, {React})
```

### Vue 3 适配器

创建 `src/adapter/Vue3.ts` 文件：

```typescript
import {createRemoteAppComponent} from '@empjs/bridge-react'
import {createBridgeComponent} from '@empjs/bridge-vue3'
// React 17 组件
import React from 'react'
import Vue3App from 'vue3App/Info'

// 从全局对象获取 Vue 3 适配器
const {EMP_ADAPTER_VUE} = window as any
const {Vue, Pinia} = EMP_ADAPTER_VUE

// 创建桥接组件
const BridgeComponent = createBridgeComponent(Vue3App, {
  Vue,
  plugin: app => {
    const pinia = Pinia.createPinia()
    app.use(pinia)
  },
})

// 导出可在 React 17 中使用的 Vue 3 组件
export const RemoteVue3App = createRemoteAppComponent(BridgeComponent, {React})
```

### Vue 2 适配器

创建 `src/adapter/Vue2.ts` 文件：

```typescript
import {createRemoteAppComponent} from '@empjs/bridge-react'
import {createBridgeComponent} from '@empjs/bridge-vue2'
// React 17 组件
import React from 'react'
import Vue2App from 'vue2App/Info'

// 从全局对象获取 Vue 2 适配器
const {EMP_ADAPTER_VUE_v2} = window as any
const {Vue} = EMP_ADAPTER_VUE_v2

// 创建桥接组件
const BridgeComponent = createBridgeComponent(Vue2App, {Vue})

// 导出可在 React 17 中使用的 Vue 2 组件
export const RemoteVue2App = createRemoteAppComponent(BridgeComponent, {React})
```

## 4. 在主应用中使用远程组件

创建或修改 `src/App.tsx` 文件：

```tsx
import React from 'react'
import {Remote18App} from './adapter/React18'
import {RemoteVue2App} from './adapter/Vue2'
import {RemoteVue3App} from './adapter/Vue3'
import {Box, ReactInfo} from './components/Info'

const App = () => (
  <div>
    {/* 使用 Vue 2 组件 */}
    <Box>
      <h1>Vue 2 Remote App</h1>
      <RemoteVue2App name="vue2 in React" />
    </Box>
    
    <ReactInfo desc="ReactInfo">
      {/* 使用 React 18 组件 */}
      <Remote18App>
        <ReactInfo desc="ReactInfo in Remote18App">
          <Remote18App>
            <ReactInfo desc="last component " />
          </Remote18App>
        </ReactInfo>
      </Remote18App>
      
      {/* 使用 Vue 3 组件 */}
      <Box>
        <h2>Vue3 Component</h2>
        <RemoteVue3App name="vue3 in React 16" />
      </Box>
      
      {/* 在 React 18 组件中嵌套 Vue 3 组件 */}
      <Remote18App>
        <RemoteVue3App name="vue3 in React 18" />
      </Remote18App>
    </ReactInfo>
  </div>
)

export default App
```

## 5. 添加热更新支持

为了支持 Vue 2 组件的热更新，需要在 `src/bootstrap.tsx` 中添加：

```tsx
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(React.createElement(App), document.getElementById('emp-root'))

// 只在热更新时加载 vue-2-hmr 模块
if ((module as any).hot) {
  console.log('vue-2-hmr', module)
  import('src/adapter/vue-2-hmr')
}
```

创建 `src/adapter/vue-2-hmr.ts` 文件：

```typescript
// 预加载 Vue 2 组件以支持热更新
import 'vue2App/Info'
```

## 6. 工作原理解析

### React 17 调用 React 18 的机制

1. **桥接层**：使用 `@empjs/bridge-react` 创建桥接组件，它负责处理不同 React 版本之间的通信。

2. **适配器注入**：通过全局对象 `EMP_ADAPTER_REACT` 注入 React 18 的实例，这是由 EMP 运行时提供的。

3. **组件包装**：`createRemoteAppComponent` 函数将远程 React 18 组件包装成可在 React 17 中使用的组件。

### React 与 Vue 集成的机制

1. **Vue 桥接**：使用 `@empjs/bridge-vue2` 或 `@empjs/bridge-vue3` 创建 Vue 桥接组件。

2. **适配器注入**：通过全局对象 `EMP_ADAPTER_VUE` 或 `EMP_ADAPTER_VUE_v2` 注入 Vue 实例。

3. **React 包装**：使用 `createRemoteAppComponent` 将 Vue 桥接组件包装成 React 组件。

4. **插件支持**：Vue 3 适配器支持通过 `plugin` 选项添加 Pinia 等插件。

## 7. 运行项目

启动开发服务器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

访问 `http://localhost:7702` 查看应用。

## 8. 最佳实践

1. **错误边界**：使用 React 的 ErrorBoundary 组件捕获远程组件加载失败的错误。

2. **懒加载**：对于不是立即需要的远程组件，考虑使用 React.lazy 和 Suspense 进行懒加载。

3. **版本管理**：确保远程应用的版本与适配器版本兼容。

4. **性能优化**：避免过多的跨框架组件嵌套，这可能导致性能问题。

5. **状态管理**：跨框架组件之间的状态共享应通过 props 传递，避免使用框架特定的状态管理工具。

## 总结

通过 EMP 框架的适配器和桥接工具，我们可以在 React 17 应用中无缝集成 React 18、Vue 2 和 Vue 3 组件。这种方法使得不同框架和版本的组件可以共存，为微前端架构提供了强大的支持。

这种集成方式特别适用于以下场景：
- 逐步升级大型应用的框架版本
- 在现有项目中复用不同框架的组件
- 构建由多个团队维护的微前端应用

通过遵循本教程，您可以构建一个跨框架、跨版本的现代前端应用，充分利用不同框架的优势。