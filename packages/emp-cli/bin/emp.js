#!/usr/bin/env node

let program = require('commander') // 命令行工具
const ora = require('ora') // 实现node.js命令行环境的loading效果，和显示各种状态的图标等
const package = require('../package.json')
const chalk = require('chalk') // 支持修改控制台中字符串的样式 字体样式、字体颜色、背景颜色
const {checkNodeVersion} = require('../helpers/cli')
// const {pluginDriver} = require('../helpers/pluginDriver')
const globalCommand = require('../helpers/globalCommand')
const Axios = require('axios')
const {empConfigSync} = require('../helpers/compile')

checkNodeVersion(package.engines.node, 'emp')
/* console.log(chalk.bold('====== EMP 微前端 ======'))
console.log(chalk.bold('@efox/emp-cli') + ' [ ' + chalk.green.bold(package.version) + ' ]')
console.log(chalk.bold('webpack') + ' [ ' + chalk.green.bold(package.dependencies.webpack) + ' ]')
console.log(chalk.bold('typescript') + ' [ ' + chalk.green.bold(package.dependencies.typescript) + ' ]')
console.log(chalk.bold('====== ====== ====== ======')) */
const inquirer = require('inquirer') //交互性命令行
const Table = require('cli-table3')
const table = new Table({
  head: ['Emp & Deps', 'Version'],
  style: {head: ['cyan']},
  chars: {
    top: '═',
    'top-mid': '╤',
    'top-left': '╔',
    'top-right': '╗',
    bottom: '═',
    'bottom-mid': '╧',
    'bottom-left': '╚',
    'bottom-right': '╝',
    left: '║',
    'left-mid': '╟',
    mid: '─',
    'mid-mid': '┼',
    right: '║',
    'right-mid': '╢',
    middle: '│',
  },
})
table.push(['@efox/emp-cli', package.version])
table.push(['webpack', package.dependencies.webpack])
table.push(['webpack-dev-server', package.dependencies['webpack-dev-server']])
table.push(['typescript', package.dependencies.typescript])
table.push(['postcss', package.dependencies.postcss])
console.log(table.toString() + '\n')
//
program.version(package.version, '-v, --version').usage('<command> [options]')

//调试
program
  .command('dev')
  // .alias('d')
  .description('调试项目')
  .option('-s, --src <src>', '目标文件 默认为 src/index.ts')
  .option('-pc, --public <public>', '目标 默认为 public/')
  .option('-e, --env <env>', '部署环境 dev、test、prod 默认为 dev')
  .option('-h, --hot', '是否使用热更新 默认不启动')
  .option('-o, --open <open>', '是否打开调试页面 默认true,false禁止自动打开')
  .option('-t, --ts', '生成类型文件 默认为 false')
  .option('-ps, --progress <progress>', '显示进度 默认为 true')
  .option('-wl, --wplogger [filename]', '打印webpack配置 默认为 false,filename 为 输出webpack配置文件')
  .option('-rm, --remote', '在执行命令时拉取远程声明文件，远程地址首选package.json里的remoteBaseUrlList')
  .action(({src, public, env, hot, open, ts, progress, wplogger, remote}) => {
    const empEnv = env || 'dev'
    open = open === 'false' ? false : true
    // hot = hot === 'false' ? false : true
    progress = progress == 'false' ? false : true
    require('../scripts/dev')({src, public, empEnv, hot, open, ts, progress, wplogger, remote})
  })
// 构建
program
  .command('build')
  // .alias('d')
  .description('构建项目')
  .option('-s, --src <src>', '目标文件 默认为 src/index.ts')
  .option('-d, --dist <dist>', '目标 默认为 dist/')
  .option('-pc, --public <public>', '目标 默认为 public/')
  .option('-dc, --doc <doc>', '目标 默认为 doc/')
  .option('-e, --env <env>', '部署环境 dev、test、prod 默认为 prod')
  .option('-a, --analyze', '生成分析报告 默认为 false')
  .option('-t, --ts', '生成类型文件 默认为 false')
  .option('-n, --createName <createName>', '文件名 默认为 index.d.ts [* 使用默认值方便同步]')
  .option('-p, --createPath <createPath>', '相对命令行目录 默认为 dist')
  .option('-ps, --progress <progress>', '显示进度 默认为 false')
  .option('-wl, --wplogger [filename]', '打印webpack配置 默认为 false,filename 为 输出webpack配置文件')
  .action(({src, dist, public, analyze, env, ts, progress, createName, createPath, wplogger}) => {
    const empEnv = env || 'prod'
    progress = progress == 'false' ? false : true
    require('../scripts/build')({
      src,
      dist,
      public,
      analyze,
      empEnv,
      ts,
      progress,
      createName,
      createPath,
      wplogger,
    })
  })
// 正式环境
program
  .command('serve')
  // .alias('d')
  .description('正式环境调试')
  .option('-d, --dist <dist>', '目标 默认为 dist')
  .action(({dist}) => {
    const empEnv = 'prod'
    require('../scripts/serve')({dist, empEnv})
  })
