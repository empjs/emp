#!/usr/bin/env node
const program = require('commander') // 命令行工具
const pkg = require('../package.json')
program.version(pkg.version, '-v, --version').usage('<command> [options]')
//
program
  .command('dev')
  .description('development 模式')
  .option('-s, --src <src>', '源码目录 默认为 src')
  .option('-o, --outdir <outdir>', '源码目录 默认为 dist')
  .option('-t, --target <target>', '生产环境 默认为 es2018')
  .option('-f, --format <format>', '模块格式 默认为 cjs')
  .option('-p, --platform <platform>', '平台模式 默认为 node')
  .option('-m, --minify', '是否压缩 默认为 false')
  .option('-b, --bundle', 'bundle 模式 默认为 false')
  .option('-log, --logLevel <logLevel>', '默认为 debug')
  .option('-de, --debug', '显示调试日志 默认为 false')
  .action(d => {
    require('../index').exec('development', d)
  })
//
program
  .command('build')
  .description('build 模式')
  .option('-s, --src <src>', '源码目录 默认为 src')
  .option('-o, --outdir <outdir>', '源码目录 默认为 dist')
  .option('-t, --target <target>', '生产环境 默认为 es2018')
  .option('-f, --format <format>', '模块格式 默认为 cjs')
  .option('-p, --platform <platform>', '平台模式 默认为 node')
  .option('-m, --minify', '是否压缩 默认为 false')
  .option('-b, --bundle', 'bundle 模式 默认为 false')
  .option('-log, --logLevel <logLevel>', '默认为 debug')
  .option('-de, --debug', '显示调试日志 默认为 false')
  .action(d => {
    require('../index').exec('production', d)
  })

program.parse(process.argv)
