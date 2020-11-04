# EMP CLI
> Base on Webpack5 Module Federation Micro Frontends solution

English | [简体中文](./README-zh_CN.md)

## 🙋‍♂️ Quick start
+ Initialize EMP project： `npx @efox/emp-cli init`

## 📦 Install 
`npm i -g @efox/emp-cli` or `yarn global add @efox/emp-cli` 

## 👨‍🔧 Features update
[Change Log](CHANGELOG.md)

## 👨‍💻 Command 

+ `emp init` Initialize project
+ `emp dev` Development
  + `emp dev --hot` Hot update
  + `emp dev --open` Open the development page
+ `emp build` Build
  + `emp build --env` Specify the deployment environment
  + `emp build --analyze` Analyze
  + `emp build --ts` Build the production environment, generate `index.d.ts` to `dist` directory at the same time 
    + `emp build --ts -p [types path] -n [types name]` `types path` default relative path  is  `dist`、`types name` default type file name is `index.d.ts`
+ `emp tsc` generate `index.d.ts` to `dist` directory 
  + `emp build --ts -p [types path] -n [types name]` `types path` default relative path  is `dist`、`types name` default type file name is  `index.d.ts`

+ `emp tss <remote-url>` Synchronization remote type
    + `emp tss <remote-url> -p [types path] -n [types name]` `types path` default relative path  is `src`、`types name` default type file name is `empType.d.ts`
+ `emp serve` Formal service
+ `emp` help 


## ✍🏻 Environment variable 
+ MODE_ENV webpack mode Environment variable , use  `process.env.EMP_ENV` 
+ EMP_ENV use `emp dev --env prod` Set up to distinguish the deployment environment , use `process.env.EMP_ENV`

## 👨🏻‍🏭 Plugin
+ [Generate type files for Module Federation project](https://www.npmjs.com/package/@efox/emp-tune-dts-plugin)

## 👩🏻‍💻 VSCODE SETTINGS
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true // eslint Auto format
  },
  "typescript.tsdk": "node_modules/typescript/lib", // ts css module type check
  "typescript.enablePromptUseWorkspaceTsdk": true   // ts css module type check
}

```