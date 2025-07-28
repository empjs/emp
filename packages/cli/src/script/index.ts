import process from 'node:process'
import {program} from 'commander'
// import logger from 'src/helper/logger'
// import {vCompare} from 'src/helper/utils'
// import store from 'src/store'
import pkg from '../../package.json'
export default async function runScript() {
  program.version(pkg.version, '-v, --version').usage('<command> [options]')
  /**
   * 调试
   */
  program
    .command('dev')
    .description('Dev 模式')
    .option('-e, --env <env>', '部署环境 dev、test、prod')
    .option('-rd, --doctor', '开启rsdoctor,可通过debug.rsdoctor操作')
    .option('-h, --hot', '是否使用热更新 默认启动')
    .option('-o, --open', '是否打开调试页面 默认不打开')
    .option('-t, --ts', '生成类型文件 默认为 false')
    .option('-pr, --profile', '统计模块消耗')
    .option('-cl, --clearLog <clearLog>', '清空日志 默认为 true')
    .option(
      '-ev, --env-vars <key=value>',
      '定义一个环境变量 -ev key=value 多个环境变量重复调用 -ev key=value -ev key=value',
      (ovalue: string, memo: Record<string, string>) => {
        const [key, value] = ovalue.split('=')
        memo[key] = value
        return memo
      },
      {},
    )
    .action(async o => {
      const {default: devScript} = await import('src/script/dev')
      await devScript.setup('dev', o)
    })
  /**
   * 构建编译
   */
  program
    .command('build')
    .description('Build 模式')
    .option('-e, --env <env>', '部署环境 dev、test、prod')
    .option('-rd, --doctor', '开启rsdoctor,可通过debug.rsdoctor操作')
    .option('-a, --analyze', '生成分析报告 默认为 false')
    .option('-t, --ts', '生成类型文件 默认为 false')
    .option('-pr, --profile', '统计模块消耗')
    .option('-cl, --clearLog <clearLog>', '清空日志 默认为 true')
    .option('-w, --watch', 'watch 模式')
    .option('-sv, --serve', 'watch 模式下启动serve')
    .option(
      '-ev, --env-vars <key=value>',
      '定义一个环境变量 -ev key=value 多个环境变量重复调用 -ev key=value -ev key=value',
      (ovalue: string, memo: Record<string, string>) => {
        const [key, value] = ovalue.split('=')
        memo[key] = value
        return memo
      },
      {},
    )
    .action(async o => {
      const {default: buildScript} = await import('src/script/build')
      await buildScript.setup('build', o)
    })
  /**
   * Production 环境调试
   */
  program
    .command('serve')
    .description('Server 模式')
    .option('-cl, --clearLog <clearLog>', '清空日志 默认为 true')
    .action(async o => {
      const {default: serveScript} = await import('src/script/serve')
      await serveScript.setup('serve', o)
    })

  /**
   * 拉取 remote d.ts
   */
  program
    .command('dts')
    .description('拉取 remote 项目的 d.ts')
    .option('-p, --typingsPath <typingsPath>', '下载目录')
    .option('-e, --env <env>', '部署环境 dev、test、prod')
    .action(o => {
      // exec('dts', 'none', o, pkg)
    })

  /**
   * 初始化项目
   */
  program
    .command('init')
    .description('初始化 emp 项目')
    // .option('-t, --template <template>', '模版文件URL')
    .option('-d, --data [data]', 'JSON数据 http地址 或者 文件路径相对、绝对路径')
    .action(o => {
      // exec('init', 'none', o, pkg)
    })
  //执行命令
  program.parse(process.argv)
  // 拓展指令行
  return program
}
