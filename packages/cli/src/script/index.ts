import process from 'node:process'
import {program} from 'commander'
// import logger from 'src/helper/logger'
// import {vCompare} from 'src/helper/utils'
// import store from 'src/store'
import pkg from '../../package.json'
import {normalizeCliOptions, registerCommonOptions, registerEnvOption, registerUnsupportedCommand} from './options'
export default async function runScript() {
  program.version(pkg.version, '-v, --version').usage('<command> [options]')
  program.helpOption('-h, --help', '显示帮助')
  /**
   * 调试
   */
  registerCommonOptions(program.command('dev').description('Dev 模式'))
    .option('-H, --hot', '是否使用热更新，默认启动')
    .option('-o, --open', '是否打开调试页面 默认不打开')
    .action(async o => {
      const {default: devScript} = await import('src/script/dev')
      await devScript.setup('dev', normalizeCliOptions(o))
    })
  /**
   * 构建编译
   */
  registerCommonOptions(program.command('build').description('Build 模式'))
    .option('-a, --analyze', '生成分析报告，默认 false')
    .option('-w, --watch', 'watch 模式')
    .option('-sv, --serve', 'watch 模式下启动 serve')
    .action(async o => {
      const {default: buildScript} = await import('src/script/build')
      await buildScript.setup('build', normalizeCliOptions(o))
    })
  /**
   * Production 环境调试
   */
  registerEnvOption(
    program
      .command('serve')
      .description('Server 模式')
      .option('-cl, --clearLog <clearLog>', '清空日志，默认 true')
      .option('-e, --env <env>', '部署环境 dev、test、prod'),
  )
    .action(async o => {
      const {default: serveScript} = await import('src/script/serve')
      await serveScript.setup('serve', normalizeCliOptions(o))
    })

  /**
   * Agent-first 创建项目
   */
  program
    .command('create <intent>')
    .description('创建 EMP 新项目')
    .option('--dir <dir>', '目标目录，默认 emp-app')
    .option('--dry-run', '只输出将要生成的文件，不写入磁盘')
    .option('--skip-install', '跳过依赖安装')
    .option('--skip-dev', '跳过自动启动')
    .option('--skip-verify', '跳过自动验证')
    .option('--json', '输出 JSON 结果')
    .action(async (intentText, o) => {
      const {runCreateCommand} = await import('src/script/create')
      await runCreateCommand(intentText, o)
    })

  /**
   * 拉取 remote d.ts
   */
  registerUnsupportedCommand(program, 'dts', '拉取 remote 项目的 d.ts')

  /**
   * 初始化项目
   */
  registerUnsupportedCommand(program, 'init', '初始化 emp 项目')
  //执行命令
  program.parse(process.argv)
}
