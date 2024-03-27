# @empjs/plugin-vue3 
## 使用 
```js
import Vue from '@empjs/plugin-vue3'
import {defineConfig} from '@empjs/cli'
export default defineConfig(({mode, env}) => {
  return {
    plugins: [Vue()],
  }
})

```