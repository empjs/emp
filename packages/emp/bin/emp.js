#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')
const importSource = (path = 'index.js') => require(`../dist/${path}`).default

program.version(pkg.version, '-v, --version').usage('<command> [options]')
program.command('dev').action(async () => {
  const fn = importSource('script')
  fn.exec('devServer')
})
// // 构建
program.command('build').action(() => {
  const fn = importSource('script')
  fn.exec('build')
})
// // 正式环境
program.command('serve').action(() => {
  const fn = importSource('script')
  fn.exec('serve')
})

// 执行命令
program.parse(process.argv)
