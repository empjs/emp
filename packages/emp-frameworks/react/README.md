# EMP React Config Plugin
## Feature 
### 1.1.8
+ 升级了 react jsx的编译方式 `SX 转换不会将 JSX 转换为 React.createElement，而是自动从 React 的 package 中引入新的入口函数并调用` [Link](https://zh-hans.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) 
+ 根据安装依赖是否使用 antd import 按需加载
## Install 
+ `yarn add @efox/emp-react -D` 
+ `emp-config.js` conf:
```javascript
const withFrameWorkPlugin = require('@efox/emp-react')
module.exports = withFrameWorkPlugin(({config, env, empEnv}) => {
  // your options here
})
```