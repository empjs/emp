# EMP 
> YY 中台 微前端 工作流

## 微前端包 or cli
> emp-cli 详细文档 [点击](./packages/emp-cli/README.md)
+ `@efox/emp-cli` 构建项目、调试项目、生成项目脚手架、支持远程下载 d.ts `完成` 
+ `@efox/emp-tsconfig` 默认ts配置
+ `@efox/eslint-config-react-prittier-ts` 统一eslint 配置 `完成`
+ [*] 项目生成全局 d.ts `区分js 与 ts 项目 不默认生成 需要额外指令` `完成`
+ [*] 同步远程库类型 到 当前项目 d.ts `完成` 
+ 增加模板工程 `TODO`

## 功能清单
+ 支持远程 异步调用 `完成`
+ 支持调试模式 `完成` 
+ [*]支持中台 antd + react + sass + less 配置 `完成`  
+ [*]增加全局store 注册方法 `完成` 
+ [*]优化webpack5 配置 
  + ~~重写 emp-cli 配置后有可能会导致 构建问题 ~~
  + ~~考虑关闭类型检测  避免构建过慢 `webpack5 cache 构建 antd 问题`~~ 
  + ~~支持库文件 external `react react-router react-dom` shared 只能排序本项目的库依赖 没起到 独立引用的效果 `默认支持`~~
  + html 加入 process 变量 适配 部署环境 `完成` 
  + 把 public 收到 emp-cli `完成` 
  + html 支持自动引入到项目 `完成`
  + 增加 webpack-bundle-analyzer `emp build --analyze` 分析功能 `完成` [点击查看](./packages/emp-cli/README.md) 
  + 解决体积过大问题 `完成` 
  + 解决webpack 文件缓存重写问题 `TODO` 
  + [*]支持热更新 `完成` [问题处理](https://github.com/pmmmwh/react-refresh-webpack-plugin/issues)   
  + [*]mf 在 exposes 导出文件下 热更报错 `TODO`
  + [*]远程库 `ForkTsCheckerWebpackPlugin` 检测失败 `完成`  
  + 取消bootstrap 文件导入方案 `TODO 探讨中...` 
  + 非 module federation 模式下 避免出现 mf配置 `完成`  

## 项目指令  
+ `npm i -g lerna` 安装lerna 依赖   
+ `lerna bootstrap` 安装项目依赖  
+ `cd projects && yarn build && yarn start` 启动所有 @emp 项目  
+ `cd projects/[项目名称] && lerna add @efox/emp-cli` 安装命令行  
+ `cd projects/[项目名称] && lerna add @efox/emp-tsconfig` 安装ts依赖 
+ `cd projects/[项目名称] && yarn add @efox/eslint-config-react-prittier-ts` 安装 eslint 依赖 

## 调试 antd
+ `cd projects && yarn build:antd && yarn start:antd`

## emp-config.js 配置规范   
```javascript 
module.exports = ({config, env}) => {
  // config 为 webpack-chain 变量 具体参考 https://github.com/neutrinojs/webpack-chain
  // env 构建环境变量
  config.plugin('html').tap(...) // HtmlWebpackPlugin 配置
  config.plugin('mf').tap(...) // ModuleFederationPlugin 配置
  config.output.publicPath(...)
  config.devServer.port(...)
}

```

## 部署 
+ 组件 域名规范 : emp-[framework Type]-[project type].[domain] 如: `emp-antd-base.yy.com`
+ 项目 域名规范 : 根据落地页命名
+ CDN 规范 : emp-cdn.[domain]/[framework Type]-[project type]/ 如: `emp-cdn.yy.com/antd-base/`
  + 框架库命名规范  emp-cdn.[domain]/[framework]-[version]/ 如 `emp-cdn.yy.com/react-16/`

## 开发注意事项 
+ store层绑定必须在最外层 否则会导致操作不可更改数据后无法强刷 

## TS 类型文件
+ 通过 `emp tsc` 创建当前项目的 index.d.ts 文件到 dist/ 目录 
+ 通过 `emp tss [remote-url] -n [类型名].d.ts` 同步到 当前应用目录 src/
+ 通过 VSCode 插件 [emp-sync-base](https://marketplace.visualstudio.com/items?itemName=Benny.emp-sync-base) 实时同步到 当前应用目录 src/

### 处理方法 :TODO [待优化]
+ 1、格式化 js代码
+ 2、[热更问题](https://github.com/pmmmwh/react-refresh-webpack-plugin/issues/126)