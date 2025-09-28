import type {Compiler} from '@rspack/core'
import chalk from 'chalk'
import path from 'path'
import type {DevServer} from '../server/connect/dev'
import {logDone, logStart} from './buildPrint'

// 源文件过滤条件
const SRC_FILE_REGEX = /\/src\//
const NODE_MODULES_REGEX = /node_modules/

/**
 * 格式化文件路径，使其更易读
 */
function formatFileList(files: string[], context: string): string[] {
  return files.map(file => {
    // 将绝对路径转换为相对于项目根目录的路径
    const relativePath = path.relative(context, file)
    return chalk.dim(path.dirname(relativePath) + path.sep) + chalk.cyan(path.basename(relativePath))
  })
}

export function setupCompilerWatcher(compiler: Compiler, devServer: DevServer) {
  const HOOK_NAME = 'emp:compiler'

  // 用于跟踪当前构建周期中已处理的模块
  const processedModules = new Set<string>()

  // 用于存储文件的最后修改时间
  const fileTimestamps = new Map<string, number>()

  // 是否有文件被修改的标志
  let hasModifiedFiles = false

  // 用于存储懒加载的模块
  const lazyModules = new Set<string>()

  // 编译状态
  let isCompiling = false

  // 项目根目录
  const context = compiler.options.context || process.cwd()

  /**
   * 检测文件是否为源代码文件
   */
  const isSourceFile = (filePath: string): boolean => {
    return SRC_FILE_REGEX.test(filePath) && !NODE_MODULES_REGEX.test(filePath)
  }

  /**
   * 获取变更的文件列表，避免重复处理同一个文件
   */
  const getChangedFiles = (compiler: any): {changed: Set<string>; removed: Set<string>} => {
    const changed = new Set<string>()
    const removed = new Set<string>()

    // 使用Rspack/Webpack 5的modifiedFiles和removedFiles API
    if (compiler.modifiedFiles || compiler.removedFiles) {
      // 处理修改的文件
      if (compiler.modifiedFiles) {
        for (const file of compiler.modifiedFiles) {
          // 只处理源代码文件
          if (isSourceFile(file)) {
            // 检查文件是否已经在当前编译周期中处理过
            const lastProcessedTime = fileTimestamps.get(file) || 0
            const currentTime = Date.now()

            // 如果文件在短时间内被多次修改，只处理一次
            // 使用300ms作为防抖时间
            if (currentTime - lastProcessedTime > 300) {
              changed.add(file)
              fileTimestamps.set(file, currentTime)
            }
          }
        }
      }

      // 处理删除的文件
      if (compiler.removedFiles) {
        for (const file of compiler.removedFiles) {
          if (isSourceFile(file)) {
            removed.add(file)
            // 从时间戳记录中删除
            fileTimestamps.delete(file)
          }
        }
      }

      return {changed, removed}
    }

    // 兼容旧版本
    if (compiler.watchFileSystem?.watcher) {
      const watcher = compiler.watchFileSystem.watcher
      const mtimes = watcher.mtimes || {}

      for (const filePath of Object.keys(mtimes)) {
        if (!isSourceFile(filePath)) continue

        const mtime = mtimes[filePath]
        const oldTime = fileTimestamps.get(filePath) || 0
        const currentTime = Date.now()

        // 防抖处理
        if (oldTime < mtime && currentTime - oldTime > 300) {
          changed.add(filePath)
          fileTimestamps.set(filePath, currentTime)
        }
      }
    }

    return {changed, removed}
  }

  /**
   * 打印构建日志
   */
  function printBuildLog(changedFiles: Set<string>, removedFiles: Set<string>) {
    if (!devServer.isServerStarted) return

    const changedList = Array.from(changedFiles)
    const removedList = Array.from(removedFiles)
    const lazyList = Array.from(lazyModules)

    // 如果没有文件变更，不打印日志
    if (changedList.length === 0 && removedList.length === 0 && lazyList.length === 0) {
      return
    }

    let message = ''

    // 格式化并添加修改的文件
    if (changedList.length > 0) {
      const formattedFiles = formatFileList(changedList, context)
      message += `modified ${formattedFiles.join(', ')}`
    }

    // 格式化并添加懒加载的模块
    if (lazyList.length > 0) {
      const formattedLazy = formatFileList(lazyList, context)
      message += `lazyLoaded ${formattedLazy.join(', ')}`
    }

    // 格式化并添加删除的文件
    if (removedList.length > 0) {
      const formattedRemoved = formatFileList(removedList, context)
      message += `removed ${formattedRemoved.join(', ')}`
    }

    // 打印构建开始信息
    logStart(message)
  }

  // 监听编译开始，重置状态
  compiler.hooks.watchRun.tap(HOOK_NAME, (compiler: any) => {
    // 避免重复触发
    if (isCompiling) return
    isCompiling = true

    // 清空当前构建周期的处理记录
    processedModules.clear()
    lazyModules.clear()

    // 获取变更的文件
    const {changed, removed} = getChangedFiles(compiler)
    hasModifiedFiles = changed.size > 0 || removed.size > 0

    // 打印构建日志
    if (hasModifiedFiles) {
      printBuildLog(changed, removed)
    }

    // 将变更的文件添加到处理列表
    changed.forEach(filePath => processedModules.add(filePath))
  })

  // 监听构建完成
  compiler.hooks.done.tap(HOOK_NAME, stats => {
    // 只有在服务器启动完成且有文件被修改时才处理
    if (!devServer.isServerStarted || !hasModifiedFiles) {
      isCompiling = false
      return
    }

    // 确保每次构建只打印一次完成信息
    if (processedModules.size > 0 || lazyModules.size > 0) {
      logDone(stats)
      // 重置标志
      hasModifiedFiles = false
    }

    // 重置编译状态
    isCompiling = false
  })

  return {
    cleanup: () => {
      processedModules.clear()
      fileTimestamps.clear()
      lazyModules.clear()
      hasModifiedFiles = false
      isCompiling = false
    },
  }
}
