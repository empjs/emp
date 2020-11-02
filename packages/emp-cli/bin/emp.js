#!/usr/bin/env node

const program = require('commander') // 命令行工具
const ora = require('ora') // 实现node.js命令行环境的loading效果，和显示各种状态的图标等
const package = require('../package.json')
const chalk = require('chalk') // 支持修改控制台中字符串的样式 字体样式、字体颜色、背景颜色
const {checkNodeVersion} = require('../helpers/cli')
checkNodeVersion(package.engines.node, 'emp')
/* console.log(chalk.bold('====== EMP 微前端 ======'))
console.log(chalk.bold('@efox/emp-cli') + ' [ ' + chalk.green.bold(package.version) + ' ]')
console.log(chalk.bold('webpack') + ' [ ' + chalk.green.bold(package.dependencies.webpack) + ' ]')
console.log(chalk.bold('typescript') + ' [ ' + chalk.green.bold(package.dependencies.typescript) + ' ]')
console.log(chalk.bold('====== ====== ====== ======')) */
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
  .option('-ps, --progress', '显示进度 默认为 false')
  .action(({src, public, env, hot, open, ts, progress}) => {
    const empEnv = env || 'dev'
    open = open === 'false' ? false : true
    require('../scripts/dev')({src, public, empEnv, hot, open, ts, progress})
  })
// 构建
program
  .command('build')
  // .alias('d')
  .description('构建项目')
  .option('-s, --src <src>', '目标文件 默认为 src/index.ts')
  .option('-d, --dist <dist>', '目标 默认为 dist/')
  .option('-pc, --public <public>', '目标 默认为 public/')
  .option('-e, --env <env>', '部署环境 dev、test、prod 默认为 prod')
  .option('-a, --analyze', '生成分析报告 默认为 false')
  .option('-t, --ts', '生成类型文件 默认为 false')
  .option('-n, --createName <createName>', '文件名 默认为 index.d.ts [* 使用默认值方便同步]')
  .option('-p, --createPath <createPath>', '相对命令行目录 默认为 dist')
  .option('-ps, --progress', '显示进度 默认为 false')
  .action(({src, dist, public, analyze, env, ts, progress, createName, createPath}) => {
    const empEnv = env || 'prod'
    require('../scripts/build')({src, dist, public, analyze, empEnv, ts, progress, createName, createPath})
  })
// 正式环境
program
  .command('serve')
  // .alias('d')
  .description('正式环境调试')
  .option('-d, --dist <dist>', '目标 默认为 dist')
  .action(({dist}) => {
    require('../scripts/serve')({dist})
  })
// ts 类型构建
program
  .command('ts:create')
  .alias('tsc')
  .description('ts类型创建')
  .option('-n, --createName <createName>', '文件名 默认为 index.d.ts [* 使用默认值更方便同步]')
  .option('-p, --createPath <createPath>', '相对命令行目录 默认为 dist')
  //
  .action(({createName, createPath}) => {
    require('../scripts/typescript')('create', {createName, createPath})
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
  .command('init <template> <projectName>')
  .description('初始化 emp 项目')
  .action((template, projectName) => {
    require('../helpers/downloadRepo')(require('../config/template.json')[template], `./${projectName}`, '')
    console.log('初始化完成，请输入:')
    console.log(`cd ${projectName} && yarn && yarn dev`)
  })

// 执行命令
program.parse(process.argv)
