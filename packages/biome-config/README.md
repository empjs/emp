# @empjs/biome-config
[![npm version][npm-version-src]][npm-version-href]

EMP 官方默认格式化配置、`v6.0` 已支持 CSS

## vscode 设置
### .vscode/settings.json 
```json
  "editor.codeActionsOnSave": {
    "source.fixAll.biome": "explicit"
  }
```

## 默认配置 
+ [biome.jsonc](./biome.jsonc)

## monorepo 配置 
> 根目录 biome.jsonc
```json
{
  "root": true,
  "extends": ["@empjs/biome-config"]
}

```


[npm-version-src]: https://img.shields.io/npm/v/@empjs/biome-config?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/@empjs/biome-config