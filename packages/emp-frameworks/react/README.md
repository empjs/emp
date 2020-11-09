# EMP React Config Plugin

## Install 
+ `yarn add @efox/emp-react -D` 
+ `emp-config.js` conf:
```javascript
const withFrameWorkPlugin = require('@efox/emp-react')
module.exports = withFrameWorkPlugin(({config, env, empEnv}) => {
  // your options here
})
```