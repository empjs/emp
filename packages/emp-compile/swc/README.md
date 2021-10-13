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
## Babel Compile
+ dev 13125ms
+ build 20365ms & build with cache 5819ms

## SWC Compile 
+ dev
+ build