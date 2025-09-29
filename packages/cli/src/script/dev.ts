import {type RspackOptions, rspack} from '@rspack/core'
import chalk from 'chalk'
import chokidar from 'chokidar'
import fs from 'fs'
import path from 'path'
import {logger} from 'src/helper'
import {printBuildDone, printBuildStart, timeDone} from 'src/helper/buildPrint'
import {setupCompilerWatcher} from 'src/helper/compilerWatcher'
import {deepAssign} from 'src/helper/utils'
import {BaseScript} from 'src/script/base'
import {DevServer} from 'src/server'
import store, {type GlobalStore} from 'src/store'

const empDevServer = new DevServer()
class DevScript extends BaseScript {
  // 用于存储关闭时需要执行的清理函数
  private closeHooks: Array<() => void> = []

  get stats() {
    return {
      all: store.empConfig.debug.devShowAllLog,
      colors: true,
      assets: false,
      chunks: false,
      entrypoints: false,
      timings: false,
      version: false,
      errors: true,
      warnings: true,
    }
  }

  private async getRspackDevConfig() {
    const cf: RspackOptions = deepAssign(store.rsConfig, {
      stats: this.stats,
      devServer: {
        open: false, // 避免打开多tab
        setupExitSignals: true,
        port: store.server.port,
      },
    })
    const {devServer}: any = cf

    // 处理HTTPS配置
    if (store.server.isHttps) {
      if (!devServer.server || (devServer.server.type === 'https' && !devServer.server.options)) {
        const {key, cert} = await store.server.getcert()
        devServer.server = {
          type: 'https',
          options: {key, cert},
        }
      }
    }

    // 移除旧的https配置
    if (Object.hasOwn(devServer, 'https')) {
      delete devServer.https
    }

    return cf
  }

  /**
   * 启动或重启开发服务器
   * @param isRestart 是否为重启操作
   */
  private async startDevServer(isRestart = false) {
    try {
      const {server} = store
      let rspackConfig = await this.getRspackDevConfig()
      rspackConfig = await empDevServer.beforeCompiler(rspackConfig)

      const compiler = rspack(rspackConfig)
      await store.empConfig.lifeCycle.beforeDevServe()
      server.startOpen()
      // 显示构建开始提示
      printBuildStart()

      await empDevServer.setup(compiler, rspackConfig, store as GlobalStore, async (o: any) => {
        empDevServer.isServerStarted = true
        printBuildDone(o)
        await store.empConfig.lifeCycle.afterDevServe()
      })
      // compiler.hooks.afterDone.tap('done', stats => {
      //   this.lastBuildTime = printBuildDone(stats, this.lastBuildTime)
      // })
      // 设置编译器监听器，监听文件修改后的全流程
      const watcher = setupCompilerWatcher(compiler, empDevServer)

      // 添加到关闭钩子中，确保资源被正确清理
      this.closeHooks.push(() => watcher.cleanup())

      if (isRestart) {
        logger.debug(`[EMP] Dev server restarted successfully`)
      }
    } catch (error) {
      logger.error(`[EMP] Failed to ${isRestart ? 'restart' : 'start'} dev server:`, error)
    }
  }

  private watchConfigFile() {
    const configPath = path.resolve(process.cwd(), 'emp.config.ts')
    if (!fs.existsSync(configPath)) return

    logger.debug(`[EMP] Watching for changes in emp.config.ts...`)
    let previousContent = fs.readFileSync(configPath, 'utf-8')

    chokidar
      .watch(configPath, {
        ignored: /(^|[/\\])\../, // ignore dotfiles
        persistent: true,
      })
      .on('change', async filePath => {
        // 检查文件内容是否有实际变化（避免空保存触发重启）
        const currentContent = fs.readFileSync(configPath, 'utf-8')
        if (previousContent === currentContent) {
          logger.debug(`[EMP] 配置文件无实际变更（空保存），跳过重启`)
          return
        }

        previousContent = currentContent
        logger.debug(`[EMP] Config file changed: ${filePath}`)

        // 清除require缓存，确保重新加载配置文件
        Object.keys(require.cache).forEach(id => {
          if (id.includes('emp.config')) {
            delete require.cache[id]
          }
        })

        // 重启服务
        logger.debug(`[EMP] 配置文件已变更，正在重启服务...`)
        // 执行所有清理钩子
        this.executeCloseHooks()
        await empDevServer.close()
        await store.setup()
        logger.debug('[EMP] 重启服务完成，新配置如下:', store.empConfig.debug)
        await this.startDevServer(true) // 以重启模式启动服务器
      })
  }

  override async run() {
    // 首次启动开发服务器
    await this.startDevServer(false)

    // 启动配置文件监听
    this.watchConfigFile()
  }

  // 记录上次构建完成时间，避免重复输出
  private lastBuildTime = 0

  /**
   * 执行所有关闭钩子函数
   */
  private executeCloseHooks() {
    if (this.closeHooks.length > 0) {
      logger.debug(`[EMP] 执行 ${this.closeHooks.length} 个Hook...`)
      for (const hook of this.closeHooks) {
        try {
          hook()
        } catch (error) {
          logger.error('[EMP] 执行清理钩子时出错:', error)
        }
      }
      // 清空钩子列表
      this.closeHooks = []
    }
  }
}

export default new DevScript()
