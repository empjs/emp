# EMP ESBUILD Config Plugin

## Install 
+ `yarn add @efox/emp-swc -D` 
+ `emp-config.js` conf:
```javascript
const withESM = require('@efox/emp-esm')
module.exports = withESM(({config, env, empEnv}) => {
  // your options here
})
```