# EMP 多框架适配器演示

该项目演示了如何使用 EMP 的适配器将来自不同框架（例如 React 18、Vue 3）的组件无缝集成到单个 React 16 应用程序中。

## 工作原理

该解决方案的核心在于 `@empjs/bridge-react` 和 `@empjs/bridge-vue3` 包，它们在主机应用程序和远程组件之间创建了一座桥梁。这允许不同框架版本之间甚至完全不同的框架之间的互操作性。

### 关键概念

*   **EMP (Empower Module Federation):** 一种模块联邦解决方案，允许您在多个应用程序之间共享代码和依赖项。
*   **适配器 (Adapter):** 一段代码，允许不同的框架相互通信。
*   **桥接 (Bridge):** 一个包装远程组件并使其与主机应用程序的框架兼容的组件。

## 项目结构

```
/src
├── App.tsx                 # 主应用程序组件
├── adapter                 # 不同框架的适配器
│   ├── React18.ts          # React 18 的适配器
│   └── Vue3.ts             # Vue 3 的适配器
├── components              # 本地 React 组件
│   ├── Info.module.scss
│   ├── Info.tsx
│   └── app-adapter.tsx
├── global.d.ts
└── index.tsx
```

## 实现细节

### 1. EMP 运行时配置 (`emp.config.ts`)

为了让框架适配器正常工作，关键在于 `emp.config.ts` 中的 `empRuntime` 配置。此配置负责在 `window` 对象上注入必要的框架库和适配器。

```typescript
// emp.config.ts
export default defineConfig(store => {
  return {
    plugins: [
      pluginRspackEmpShare({
        // ...
        empRuntime: {
          framework: {
            global: 'EMP_ADAPTER_REACT', // 定义全局变量名
            libs: [ // 需要注入的框架库
              `https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.${store.mode}.umd.js`,
              `https://unpkg.com/@empjs/cdn-vue-router-pinia@3.5.0/dist/vueRouter.${store.mode}.umd.js`,
            ],
          },
          runtime: {
            lib: `https://unpkg.com/@empjs/share@3.10.1/output/sdk.js`,
          },
        },
      }),
    ],
    // ...
  }
})
```

- **`empRuntime.framework.global`**: 定义一个全局变量（如此处的 `EMP_ADAPTER_REACT`），它将作为一个命名空间，挂载所有通过 `libs` 加载的库。
- **`empRuntime.framework.libs`**: 一个包含 CDN URL 的数组。EMP 会在运行时动态加载这些脚本，并将其导出内容附加到 `global` 对象上。例如，`@empjs/cdn-react` 会导出 `React`、`ReactDOM` 和 `createRoot`，这些都会被挂载到 `window.EMP_ADAPTER_REACT` 上。

通过这种方式，主机应用可以从 `window` 对象上获取远程组件所需的特定版本的框架实例，从而实现多框架/多版本共存。

### 2. 在 React 16 中使用 React 18

`src/adapter/React18.ts` 文件展示了如何为 React 18 组件创建桥接：

```typescript
import {createBridgeComponent, createRemoteAppComponent} from '@empjs/bridge-react'
import AhApp from 'ah/App'
// React 16 组件
import React from 'react'

const {EMP_ADAPTER_REACT} = window as any
//
const BridgeComponent = createBridgeComponent(AhApp, EMP_ADAPTER_REACT)
export const Remote18App = createRemoteAppComponent(BridgeComponent, {React})
```

*   `createBridgeComponent`: 这个函数来自 `@empjs/bridge-react`，它接收两个参数：
    1.  **远程组件** (`AhApp`): 这是需要动态加载和渲染的组件。
    2.  **React 适配器** (`EMP_ADAPTER_REACT`): 这是一个包含 `React`, `ReactDOM`, 和 `createRoot` 的对象，由 `emp.config.ts` 中 `empRuntime.framework` 配置注入到 `window` 对象中。它为桥接提供了远程组件所需的 React 运行时环境，确保组件使用其自身的 React 版本进行渲染，而不是主机的版本。
*   `createRemoteAppComponent`: 这个函数接收桥接后的组件和主机的 React 实例，以创建一个可以在 React 16 应用程序中使用的组件。

### 3. 在 React 16 中使用 Vue 3

同样，`src/adapter/Vue3.ts` 演示了如何集成 Vue 3 组件：

```typescript
import {createRemoteAppComponent} from '@empjs/bridge-react'
import {createBridgeComponent} from '@empjs/bridge-vue3'
import v3App from 'v3h/Info'
// React 16 组件
import React from 'react'


