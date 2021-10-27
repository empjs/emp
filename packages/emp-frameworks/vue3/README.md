# vue 3 typescript 开发百宝箱 
## 功能 
+ 支持 vue 3 ts 类型支持 
+ 支持 vue 3 `tsconfig.json` 默认配置 
+ 支持 vue3 emp 构建配置 

## 项目 配置 
> 根目录增加如下文件即可进行开发 
+ TS 配置文件 `tsconfig.json`
```json 
{
  "extends": "@empfe/vue3",
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

+ EMP 配置文件 `emp-config.js` 
```js
const vue3 = require('@empfe/vue3')
/**
 * @type {import('@efox/emp-cli').EMPConfig}
 */
module.exports = {
  compile: [vue3]
}

```

+ 代码目录 `src/` 