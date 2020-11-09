# EMP Vue v2 Config Plugin

## Install 
+ `yarn add @efox/emp-vue2 -D` 
+ `emp-config.js` conf:
```javascript
const withVue2 = require('@efox/emp-vue2')
module.exports = withVue2(({config, env, empEnv}) => {
  // your options here
})
```