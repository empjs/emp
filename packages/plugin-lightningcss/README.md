# @empjs/plugin-lightningcss

## 安装 
```
pnpm add @empjs/plugin-lightningcss -D
```

## 配置 emp-config.js 
```js
import {defineConfig} from '@empjs/cli'
import lightningcssPlugin, {postcss} from '@empjs/plugin-lightningcss'
const transformUnitFomat = 'vw'
export default defineConfig(store => {
  const visitor = transformUnitFomat==='rem' ? postcss.px_to_rem() : postcss.px_to_viewport({})
  return {
    plugins:[
        lightningcssPlugin({
        transform: {
          visitor,
        },
      })
    ],
  }
})

```
