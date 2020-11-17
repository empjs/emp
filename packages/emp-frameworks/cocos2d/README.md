# EMP Cocos2d Config Plugin

## Install

- `yarn add @efox/emp-cocos2d -D`
- `emp-config.js` conf:

```javascript
const withCocos2d = require('@efox/emp-cocos2d')
module.exports = withCocos2d(
  ({ config, env, empEnv }) => {
    // your options here
  },
  {
    // creator server port
    creatorPort: 7456,
    // emp remotes url
    empJs: [],
  }
)
```
