# EMP Bridge Vue3

`@empjs/bridge-vue3` 将 Vue 3 组件包装成统一的 DOM Bridge Provider，也支持在 Vue 3 宿主中消费 React、Vue 2 或 Vue 3 Provider。

## 安装

```sh
pnpm add @empjs/bridge-vue3
# React 宿主还需要对应的消费端
pnpm add @empjs/bridge-react
```

## Vue 3 生产者

使用组件所属的 Vue 运行时，不能用宿主的框架版本代替：

```ts
import * as Vue from 'vue'
import {createBridgeComponent} from '@empjs/bridge-vue3'

const Counter = Vue.defineComponent({
  props: {
    message: String,
    onChange: Function,
  },
  setup(props) {
    const count = Vue.ref(0)
    return () => Vue.h('button', {
      onClick() {
        count.value++
        props.onChange?.(count.value)
      },
    }, `Vue ${Vue.version} · ${props.message} · ${count.value}`)
  },
})

export default createBridgeComponent(Counter, {
  Vue,
  // plugin(app) { app.use(pinia) },
})
```

生产者可以通过 Module Federation 暴露这个模块，也可以由本地异步模块提供。其默认导出为 Provider 工厂，调用后得到 `render` / `destroy`。

## React 消费者

React 宿主使用 `@empjs/bridge-react` 的消费端，生产者仍使用 Vue 3 的运行时：

```tsx
import React from 'react'
import {createRemoteAppComponent} from '@empjs/bridge-react'

const VueCounter = createRemoteAppComponent(
  () => import('remote-app/Bridge'),
  {React},
  {onError: error => console.error(error)},
)

export function App() {
  return <VueCounter
    message="来自 React 宿主"
    onChange={(value: number) => console.log('Vue 计数', value)}
  />
}
```

## Vue 3 消费者

Vue 3 宿主使用本包的消费端。下例可以加载任何实现相同 Provider 协议的框架组件：

```ts
import * as Vue from 'vue'
import {createRemoteAppComponent} from '@empjs/bridge-vue3'

const Remote = createRemoteAppComponent(
  () => import('remote-app/Bridge'),
  {Vue},
  {onError: error => console.error(error)},
)

export default Vue.defineComponent({
  setup() {
    const message = Vue.ref('来自 Vue 3 宿主')
    return () => Vue.h(Remote, {
      message: message.value,
      onChange: (value: number) => console.log('远端计数', value),
    })
  },
})
```

## API

```ts
interface BridgeProviderReturn {
  render(dom: HTMLElement, props?: Record<string, any>): void
  destroy(dom: HTMLElement): void
}

type BridgeProvider = () => BridgeProviderReturn

type ComponentProvider =
  | BridgeProvider
  | (() => Promise<{default: BridgeProvider}>)

function createBridgeComponent(
  Component: any,
  options: {Vue: any; plugin?: (app: any) => void},
): BridgeProvider

function createRemoteAppComponent(
  component: ComponentProvider,
  vueOptions: {Vue: any},
  options?: {onError?: (error: Error) => void},
): any
```

`render` 在同一容器中保留组件实例，更新 Props 并移除本次没有传入的键；每个容器拥有独立实例。`destroy` 卸载 Vue 应用，多次销毁同一容器不会重复卸载。

消费端将任意属性和函数回调传给 Provider，并使用宿主 Vue 的真实生命周期；异步模块在卸载后返回时不会重新挂载。

## 跨框架通信约定

- 通过普通 Props 和函数回调通信。例如 `onChange` 是回调属性，不会自动转换为 Vue 的 `$emit`。
- Context、provide/inject 和框架 VNode 留在所属运行时内。Vuex / Pinia 等插件通过生产者的 `plugin` 初始化。
- 读取 `Vue.version` 展示真实组件版本；CDN 包版本或 `package.json` 中的依赖范围不能替代运行时版本。
