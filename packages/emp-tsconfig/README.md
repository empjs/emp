# EMP Typescript Config

## Road Map 
+ v1.0.4 加入 `typescript-plugin-css-modules` 支持 vscode 直接支持 css 类型检测
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

```json
// ./settings.json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",//支持css 类型检测配置
  "typescript.enablePromptUseWorkspaceTsdk": true,//支持css 类型检测配置
}

```