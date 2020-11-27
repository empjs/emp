# EMP ESBUILD Config Plugin

## Install 
+ `yarn add @efox/emp-swc -D` 
+ `emp-config.js` conf:
```javascript
const withFrameWorkPlugin = require('@efox/emp-swc')
module.exports = withFrameWorkPlugin(({config, env, empEnv}) => {
  // your options here
})
```