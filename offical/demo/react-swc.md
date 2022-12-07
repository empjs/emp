# ⚡️ SWC 编译 - 替代 Babel
## 安装
:::tip 提示
+ @efox/emp-compile-swc `1.1.2`后屏蔽 `babel-plugin-import` 支持，可以 import 样式解决
+ antd 5 切换到 css in js 后不再需要 `babel-plugin-import`
:::
```shell
pnpm i @efox/emp @efox/emp-compile-swc -D
```
## 配置
### emp-config.js
```js
const {defineConfig} = require('@efox/emp')
const compile = require('@efox/emp-compile-swc')//使用 swc进行 js、ts 编译
module.exports = defineConfig(() => {
  return {
    compile,
    build: {
      sourcemap: true,
      minify: 'swc',//使用 swc进行压缩，效果明显
    },
  }
})

```
### package.json
```json
...
  "scripts": {
    "dev": "emp dev",
    "build": "emp build",
    "start": "emp serve"
  },
...
```

## 问题QA
> 从目前观察 swc已经解决了 sourcemap 显示、代码压缩、兼容等等问题 具体包括:
+ class 赋值问题 如 [link](https://github.com/efoxTeam/emp/blob/main/projects/swc-demo/src/App.tsx#L7)
+ js、ts 压缩报错问题
+ babel 转译不一致问题

更多问题 环境提交 [PR](https://github.com/efoxTeam/emp/tree/main/projects/swc-demo/src)

## 导读
+ [swc 官网](https://swc.rs/)
+ [JS minification benchmarks](https://github.com/privatenumber/minification-benchmarks)
+ [swc demo](https://github.com/efoxTeam/emp/tree/main/projects/swc-demo)