// ts 类型构建
program
  .command('ts:create')
  .alias('tsc')
  .description('ts类型创建')
  .option('-w, --withVersion')
  .option('-n, --createName <createName>', '文件名 默认为 index.d.ts [* 使用默认值更方便同步]')
  .option('-p, --createPath <createPath>', '相对命令行目录 默认为 dist')
  .action(({createName, createPath, withVersion}) => {
    require('../scripts/typescript')('create', {createName, createPath, withVersion})
  })
// ts 类型同步
program
  .command('ts:sync <remoteUrl>')
  .alias('tss')
  .description('ts类型同步')
  // .option('-u, --remoteUrl <remoteUrl>', '远程地址')
  .option('-n, --saveName <saveName>', '保存名称 默认为 empType.d.ts')
  .option('-p, --savePath <savePath>', '默认当前执行指令根目录的 src')
  //
  .action((remoteUrl, {saveName, savePath}) => {
    require('../scripts/typescript')('sync', {remoteUrl, saveName, savePath})
  })
// 环境变量
program
  .command('info')
  .description('查看当前运行环境')
  .action(() => {
    console.log(chalk.green.bold('\nEnvironment Info:'))
    const spinner = ora('Start loading system configuration...').start()
    // eninfo 获取系统的信息，设备信息，浏览器，node版本等
    require('envinfo')
      .run(
        {
          System: ['OS', 'CPU'],
          Binaries: ['Node', 'Yarn', 'npm'],
          Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
          // npmPackages: '/**/{*efox*,@efox/*,*react*,@react/*/}',
          npmGlobalPackages: ['@efox/emp-cli'],
        },
        {
          showNotFound: true,
          duplicates: true,
          fullTree: true,
        },
      )
      .then(res => {
        console.log(chalk.green(res))
        spinner.succeed('Loading system configuration is complete')
      })
  })

//初始化项目
program
  .command('init')
  .description('初始化 emp 项目')
  .option('-t, --template <template>', '模版文件URL')
  .action(({template}) => {
    const downloadTemplate = () => {
      const templateNameList = []
      for (item in templateList) {
        templateNameList.push(item)
      }
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'name',
            message: '请输入项目名:',
            default: function () {
              return 'emp-project'
            },
          },
          {
            type: 'list',
            name: 'template',
            message: '请选择模板:',
            choices: templateNameList,
          },
        ])
        .then(answers => {
          require('../helpers/downloadRepo')(templateList[answers.template], `${answers.name}`, '')
        })
    }
    let templateList = []
    if (!template) {
      templateList = require('../config/template.json')
      downloadTemplate()
    } else {
      Axios.get(template)
        .then(res => {
          templateList = res.data
          downloadTemplate()
        })
        .catch(function (e) {
          console.log(e)
        })
    }
  })
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// 以下考虑移除全局CLI 的指令 /////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //初始化topic-emp项目
// program
//   .command('topic')
//   .description('初始化 emp 项目')
//   .action(() => {
//     inquirer
//       .prompt([
//         {
//           type: 'input',
//           name: 'name',
//           message: '请输入项目名(如 yy): ',
//           default: function () {
//             return 'topic-emp-pro'
//           },
//         },
//       ])
//       .then(async answers => {
//         const name = `topic_emp_${answers.name}`
//         const templateList = require('../config/template.json')
//         await require('../helpers/downloadRepo')(templateList['topic-emp-demo'], name, '')
//         const fs = require('fs')
//         const path = require('path')
//         const filepath = path.resolve(`${name}/package.json`)
//         let content = require(filepath)
//         content.name = name
//         fs.writeFileSync(`${name}/package.json`, JSON.stringify(content, null, 2), 'utf8', err => {})

//         const projectFile = path.resolve(`${name}/project-config.js`)
//         content = fs.readFileSync(projectFile, 'utf8')
//         content = content.replace(/topic_emp_tpl/g, name)
//         fs.writeFileSync(`${name}/project-config.js`, content, 'utf8', err => {})
//       })
//   })

// // ui 起gui项目

// program
//   .command('ui')
//   .description('起emp gui 服务')
//   .option('-h, --host <host>', '起服务的域名，默认是localhost')
//   .option('-p, --port <port>', '起服务的端口号，默认是1234')
//   .option('--headless', '不自动打开浏览器页面')
//   .action(({host, port, headless}) => {
//     require('../scripts/ui')({host, port, headless})
//   })

// // 增加声明文件在本地的同步功能
// program
//   .command('dist:ts')
//   .option('-t, --ts', '生成类型文件 默认为 false')
//   .option('-n, --createName <createName>', '文件名 默认为 index.d.ts [* 使用默认值更方便同步]')
//   .option('-p, --createPath <createPath>', '相对命令行目录 默认为 dist')
//   .action(({ts, createName, createPath}) => {
//     require('../scripts/dist')({ts, createName, createPath})
//   })

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////以上考虑移除CLI的命令行//////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 暴露全局配置变量给到 emp-config.ts
const empConfig = empConfigSync()
if (empConfig && empConfig.commander && typeof empConfig.commander === 'function') {
  empConfig.commander(program)
}
// console.log('commander', empConfig)

// program = pluginDriver(program)
globalCommand(program)

// 执行命令
program.parse(process.argv)
