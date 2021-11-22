# EMP V2.0 

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