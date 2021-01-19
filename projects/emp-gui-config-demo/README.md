# EMP JSON Config Plugin DEMO 

## 安装

- `yarn add @efox/emp-gui-config -D`
- `emp-config.js` conf:

```javascript
const withGUIEMP = require('@efox/emp-gui-config')
module.exports = withGUIEMP(({config, env, empEnv}) => {
  // your options here
})
```

## 将会读取项目根目录下的 emp.json 到 emp-config.js
例如:
```json
{
  "name": "empReact",
  "remotes": {
  },
  "exposes": {
    "./App": "src/App"
  },
  "shared": {
    "react": {"eager": true, "singleton": true, "requiredVersion": "^16.13.1"},
    "react-dom": {"eager": true, "singleton": true, "requiredVersion": "^16.13.1"},
    "react-router-dom": {"requiredVersion": "^5.1.2"}
  }
}
```