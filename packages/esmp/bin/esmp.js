#!/usr/bin/env node
const program = require('commander') // 命令行工具
const pkg = require('../package.json')
program.version(pkg.version, '-v, --version').usage('<command> [options]')
program
  .command('dev')
  .description('调试项目')
  .option('-e, --env <env>', '部署环境 dev、test、prod 默认为 dev')
  .option('-h, --hot', '是否使用热更新 默认不启动')
  .action(d => {
    require('../dist/cli/dev')(d)
  })

//
program
  .command('build')
  .description('构建项目')
  .option('-e, --env <env>', '部署环境 dev、test、prod 默认为 prod')
  .action(d => {
    require('../dist/cli/build')(d)
  })

program.parse(process.argv)
