# @empjs/plugin-react

## 安装 

```
pnpm add @empjs/plugin-react -D
```

## 使用 

```js
import pluginReact from '@empjs/plugin-react'
import {defineConfig} from '@empjs/cli'

export default defineConfig(({mode, env}) => {
  return {
    plugins: [pluginReact()],
  }
})
```

## React Compiler

`@empjs/plugin-react` 支持通过 Rspack 2.1 的 `builtin:swc-loader` 开启 React Compiler，但默认不自动开启。Agent 可以建议开启，最终必须由项目配置显式写入。

React 19 项目：

```ts
import pluginReact from '@empjs/plugin-react'
import {defineConfig} from '@empjs/cli'

export default defineConfig({
  plugins: [
    pluginReact({
      reactCompiler: true,
    }),
  ],
})
```

React 17 / 18 项目需要安装 `react-compiler-runtime`，并设置目标版本：

```ts
import pluginReact from '@empjs/plugin-react'
import {defineConfig} from '@empjs/cli'

export default defineConfig({
  plugins: [
    pluginReact({
      reactCompiler: {
        target: '18',
        compilationMode: 'annotation',
      },
    }),
  ],
})
```
