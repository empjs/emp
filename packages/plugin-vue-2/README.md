# @empjs/plugin-vue2 
## 使用
```js
import {defineConfig} from '@empjs/cli'
import vue from '@empjs/plugin-vue2'
export default defineConfig(store => {
  return {
    plugins: [vue()],
    html: {title: 'EMP3 vue2 base'},
    server: {port: 9001},
    appEntry: 'main.js',
  }
})

```
## 注意 
+ 目前 vue2 已经被弃置、本项目支持最常用的开发状态，不再推后续的维护工作