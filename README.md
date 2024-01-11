# EMP ⚡ 3.0

## TODO
+ 多入口配置
+ empShare
+ postcss
+ tailwind
+ vue2 的 支持
+ vue3 的 支持

## 待解决问题
+ 解决 sourcemap 问题 

## 环境问题 
### 解决`pnpm` 版本报错问题 
+ `pnpm env use --global lts`
+ `pnpm i -g pnpm`

## Workspace Typescript 设置 
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib", //全局安装typescript 其他都根据 根目录进行
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "eslint.probe": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "html",
    "vue",
    "markdown",
    "json"
  ]
}

```