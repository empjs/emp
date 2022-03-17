# 插件
:::tip 主要项
EMP v2 plugin 结合 webpack chain 提供对 webpack自定义配置，详细类型 [[点击了解]](https://github.com/efoxTeam/emp/blob/26c89aa3fc5494f274a714b6b09844b66b5e1237/packages/emp/src/config/plugins.ts#L9)
:::

## 官方插件

### [@efox/plugin-vue-2](https://github.com/efoxTeam/emp/tree/next/packages/plugin-vue-2)
+ 提供 vue 2 编译支持
```js
const {defineConfig} = require('@efox/emp')
const vue = require('@efox/plugin-vue-2')
module.exports = defineConfig({
  plugins: [vue],
})
```

### [@efox/plugin-babel-react](https://github.com/efoxTeam/emp/tree/next/packages/plugin-babel-react)
+ 提供 react babel 编译支持
```js
const {defineConfig} = require('@efox/emp')
const babelReact = require('@efox/plugin-babel-react')
module.exports = defineConfig({
  plugins: [babelReact],
})
```

## 规范
### [@efox/eslint-config-react](https://github.com/efoxTeam/emp/tree/next/packages/eslint-config-react)
+ 提供 react typescript eslint 支持
#### 安装
```
pnpm add @efox/eslint-config-react
```
#### 配置
> 根目录创建 `.eslintrc.js`
```js
module.exports = {
  extends: ['@efox/eslint-config-react'],
}
```

### [@efox/eslint-config-vue](https://github.com/efoxTeam/emp/tree/next/packages/eslint-config-vue)
+ 提供 vue2 eslint 支持
#### 安装
```
pnpm add @efox/eslint-config-vue
```
#### 配置
> 根目录创建 `.eslintrc.js`
```js
module.exports = {
  extends: ['@efox/eslint-config-vue'],
}
```
