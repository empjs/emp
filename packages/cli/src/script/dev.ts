import {type RspackOptions, rspack} from '@rspack/core'
import chokidar from 'chokidar'
import fs from 'fs'
import {logger} from 'src/helper'
import {printBuildDone, printBuildStart} from 'src/helper/buildPrint'
import {setupCompilerWatcher} from 'src/helper/compilerWatcher'
import {getEmpConfigCandidatePaths} from 'src/helper/loadConfig'
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
      // 显示构建开始提示
      printBuildStart('DevServer')

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
      this.addCloseHook(() => watcher.cleanup())

      if (isRestart) {
        logger.debug(`[EMP] Dev server restarted successfully`)
      }
    } catch (error) {
      logger.error(`[EMP] Failed to ${isRestart ? 'restart' : 'start'} dev server:`, error)
    }
  }

  private watchConfigFile() {
    const configPaths = getEmpConfigCandidatePaths(process.cwd())
    const existingConfigPath = store.rootPaths.empConfig
    if (!existingConfigPath) return

    logger.debug(`[EMP] Watching for changes in ${existingConfigPath}...`)
    let previousContent = fs.readFileSync(existingConfigPath, 'utf-8')

    const configWatcher = chokidar.watch(configPaths, {
      ignored: /(^|[/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true,
    })
    this.addCloseHook(() => configWatcher.close())
    configWatcher.on('change', async filePath => {
      // 检查文件内容是否有实际变化（避免空保存触发重启）
      const currentContent = fs.readFileSync(filePath, 'utf-8')
      if (filePath === existingConfigPath && previousContent === currentContent) {
        logger.debug(`[EMP] 配置文件无实际变更（空保存），跳过重启`)
        return
      }

      previousContent = currentContent
      logger.debug(`[EMP] Config file changed: ${filePath}`)

      // 清除require缓存，确保重新加载配置文件
      Object.keys(require.cache).forEach(id => {
        if (id.includes('emp.config') || id.includes('emp-config')) {
          delete require.cache[id]
        }
      })

      // 重启服务
      logger.debug(`[EMP] 配置文件已变更，正在重启服务...`)
      // 执行所有清理钩子
      await this.executeCloseHooks()
      await empDevServer.close()
      await store.setup()
      logger.debug('[EMP] 重启服务完成，新配置如下:', store.empConfig.debug)
      await this.startDevServer(true) // 以重启模式启动服务器
      this.watchConfigFile()
    })
  }

  override async run() {
    // 首次启动开发服务器
    await this.startDevServer(false)

    // 启动配置文件监听
    this.watchConfigFile()
  }
}

export default new DevScript()
