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

  program
    .command('static [root]')
    .description('Static file server for local CDN and dist debugging')
    .option('--host <host>', '服务 host，默认 0.0.0.0')
    .option('-p, --port <port>', '服务端口，默认随机可用端口')
    .option('--cors', '启用 Access-Control-Allow-Origin: *')
    .option('--spa [entry]', '启用 SPA fallback，默认 index.html')
    .option('--https', '使用 EMP 默认证书启动 HTTPS')
    .option('--cert <cert>', 'HTTPS cert 文件路径')
    .option('--key <key>', 'HTTPS key 文件路径')
    .option('--headers <headers...>', '追加响应头，格式 key=value')
    .option('--compression <mode>', '压缩模式，默认 cloudflare；可设 none 关闭')
    .option('-o, --open', '打开浏览器')
    .option('--json', '输出 JSON')
    .action(async (root, o) => {
      const {runStaticCommand} = await import('src/script/static')
      await runStaticCommand(root, o)
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
