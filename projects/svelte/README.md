# 在EMP中使用 svelte 框架Demo 

## 使用方式

安装`@efox/emp-svetle`

```
yarn add @efox/emp-svetle -D
```

然后在`emp-config.js`引用`@efox/emp-svetle`

```javascript
const withSvetle = require('@efox/emp-svetle')

module.exports = withSvetle(({config, env, empEnv}) => {
  // your options here
})
```

## 启动
```javascript
yarn && yarn start
```