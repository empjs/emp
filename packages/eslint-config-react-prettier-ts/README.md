# Efox 中台代码规范 
## 依赖库
+ Eslint 
+ React 
+ prettier 
+ Typescript  

## 安装   

+ `npm i @efox/eslint-config-react-prettier-ts --dev` or 
+ `yarn add @efox/eslint-config-react-prettier-ts -D`  

> 使用 yarn 如果出现错误的话 需要补充安装 `yarn add eslint-plugin-prettier@latest -D` 

## 配置
+ 在 `.eslintrc.js` 中加入 :  
```javascript 
module.exports = {
  "extends": ["@efox/eslint-config-react-prettier-ts"]
}
```
