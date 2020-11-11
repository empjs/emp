# EMP Svetle Config Plugin

## Install 
+ `yarn add @efox/emp-svetle -D` 
+ `emp-config.js` conf:
```javascript
const withFrameWorkPlugin = require('@efox/emp-svetle')
module.exports = withFrameWorkPlugin(({config, env, empEnv}) => {
  // your options here
})
```