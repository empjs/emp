import {type RspackOptions, rspack} from '@rspack/core'
import chokidar from 'chokidar'
import fs from 'fs'
import path from 'path'
import {logger} from 'src/helper'
import {timeDone} from 'src/helper/buildPrint'
import {deepAssign} from 'src/helper/utils'
import {BaseScript} from 'src/script/base'
import {DevServer} from 'src/server'
import store, {type GlobalStore} from 'src/store'

const empDevServer = new DevServer()
class DevScript extends BaseScript {
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

      await empDevServer.setup(compiler, rspackConfig, store as GlobalStore, async (o: any) => {
        // showPerformance 为false 时 只显示一次
        if (!store.debug.showPerformance) this.showTimeDone(o)
        await store.empConfig.lifeCycle.afterDevServe()
      })

      if (store.debug.showPerformance) {
        compiler.hooks.afterDone.tap('done', this.showTimeDone)
      }

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

  private showTimeDone = (s: any) => {
    const d = s?.toJson({all: false, colors: false, assets: false, chunks: false, timings: true})
    timeDone(d.time)
  }
}

export default new DevScript()
