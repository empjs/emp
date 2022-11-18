# 配置
## 配置文件
### 解析
EMP 会自动解析当前项目根目录的 `emp-config.js` 文件
```js

module.exports = {}
```
### 提示
```js
/**
 * @type {import('@efox/emp').EMPConfigExport}
 */
module.exports = {}

```
或者使用 `defineConfig`
```js
const {defineConfig} = require('@efox/emp')
module.exports = defineConfig({})

```
### 函数式配置
```js
// mode 为webpack mode变量 development production
// env 为 emp serve --env dev 的 dev
module.exports = defineConfig(({mode,env})=>{
  return {}
})
```

### 异步函数
```js
// mode 为webpack mode变量 development production
// env 为 emp serve --env dev 的 dev
module.exports = defineConfig(async({mode,env})=>{
  return {}
})
```
