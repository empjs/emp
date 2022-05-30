# EMP Compile SWC
使用 swc 代替 babel 实现模块编译
## 安装
```sh
npm i @efox/emp-compile-swc -D
# or
pnpm add @efox/emp-compile-swc -D
```

## 配置
> emp-config.js
```js
const {defineConfig} = require('@efox/emp')
const compile = require('@efox/emp-compile-swc')
module.exports = defineConfig({
  compile,
})

```
