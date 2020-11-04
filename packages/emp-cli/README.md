# EMP 工具库
> 基于webpack5 module federation 微前端解决方案 

## 快速开始
+ 初始化 EMP React 基站项目： `npx @efox/emp-cli init`

## 安装 
`npm i -g @efox/emp-cli` or `yarn global add @efox/emp-cli` 

## 功能迭代 
[更新文档](CHANGELOG.md)

## 指令 

+ `emp init 框架名 项目名` 新建项目，当前框架可选 React
+ `emp dev` 调试
  + `emp dev --hot` 热更
  + `emp dev --open` 打开调试页面
+ `emp build` 构建
  + `emp build --env` 指定 部署环境
  + `emp build --analyze` 分析
  + `emp build --ts` 构建生产环境同时生成`index.d.ts`文件到`dist`目录
    + `emp build --ts -p [types path] -n [types name]` `types path` 相对路径 默认 `dist`、`types name` 类型文件名 默认 `index.d.ts`
+ `emp tsc` 生成 `index.d.ts` 文件到`dist`目录  
  + `emp build --ts -p [types path] -n [types name]` `types path` 相对路径 默认 `dist`、`types name` 类型文件名 默认 `index.d.ts`

+ `emp tss <remote-url>` 同步远程类型
    + `emp tss <remote-url> -p [types path] -n [types name]` `types path` 相对路径 默认 `src`、`types name` 类型文件名 默认 `empType.d.ts`
+ `emp serve` 正式服务
+ `emp` help 


## 环境变量 
+ MODE_ENV webpack mode 环境变量 , 通过 `process.env.EMP_ENV` 调用
+ EMP_ENV 通过 `emp dev --env prod` 进行设置 用来区分部署环境 , 通过 `process.env.EMP_ENV` 调用

## 拓展
+ Typescript [定制类型文件](https://www.npmjs.com/package/@efox/emp-tune-dts-plugin)

## VSCODE SETTINGS
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true //支持 eslint 自动格式化
  },
  "typescript.tsdk": "node_modules/typescript/lib", //支持 ts css module type check
  "typescript.enablePromptUseWorkspaceTsdk": true   //支持 ts css module type check
}

```