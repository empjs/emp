# @empjs/biome-config
[![npm version][npm-version-src]][npm-version-href]

EMP 官方默认格式化配置、`v6.0` 已支持 CSS

## vscode 设置
### .vscode/settings.json 
```json
{
  "eslint.enable": false,
  "prettier.enable": false,
  "css.lint.unknownAtRules": "ignore",
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.defaultFormatter": "biomejs.biome",
  "[scss]": {
    "editor.defaultFormatter": "vscode.css-language-features"
  }
}

```

## 默认配置 
+ [biome.jsonc](./biome.jsonc)


[npm-version-src]: https://img.shields.io/npm/v/@empjs/biome-config?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/@empjs/biome-config