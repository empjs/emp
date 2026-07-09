# 框架插件

## React

```ts
import pluginReact from '@empjs/plugin-react'

export default defineConfig({
  plugins: [pluginReact()],
})
```

React 插件负责 React Refresh、JSX 转换和常见 React 构建默认值。

## Vue 2

```ts
import pluginVue2 from '@empjs/plugin-vue2'

export default defineConfig({
  plugins: [pluginVue2()],
})
```

Vue 2 插件用于存量 Vue 2 remote / host 场景。

## Vue 3

```ts
import pluginVue3 from '@empjs/plugin-vue3'

export default defineConfig({
  plugins: [pluginVue3()],
})
```

Vue 3 插件覆盖 Vue 3、Ant Design Vue、Pinia 等示例验证链路。
