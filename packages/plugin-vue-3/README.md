# EMP Vue3 Plugin
## 安装
```sh
npm i @efox/plugin-vue-3 -D
# or
pnpm add @efox/plugin-vue-3 -D
```

## 配置
> emp-config.js
```js
const {defineConfig} = require('@efox/emp')
const vue3 = require('@efox/plugin-vue-3')
module.exports = defineConfig({
  plugins:[vue3],
})

```
