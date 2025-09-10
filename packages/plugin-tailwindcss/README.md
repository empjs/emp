# @empjs/plugin-tailwindcss
> base tailwindcss v4
## 安装 
```
pnpm add @empjs/plugin-tailwindcss-D
pnpm add tailwindcss // 需要在落地项目安装、否则引入css会报错、暂时没找到解决方案
```
## 使用 
```js
import pluginTailwindcss from '@empjs/plugin-tailwindcss'
import {defineConfig} from '@empjs/cli'
export default defineConfig(({mode, env}) => {
  return {
    plugins: [pluginTailwindcss()],
  }
})

```

## 配置
> tailwindcss 已经集成都插件、只需直接引入即可
```js
import type {Config} from '@empjs/plugin-tailwindcss/tailwindcss'
export default {
  important: '.tw-host',
} satisfies Config
```
