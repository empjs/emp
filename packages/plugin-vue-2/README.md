# EMP Vue2 Plugin
> vue2 支持 swc实现编译 (jsx除外)
## 安装
```sh
npm i @efox/plugin-vue-2 -D
# or
pnpm add @efox/plugin-vue-2 -D
```

## 配置
> emp-config.js
```js
const {defineConfig} = require('@efox/emp')
const vue = require('@efox/plugin-vue-2')
module.exports = defineConfig({
  plugins:[vue],
})

```
