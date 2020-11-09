# EMP Preact Config Plugin

## Install 
+ `yarn add @efox/emp-preact -D` 
+ `emp-config.js` conf:
```javascript
const withFrameWorkPlugin = require('@efox/emp-preact')
module.exports = withFrameWorkPlugin(({config, env, empEnv}) => {
  // your options here
})
```