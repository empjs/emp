# EMP JSON Config Plugin DEMO 

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

## 将会读取项目根目录下的 emp.json 到 emp-config.js