const {EMP_ADAPTER_VUE} = window as any
const {Vue, Pinia} = EMP_ADAPTER_VUE
//
const BridgeComponent = createBridgeComponent(v3App, {
  Vue,
  plugin: app => {
    const pinia = Pinia.createPinia()
    app.use(pinia)
  },
})
export const RemoteVue3App = createRemoteAppComponent(BridgeComponent, {React})
```

*   `@empjs/bridge-vue3`: 这个包提供了用于 Vue 的 `createBridgeComponent` 函数。
*   **Vue 实例和插件:** Vue 实例和任何插件（如 Pinia）都会传递给桥接，以确保远程组件正常运行。
*   **`plugin` 选项**: `createBridgeComponent` 的第二个参数可以包含一个 `plugin` 字段。这是一个回调函数，它会在 Vue 应用实例创建后立即执行。这对于安装 Vue 插件（如 `Pinia` 用于状态管理或 `Vue Router` 用于路由）至关重要。如示例所示，我们创建了一个 `pinia` 实例并将其提供给 Vue 应用，以确保远程 Vue 组件可以访问共享的状态存储。

### 4. 使用组件

最后，在 `src/App.tsx` 中，远程组件可以像任何其他 React 组件一样使用：

```tsx
import React from 'react'
import {Box, React16Info} from './components/Info'
import {Remote18App} from './adapter/React18'
import {RemoteVue3App} from './adapter/Vue3'

const App = () => (
  <div>
    <React16Info desc="React16Info">
      <Remote18App>
        <React16Info desc="React16Info in Remote18App">
          <Remote18App>
            <React16Info desc="last component " />
          </Remote18App>
        </React16Info>
      </Remote18App>
      <Box>
        <h2>Vue3 Component</h2>
        <RemoteVue3App name="vue3 in React 16" />
      </Box>
      <Remote18App>
      <RemoteVue3App name="vue3 in React 18" />
      </Remote18App>
    </React16Info>
  </div>
)

export default App
```

## 扩展到其他框架

同样的原则可以应用于其他框架，如 Angular、Svelte，甚至是不同版本的 Vue。关键是为您要集成的每个框架提供一个适配器和桥接。

一般步骤如下：

1.  **为目标框架创建一个桥接包**（例如，`@empjs/bridge-svelte`）。
2.  **在远程应用程序的 `window` 对象上公开框架的适配器**。
3.  **在主机应用程序中创建一个桥接组件**，传递远程组件和适配器。
4.  **包装桥接组件**，使其与主机框架兼容。

EMP 的这一强大功能为构建微前端架构提供了令人难以置信的灵活性，使团队能够使用他们喜欢的技术，同时仍然创造出有凝聚力的用户体验。

### 详细示例：集成 Svelte 组件

要理解其工作原理，我们以集成为 Svelte 框架为例。任何框架的桥接都需要实现 `@empjs/bridge-react` 中定义的 `BridgeProviderReturn` 接口：

```typescript
// 来自 @empjs/bridge-react/src/index.ts
export interface BridgeProviderReturn {
  render: (dom: HTMLElement, props?: Record<string, any>) => void
  destroy: (dom: HTMLElement) => void
}
```

- `render`: 负责将组件渲染到指定的 DOM 元素中。
- `destroy`: 负责卸载并销毁组件实例，以防止内存泄漏。

#### 1. 创建 Svelte 桥接 (例如 `@empjs/bridge-svelte`)

我们需要创建一个函数，它接收一个 Svelte 组件，并返回一个符合 `BridgeProviderReturn` 接口的对象。

```typescript
// @empjs/bridge-svelte/src/index.ts (设想中的文件)

import {BridgeProviderReturn} from '@empjs/bridge-react' // 从 react bridge 中获取接口

// Svelte 组件实例的类型定义
type SvelteComponent = {
  new (options: {target: HTMLElement; props?: Record<string, any>}): {
    $destroy: () => void
  }
}

// 用于存储 Svelte 组件实例，以便后续销毁
const svelteInstances = new Map<HTMLElement, { $destroy: () => void }>()

export const createSvelteBridge = (Component: SvelteComponent): BridgeProviderReturn => {
  return {
    render: (dom, props) => {
      // 渲染 Svelte 组件到指定的 dom 节点
      const instance = new Component({target: dom, props})
      svelteInstances.set(dom, instance)
    },
    destroy: dom => {
      // 销毁组件实例并从 Map 中移除
      if (svelteInstances.has(dom)) {
        svelteInstances.get(dom)?.$destroy()
        svelteInstances.delete(dom)
      }
    },
  }
}
```

#### 2. 在 React 应用中使用 Svelte 桥接

在您的 `adapter-app` 项目中，您可以这样使用新的 Svelte 桥接：

```typescript
// /projects/adapter-app/src/adapter/Svelte.ts (示例文件)

import {createBridgeComponent, createRemoteAppComponent} from '@empjs/bridge-react'
import {createSvelteBridge} from '@empjs/bridge-svelte' // 导入刚刚创建的 svelte 桥接
import RemoteSvelteComponent from 'svelte-remote/Component' // 从远程应用导入 Svelte 组件
import React from 'react'

// 1. 使用 Svelte 桥接函数创建一个 Provider
const svelteProvider = createSvelteBridge(RemoteSvelteComponent)

// 2. 使用 @empjs/bridge-react 的 createBridgeComponent 创建一个通用的桥接组件
const BridgeComponent = createBridgeComponent(svelteProvider)

// 3. 最后，创建可在 React 中直接使用的组件
export const RemoteSvelteApp = createRemoteAppComponent(BridgeComponent, {React})
```

现在, `RemoteSvelteApp` 就可以像其他任何 React 组件一样在您的应用中使用了。