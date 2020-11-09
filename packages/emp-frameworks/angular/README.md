# EMP Angular Config Plugin

## Install 
+ `yarn add @efox/emp-angular -D` 
+ `emp-config.js` conf:
```javascript
const withFrameWorkPlugin = require('@efox/emp-angular')
module.exports = withFrameWorkPlugin(({config, env, empEnv}) => {
  // your options here
})
```