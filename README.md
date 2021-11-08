# 📦 EMP - Micro Frontends solution
> Base on SWC & Webpack 5
## 初始化 所有依赖包 
> 根目录执行 
+ `pnpm i` && `pnpm build:pkg` 构建所有依赖包 
+ `pnpm dev` package watch 开始模式

## 注意项 
+ es5 需要项目自行安装 `regenerator-runtime` 使用 `async await`

## TODO
## 推进进度 : 完成 🥳 进行中 🤯 放弃 🥵 调研 😇
+ 🤯 ESM demo支持 `ken`
+ 😇 切换到 html 为入口 
+ 😇 指定 html 入口 目录 
+ 利用 `fast-glob` 支持多入口
+ 😇 支持 热更 [js、react、module federation] `ken`
+ css sass less postcss 支持
+ react svgr 支持 
+ 增加 插件支持 
  + 先 适配业务 再 深度定制 SWC  支持 
  + `plugin-react`
+ 多入口 `ken [doing]`
+ 🤯 library 模式 `ken`
+ 🥳 同时 支持 es5 与 ESM 模块 `ken`
+ 🤯 优化日志友好度 `ken`

## emp 文件分布详解 
```
.
├── bin
│   ├── emp.js 命令行入口
│   └── openChrome.applescript
├── package.json
├── src
│   ├── cli 命令行脚本
│   ├── config 全局配置处理
│   └── helper
│       ├── logger.ts 日志全局 `未完善`
│       ├── store.ts 全局配置、路径等变量引用
│       └── wpChain.ts [webpack chain] 方法调用与合并 增量更新 webpack 内容
│   ├── index.ts 全局配置类型 与 实例化方法
│   ├── types.ts
│   └── webpack [webpack] 相关配置内容
└── template 全局模板
    ├── favicon.ico
    └── index.html
 
```