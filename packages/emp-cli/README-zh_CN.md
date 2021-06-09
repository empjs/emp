# EMP 工具库
> 基于webpack5 module federation 微前端解决方案 

[English](./README.md) | 简体中文

## 🙋‍♂️ 快速开始
+ 初始化 EMP 项目： `npx @efox/emp-cli init`

## 📦 安装 
`npm i -g @efox/emp-cli` or `yarn global add @efox/emp-cli` 

## 👨‍🔧 功能迭代 
[更新文档](CHANGELOG.md)

## 👨‍💻 指令 

+ `emp init` 初始化项目
  + `emp init -t <remote-template-url>`
  >自定义模版列表需要使用JSON格式（"模版名":"git 链接"）
  ```json
  {
    "react": "https://github.com/efoxTeam/emp-react-template.git",
    "vue2":"https://github.com/efoxTeam/emp-vue2-template.git"
  }
  ```

+ `emp dev` 调试
  + `emp dev --hot` 热更
  + `emp dev --open` 打开调试页面
  + `emp dev -rm` 拉取远程声明文件到src目录中
    + -rm --remote：默认是从package.json中的remoteBaseUrlList字段中获取远程地址，格式为
    + ```javascript
      {
        "remoteBaseUrlList": [
          {
            "url": "https://com/index.d.ts",
            "name": "project.d.ts"
          }
        ]
      } 
      ```
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
+ `emp dist:ts` 本地声明文件同步到子项目
    + `emp tsc && emp dist:ts && emp dev` 
    + dist:ts默认是读取本地的package.json中的childPath字段进行循环输出，尽量保持base项目和project项目在同一层级, package.json的格式为：
    + ```javascript
      {
        "childPath": [
          {
            "path": "project",
            "name": "xxx.d.ts"
          },
          {
            "path": "/User/project",
            "name": "xxx.d.ts"
          }
        ]
      }
      ```

## 🧞‍♂️ 指令插件开发指引
### 插件，包名前缀需要为 `emp-plugin-*`, `cli.js` 为 emp 插件入口。

+ 新建项目，以 `emp-plugin-` 为项目前缀,插件入口为 `cli.js`
```javascript
module.exports = program => {
  program
    .command('helloWorldPlugin')
    .option('-i, --item <item>')
    .description([
      `It is plugin description`,
    ])
    .action(({item}) => {
      console.log(`Plugin ${item}`)
    })
}
```

 + 开发完成后(emp-plugin-example 仅为例子包名，具体包名以实际包名为准):
  + 通过 `yarn` 安装:
    + `yarn global add emp-plugin-example`
  + 通过 `npm` 安装:
    + `npm install emp-plugin-example -g`

 启动 emp 即可用插件<br>
 <img src='https://user-images.githubusercontent.com/19996552/113428029-a55e4500-9408-11eb-906d-29795199f422.png' width='600' alt="npx @efox/emp-cli init"/>
<br>

## ✍🏻 环境变量 
+ MODE_ENV webpack mode 环境变量 , 通过 `process.env.EMP_ENV` 调用
+ EMP_ENV 通过 `emp dev --env prod` 进行设置 用来区分部署环境 , 通过 `process.env.EMP_ENV` 调用

## 👨🏻‍🏭 拓展
+ Typescript [定制类型文件](https://www.npmjs.com/package/@efox/emp-tune-dts-plugin)

## 👩🏻‍💻 VSCODE SETTINGS
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true //支持 eslint 自动格式化
  },
  "typescript.tsdk": "node_modules/typescript/lib", //支持 ts css module type check
  "typescript.enablePromptUseWorkspaceTsdk": true   //支持 ts css module type check
}

```


# 声明文件同步方案与多版本

## 前置条件:
+ 使用 `@efox/emp-cli` `1.8.6` 及以上版本
+ `tsconfig.json` `include`配置项请添加 `types` 目录
```json
"include": [
    "types"
]
```
+ `package.json`指令强化
```json
"dev": "emp workspace -t pullTypes && emp dev",
"tsc": "emp tsc -w && emp workspace -t pushTypes",
```
## 使用方式:
### 初始化本地emp工作区配置文件

命令行使用 `emp workspace -t init` 指令，会在当前工作目录根目录创建`emp.workspace.config.ts`配置文件，并会在当前目录 `.gitignore`添加`types/`与 `emp.workspace.config.ts`忽略，如项目已有上述文件，请重命名为其他文件，并在之前使用`git rm [filename]` 移除并`push`到远端

配置文件内容参考如下:
```javascript
import {IWorkSpaceConfig} from '@efox/emp-cli/types/emp-workspace-config'

const empWorkspaceConfig: IWorkSpaceConfig = {
    // 执行 emp workspace -t pullTypes 指令，会把 pullConfig配置的远程声明文件，拉到当前根目录 types目录下
  pullConfig: {
    localTypeTest1: 'E:/baidu/git/bdgamelive/src/types/svga.d.ts',
    localTypeTest2: 'E:/baidu/git/bdgamelive/src/types/empbdgamechatbox.d.ts',
  },
  // 执行 emp workspace -t pushTypes 指令，会把 pushConfig配置的本地声明文件，推送到remotePath所在的目录
  pushConfig: {
    localPath: './dist/index.d.ts',
    remotePath: ['E:/baidu/git/test/zzz.d.ts', 'G:/baidu/git/test/zzz.d.ts'],
  },
}
export default empWorkspaceConfig
```

## 声明文件添加版本标识

使用`emp tsc -w`指令生成的声明文件，将会把`主要版本号`,`次要版本号`拼接到模块项目名中
