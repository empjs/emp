# EMP SWC Config Plugin

## Install 
+ `yarn add @efox/emp-swc -D` 
+ `emp-config.js` conf:
```javascript
const withSWC = require('@efox/emp-swc')
module.exports = withSWC(({config, env, empEnv}) => {
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