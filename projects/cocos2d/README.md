# 在 EMP 中使用 cocos2d

## 使用方式

安装`@efox/emp-cocos2d`

```
yarn add @efox/emp-cocos2d -D
```

然后在`emp-config.js`引用`@efox/emp-cocos2d`

```javascript
const withCocos2d = require('@efox/emp-cocos2d')

module.exports = withCocos2d(({ config, env, empEnv }) => {
  // your options here
})
```

## 启动

1. 打开 creator cocos，导入当前项目
2. 打开当前项目
3. 进入项目根目录，运行：

```bash
yarn && yarn dev
```
