# EMP Vue v3 swc Config Plugin

## Install 
+ `yarn add @efox/emp-vue3-swc -D` 
+ `emp-config.js` conf:
```javascript
const withFrameWorkPlugin = require('@efox/emp-vue3-swc')
module.exports = withFrameWorkPlugin(({config, env, empEnv}) => {
  // your options here
})
```