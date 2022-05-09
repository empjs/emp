# 📦 EMP - Micro Frontends solution
> Base on Webpack 5
## 初始化 所有依赖包
> 根目录执行
+ `pnpm i` && `pnpm build:pkg` 构建所有依赖包
+ `pnpm dev` package watch 开始模式


## TODO
## 推进进度 : 完成 🥳 进行中 🤯 放弃 🥵 调研 😇
+ 🤯 ESM demo支持 `ken`
+ 🥳 切换到 html 为入口
+ 🥳 指定 html 入口 目录
+ 利用 `fast-glob` 支持多入口
+ 🥳 支持 热更 [js、react、module federation] `ken`
+ 🥳 css sass less postcss 支持
+ 🥳 react svgr 支持
+ 🥳 增加 插件支持
  + 🥳 先 适配业务 再 深度定制 SWC  支持
  + 🥳 `plugin-react`
+ 😇 多入口模式支持 类似于next  `ken` `跟 externals 有相关逻辑需要考虑`
+ 🤯 library 模式 `ken`
+ 🥳 同时 支持 es5 与 ESM 模块 `ken`
+ 🤯 优化日志友好度 `ken`
+ 🥳 动态变量适配 `process.env` & `import.meta.env` 支持 es5 与 esm
+ 😇 探讨babel环境下 的 esm实现 或者 只 支持 ES5
+ 🥳 验证 复杂型项目在 swc 环境下的 可行性
+ 🤯 改造 MF模型 增加多级共享
+ 🥳 dotenv 跟就 cli --env 做判断再跟进 mode 做判断
+ 🤯 支持https 代理
+ 🤯 支持域名设置
+ 😇 DTS 重写 [非commander]
+ 🤯 cliOptions 在 build 的情况下无法获取

## ESM TODO
+ 当基站正式 app测试时存在混乱问题，需要进一步提取 import 保持 lib的一致性
+ 热更部分 基站可以热更，app不能热更
+ 正式环境可以正常运作，考虑是否单独抽离的方式 独立 ESM的实现方案

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

