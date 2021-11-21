#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')
const importSource = (path = 'index.js') => require(`../dist/${path}`).default

program.version(pkg.version, '-v, --version').usage('<command> [options]')
program
  .command('dev')
  .description('Dev 模式')
  // .option('-s, --src <src>', '目标文件 默认为 src/index.ts')
  // .option('-pc, --public <public>', '目标 默认为 public/')
  .option('-e, --env <env>', '部署环境 dev、test、prod 默认为 dev')
  .option('-h, --hot', '是否使用热更新 默认不启动')
  .option('-o, --open', '是否打开调试页面 默认不打开')
  // .option('-t, --ts', '生成类型文件 默认为 false')
  // .option('-rm, --remote', '在执行命令时拉取远程声明文件，远程地址首选package.json里的remoteBaseUrlList')
  .option('-ps, --progress <progress>', '显示进度 默认为 true')
  .option('-pr, --profile', '统计模块消耗')
  .option('-wl, --wplogger [filename]', '打印webpack配置 默认为 false,filename 为 输出webpack配置文件')
  .action(async o => {
    const fn = importSource('cli')
    fn.exec('dev', 'development', o, pkg)
  })
// // 构建
program
  .command('build')
  .description('Build 模式')
  // .option('-s, --src <src>', '目标文件 默认为 src/index.ts')
  // .option('-d, --dist <dist>', '目标 默认为 dist/')
  // .option('-pc, --public <public>', '目标 默认为 public/')
  // .option('-dc, --doc <doc>', '目标 默认为 doc/')
  .option('-e, --env <env>', '部署环境 dev、test、prod 默认为 prod')
  .option('-a, --analyze', '生成分析报告 默认为 false')
  // .option('-t, --ts', '生成类型文件 默认为 false')
  // .option('-w, --watch', '构建调试模式 默认为 false')
  // .option('-m, --minify [minify]', '是否压缩 默认为 true')
  // .option('-n, --createName <createName>', '文件名 默认为 index.d.ts [* 使用默认值方便同步]')
  // .option('-p, --createPath <createPath>', '相对命令行目录 默认为 dist')
  .option('-ps, --progress <progress>', '显示进度 默认为 false')
  .option('-pr, --profile', '统计模块消耗')
  .option('-wl, --wplogger [filename]', '打印webpack配置 默认为 false,filename 为 输出webpack配置文件')
  .action(o => {
    const fn = importSource('cli')
    fn.exec('build', 'production', o, pkg)
  })
// // 正式环境
program
  .command('serve')
  .description('Server 模式')
  // .option('-d, --dist <dist>', '目标 默认为 dist')
  .action(o => {
    const fn = importSource('cli')
    fn.exec('serve', 'none', o, pkg)
  })

// 执行命令
program.parse(process.argv)
