# EMP Vue v3 Config Plugin

## Install 
+ `yarn add @efox/emp-vue3 -D` 
+ `emp-config.js` conf:
```javascript
const withFrameWorkPlugin = require('@efox/emp-vue3')
module.exports = withFrameWorkPlugin(({config, env, empEnv}) => {
  // your options here
})
```