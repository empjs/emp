# 2.7.x
> 预告：将会全面切换到 swc 取代 babel 的编译方案
# 2.6.x
## Features
+ @efox/emp@2.6.6 升级 `webpack@5.78.0` 带来的bugfix 以及性能提升 [详情](https://github.com/webpack/webpack/releases/tag/v5.78.0)
+ @efox/emp@2.6.5 修复多入口的 `externals` 引起的重复引入问题
+ @efox/emp@2.6.4 增加 `css.minType` 当为 `swc` 时会使用 swc进行压缩
+ @efox/emp@2.6.2 支持 vue 的 dts 类型生成 by [MAXLZ1](https://github.com/efoxTeam/emp/pull/334)
+ 支持自动切换 port功能，不需要手动设置

## Bugfixes
+ @efox/emp-compile-swc@1.3.1 修复 `swc` 的 `cssmin` 压缩问题 `初步测试通过，待观察`
+ @efox/emp-compile-swc@1.3.0 修复 `swc` 编译问题
+ @efox/plugin-vue-2@1.2.2 同时支持 vue Component 与 src inline [DEMO](https://github.com/efoxTeam/emp/blob/main/projects/vue-2-base/src/views/Home.vue#L15)
+ @efox/plugin-vue-3@1.2.0 修复vue3中使用lang=tsx时的报错问题 by [MAXLZ1](https://github.com/efoxTeam/emp/pull/333)
+ swc 取消 `loose`，解决语法使用的差异问题 如 [link](https://github.com/swc-project/swc/issues/6627),问题清单持续修复 [link](https://github.com/efoxTeam/emp/discussions/327)

# 2.5.x
> 全面支持 ESM 版本，深度基于ESM 的模型进行定制
## Features
+ 升级 webpack 修复部分性能问题
+ 增加 importMap 支持，实现ESM 模型下 开发与正式环境的切换
+ 支持 esm 远程基站的引用 不受环境影响的问题
+ 增加 html tags 注入 方面进行更多定制内容
+ 优化 swc 接入选项，一步到位
+ 增加 css minify 的 swc 选项
+ (*) 2.5.11 后 `js 编译` `css 压缩` `js 压缩` 安装 `@efox/emp-compile-swc` 均可统一切换到 `swc`

### ESM Demo
+ [基站](https://github.com/efoxTeam/emp/tree/next/projects/micro-host)
+ [应用](https://github.com/efoxTeam/emp/tree/next/projects/micro-app)

## Bugfixes
+ 解决 pnpm 安装问题
+ 优化 `store.config` 配置传参问题
+ 修正 库模式 extension 的问题

# 2.4.x
## Features
+ 增加低版本兼容性的选项
+ 增加 缓存等项目级别目录的定义，以便ci 等功能的定制
+ 增加 `webpack` 选项

## bugfixes
+ 修正 `jscheck` 不支持兼容 eslint 使用的问题
+ 修正 babel 版本告知问题
+ 修复版本号文件夹问题
+ 修复 `html.files.js|css` 失效问题

# 2.3.5
## Features
+ 增加 `postcss-rem` 支持
+ 增加 `postcss-vw` 支持
+ 增加 默认 `postcss-flexbugs-fixes`
+ 增加 默认 `postcss-preset-env`
+ 增加 默认 `postcss-normalize`

## Bugfixes
+ 修复 `postcss-px-to-viewport` postcss8 兼容问题
+ 修复 手动修改 `package.json` 版本号 导致的react 版本识别问题

# 2.3.3
## Features
+ 重构 worker 层的传参方式 让 dts 更加符合逻辑
+ 重构 empShare 的赋值方案 增加 remotes 独立字段提供下载
## bugfixes
+ 修正 windows下无法生成 dts 问题
+ 修正类型同步问题

# 2.3.0
## Features
+ 分离 `swc` 为独立插件 [@efox/emp-compile-swc](packages/compile-swc/README.md) 加速依赖安装速度
+ 重构编译配置为 `compile` 后续可以通过 修改 `config.compile` 改实现 编译的切换 如 `esbuild` `bun` 等
## bugfixes
+ 修复 windows下缓存失效问题，2次构建速度与老版本提升 10x 以上
+ 文件插入 从 `head` 改成 `body`
+ 修正 `svg` 编译问题
+ 修复配置项 加载两次的问题

# 2.2.4
## Features
+ 增加 `swc` 对 `antd` 的 `transform-import` 支持
+ 增加选项 `moduleTransform.antdTransformImport` 是否按需加载

# 2.2.2
## Features
+ 增加 `chunk` 自定义支持 如 `pc/index.html` => `info-pc.html` 修改 `chunk` 即可实现 [demo](projects/multi-entries-app/emp-config.js)
```js
    entries: {
      'pc/index.tsx': {title: 'PC介绍', chunk: 'info-pc'},
    },
```
+ 升级 webpack5 最新 `https` & `http2` 设置 保持与emp 配置一致，用户不需要手动配置新的方法

## Bugfixes
+ 修复 正式环境的 `https` 无法访问问题
+ 修复 `emptyOutDir` 不生效问题


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
