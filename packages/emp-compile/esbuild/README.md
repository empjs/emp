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

## Babel Compile
+ dev 13125ms & 2989ms
+ build 20365ms &  5819ms

## ESBUILD Compile 
+ dev 7188ms & 2934ms
+ build 9417ms &  5590ms