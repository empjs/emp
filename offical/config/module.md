# 编译选项
## moduleTransform.parser
::: tip
v2.3.0 弃置 利用 `compile` 替代
v2.2.0 之前默认使用 `swc`,因为各种构建问题，暂时切换回 `babel` 详细讨论可以[点击参与](https://github.com/efoxTeam/emp/discussions/281)
:::
+ 类型 `babel` `swc` `esbuild [暂未提供使用]`
+ 默认 `babel`

## moduleTransform.include
+ 类型 `(string | RegExp | ((value: string) => boolean) | RuleSetLogicalConditionsAbsolute | RuleSetConditionAbsolute[] | undefined)[]`
+ 默认 `null`

指定编译 `node_modules` 库 如 `@baidu`
```js
moduleTransform.include = [path.resolve(__dirname, 'node_modules/@baidu')]
```

## moduleTransform.exclude
+ 类型 `(string | RegExp | ((value: string) => boolean) | RuleSetLogicalConditionsAbsolute | RuleSetConditionAbsolute[] | undefined)[]`
+ 默认 `[/(node_modules|bower_components)/]`


指定不编译 `node_modules` 里的库 如 `@baidu` `@yy`
```js
moduleTransform.exclude = [/@baidu/,path.resolve(__dirname, 'node_modules/@yy')]
```

## moduleTransform.antdTransformImport
::: tip
v2.2.4
:::
+ 类型 `boolean`
+ 默认 `true`

是否开启 `antd` 按需加载，基于`swc`与`babel`实现不同，后续考虑开放所有 按需加载选项

## moduleTransform.useBuiltIns
::: tip
v2.3.8
:::
+ 类型 `usage` | `entry` | false
+ 默认 `entry`

在老版本兼容的时候需要切换到 usage 把引用库 适配到当前配置 [体积会随之增大]
