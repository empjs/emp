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
