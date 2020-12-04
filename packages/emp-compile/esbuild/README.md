# EMP ESBUILD Config Plugin

## Install 
+ `yarn add @efox/emp-esbuild -D` 
+ `emp-config.js` conf:
```javascript
const withFrameWorkPlugin = require('@efox/emp-esbuild')
module.exports = withFrameWorkPlugin(({config, env, empEnv}) => {
  // your options here
})
```

## Feature
> FOR REACT
+ MODULE FEDERATION
+ SVG
+ SVGA
+ HMR
+ LIVE RELOAD 
+ ANTD `babel-plugin-import` [about](https://github.com/ant-design/babel-plugin-import) `:TODO`