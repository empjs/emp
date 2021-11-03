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

## FAQ
+ Q: How share Vue dependencies ?
+ A: Vue is special, You need use `vue/dist/vue.esm.js` in shared array.example:
```js
const withVue2 = require('@efox/emp-vue2')
module.exports = withVue2(({config, env, empEnv}) => {
  const projectName = 'vue2Components'
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        name: projectName,
        library: {type: 'var', name: projectName},
        filename: 'emp.js',
        remotes: {
          vue2Components: 'vue2Components',
        },
        exposes: {
          './Content.vue': './src/components/Content',
        },
        shared: ['vue/dist/vue.esm.js'],// You need use `vue/dist/vue.esm.js` here
      },
    }
    return args
  })
}
```
