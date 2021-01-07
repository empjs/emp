# EMP JSON Config Plugin

## Install

- `yarn add @efox/emp-gui-config -D`
- `emp-config.js` conf:

```javascript
const withGUIEMP = require('@efox/emp-gui-config')
module.exports = withGUIEMP(({config, env, empEnv}) => {
  // your options here
})
```
```
