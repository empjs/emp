# EMP JSON Config Plugin

## Install

- `yarn add @efox/emp-config-json -D`
- `emp-config.js` conf:

```javascript
const withEMPJSON = require('@efox/emp-config-json')
module.exports = withEMPJSON(({config, env, empEnv}) => {
  // your options here
})
```
```
