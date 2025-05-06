# @empjs/plugin-vue3 
## 安装 
```
pnpm add @empjs/plugin-vue3 -D
```
## 使用 
```js
import pluginVue from '@empjs/plugin-vue3'
import {defineConfig} from '@empjs/cli'
export default defineConfig(({mode, env}) => {
  return {
    plugins: [pluginVue()],
  }
})

```