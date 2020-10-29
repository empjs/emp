# EMP Typescript Config

## Road Map 
+ v1.0.1 支持 Top Level Await 特性

## 安装 
`yarn add @efox/emp-tsconfig -D` or `npm i @efox/emp-tsconfig --dev`

## 使用 
```json 
// ./tsconfig.json
{
  "extends": "@efox/emp-tsconfig",
  "compilerOptions": {
    "baseUrl": "."
  },
  "include": [
    "src",
  ]
}
```