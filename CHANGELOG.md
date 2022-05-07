# 2.2.1
## Features
+ 升级 `@efox/eslint-config-vue` 到 `2.0.1` 升级 `eslint` 到 v7
+ 升级 `@efox/eslint-config-react` 到 `2.1.0` 移除 `empproposal`
## Bugfixes
+ 修正 `@babel/runtime` 无法引用问题
+ babel支持ts4.5 import type语法 [#285](https://github.com/efoxTeam/emp/pull/285)

# 2.2.0
## Features
+ 切换到 `babel` 编译
+ 设置 `moduleTransform.parser` 一键切换到 `swc`
+ 设置 `build.minify` 为 `swc` 同时设置 `moduleTransform.parser` 为 `swc` 可以构建压缩同时使用 `swc`

## Bugfixes
+ 修正 `esm` 模块共享失败问题

# 2.0.8
+ 增加 `moduleTransform` 实现库再编译
