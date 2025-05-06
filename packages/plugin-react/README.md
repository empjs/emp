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