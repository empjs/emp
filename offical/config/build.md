# 构建选项
## build.target
 + 类型 `JscConfig['target']`

 生成代码 参考 [swc#jsctarget](https://swc.rs/docs/configuration/compilation#jsctarget)

## build.sync
+ 类型 `boolean`
+ 默认 `false`

swc 是否异步构建

## build.outDir
+ 类型 `string`
+ 默认 `dist`

生成代码目录

## build.assetsDir
+ 类型 `string`
+ 默认 `assets`

生成静态目录

## build.staticDir
+ 类型 `string`
+ 默认 ``

生成包含 js,css,asset 合集目录

## build.minify
+ 类型 `boolean` | `swc`
+ 默认 `true`

是否压缩、默认 development 不压缩，production 压缩

::: tip v2.1.0
启用 `swc` 进行压缩 比 `terser` 速度提升 7倍,目前处于 `RC` 阶段，可以正常使用
:::

当设置为 `swc` 时 默认使用 swc压缩 [点击参考配置](https://github.com/mishoo/UglifyJS#minify-options)

## build.imageMin
+ 类型 `boolean`
+ 默认 `false`

是否图片压缩、 development 无论 imageMin 怎么设置都不生效，production 生效

## build.minOptions
+ 类型 `TerserOptions`
+ 默认 `{compress:false}`

具体配置可以参考 [链接](https://github.com/terser/terser#minify-options)

## build.sourcemap
+ 类型 `boolean`
+ 默认 `true`

是否生产sourcemap、默认 development 生产，production 不生产

## build.emptyOutDir
+ 类型 `boolean`
+ 默认 `true`

是否清空生成文件夹

## build.chunkIds
+ 类型 `false` | `natural` | `named` | `deterministic` | `size` | `total-size`
+ 默认 `named` | `deterministic`

`named` 有助于定位问题 开发模式默认启动
`deterministic` 在不同的编译中不变的短数字 id。有益于长期缓存。在生产模式中会默认开启。

## build.analyze
+ 类型 `boolean`
+ 默认 `false`

通过 cli `--analyze` 或 `-a` 生成构建分析

## build.lib
+ 类型 `LibMod`

使用库模式 具体可以点击 [查看详情](/develop/#build-lib-配置)
