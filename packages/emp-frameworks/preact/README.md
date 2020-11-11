# EMP Preact Config Plugin

## Install 
+ `yarn add @efox/emp-preact -D` 
+ `emp-config.js` conf:
```javascript
const withFrameWorkPlugin = require('@efox/emp-preact')
module.exports = withFrameWorkPlugin(({config, env, empEnv}) => {
  const projectName = 'preactComponents'
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        name: projectName,
        library: {type: 'var', name: projectName},
        filename: 'emp.js',
        exposes: {
          './header': 'src/components/header/index.jsx',
        },
      },
    }
    return args 
  })
})
```