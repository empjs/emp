# @empjs/plugin-vue2
## 安装 
```
pnpm add @empjs/plugin-vue2 -D
```
## 使用 
```js
import Vue from '@empjs/plugin-vue2'
import {defineConfig} from '@empjs/cli'
export default defineConfig(({mode, env}) => {
  return {
    plugins: [Vue()],
  }
})

```