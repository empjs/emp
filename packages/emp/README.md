# EMP V2.0 
+ 💡 微组件化
  - 结合webpack5、Module Federation的丰富项目实战、建立三层共享模型
+ ⚡️ 快速构建重载
  - 结合SWC进行bundle编译构建、提升整体构建速度.
+ 🛠️ 多功能模块支持
  - 对 TypeScript、JSX、CSS、Less、Sass 等支持开箱即用。
+ 📦 优化的构建
  - 可选 “多页应用” 或 “库” 模式的预配置 webpack 构建.
+ 🔩 通用的插件
  - 在开发和构建之间共享 webpack chain 插件接口.
+ 🔑 TS重构项目
  - 提供灵活的api、Plugin以及完整的类型提示.
  
+ [官方说明文档](https://emp2.netlify.app/) 


## TS 开发设置 
> tsconfig.json [@efox/emp-tsconfig 已经整合到  @efox/emp]
```json
{
  "extends": "@efox/emp/emp-tsconfig.json",
  "compilerOptions": {
    "types": ["@efox/emp/client"],
    "baseUrl": ".",
  },
  "include": [
    "src",
  ]
}

```

## 开发react 
### 需要安装 依赖
+ dependencies
  - "mobx"
  - "mobx-react-lite"
  - "react": "^17.0.2"

+ devDependencies
  - "@efox/emp"
  - "@types/react-router-dom"
  - "regenerator-runtime"
### eslint 
```js
module.exports = {
  extends: ['@efox/eslint-config-react-prittier-ts'],
}
```

# 开发vue 
无需安装依赖 

### eslint 
```js
module.exports = {
  extends: ["@efox/eslint-config-vue-prettier-ts"],
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": false
  },
};

```