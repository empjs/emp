# @empjs/plugin-stylus
## 安装 
```
pnpm add @empjs/plugin-stylus -D
```
## 使用 
```js
import pluginStylus from '@empjs/plugin-stylus'
import {defineConfig} from '@empjs/cli'
export default defineConfig(({mode, env}) => {
  return {
    plugins: [pluginStylus()],
  }
})

```