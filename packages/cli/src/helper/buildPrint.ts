import fs from 'node:fs'
import path from 'node:path'
import type {Stats, StatsAsset} from '@rspack/core'
import chalk from 'chalk'
import {gzipSizeSync} from 'gzip-size'
import {blue, gray, green, magenta, red, white, yellow} from 'src/helper/color'
import store from 'src/store'
import logger from './logger'
import {timeFormat} from './utils'
// RegExp
export const HTML_REGEX = /\.html$/
export const JS_REGEX = /\.(?:js|mjs|cjs|jsx)$/
export const TS_REGEX = /\.(?:ts|mts|cts|tsx)$/
export const SCRIPT_REGEX = /\.(?:js|jsx|mjs|cjs|ts|tsx|mts|cts)$/
export const TS_AND_JSX_REGEX = /\.(?:ts|tsx|jsx|mts|cts)$/
export const SVG_REGEX = /\.svg$/
export const CSS_REGEX = /\.css$/
export const LESS_REGEX = /\.less$/
export const SASS_REGEX = /\.s(?:a|c)ss$/
export const CSS_MODULES_REGEX = /\.module\.\w+$/i
export const NODE_MODULES_REGEX = /[\\/]node_modules[\\/]/

export const filterAsset = (asset: string) => !/\.map$/.test(asset) && !/\.LICENSE\.txt$/.test(asset)

const getAssetColor = (size: number) => {
  if (size > 300 * 1000) {
    return red
  }
  if (size > 100 * 1000) {
    return yellow
  }
  return white
}
const formatAsset = (asset: StatsAsset) => {
  const fileName = asset.name.split('?')[0]
  const sizeLabel = calcFileSize(asset.size)
  const name = path.basename(fileName)
  const folder = path.join(path.basename(store.empConfig.build.outDir), path.dirname(fileName))
  const contents = fs.readFileSync(path.join(store.empConfig.build.outDir, fileName))
  const size = contents.length
  const gzippedSize = gzipSizeSync(contents)
  const gzipSizeLabel = getAssetColor(gzippedSize)(calcFileSize(gzippedSize))
  return {
    size,
    folder,
    name,
    gzippedSize,
    sizeLabel,
    gzipSizeLabel,
  }
}

function printHeader(longestFileLength: number, longestLabelLength: number) {
  const longestLengths = [longestFileLength, longestLabelLength]
  const headerRow = ['File', 'Size', 'Gzipped'].reduce((prev, cur, index) => {
    const length = longestLengths[index]
    let curLabel = cur
    if (length) {
      curLabel = cur.length < length ? cur + ' '.repeat(length - cur.length) : cur
    }
    return `${prev + curLabel}    `
  }, '  ')

  console.log(blue.bold(headerRow))
}
const calcFileSize = (len: number) => {
  const val = len / 1000
  return `${val.toFixed(val < 1 ? 2 : 1)} kB`
}
const coloringAssetName = (assetName: string) => {
  if (JS_REGEX.test(assetName)) {
    return yellow(assetName)
  }
  if (CSS_REGEX.test(assetName)) {
    return green(assetName)
  }
  if (HTML_REGEX.test(assetName)) {
    return blue(assetName)
  }
  return magenta(assetName)
}

export async function printFileSizes(stats: Stats) {
  //
  const origin = stats.toJson({
    all: false,
    assets: true,
    timings: true,
  })
  //
  // timeDone(origin.time)
  //
  const filteredAssets = origin.assets!.filter(asset => filterAsset(asset.name))
  const assets = filteredAssets.map(formatAsset)
  assets.sort((a, b) => a.size - b.size)
  //   console.log('filteredAssets', assets)
  //   assets.map(a => {
  //     console.log(a.name, calcFileSize(a.size))
  //   })
  const longestLabelLength = Math.max(...assets.map(a => a.sizeLabel.length))
  const longestFileLength = Math.max(...assets.map(a => (a.folder + path.sep + a.name).length))
  //
  printHeader(longestFileLength, longestLabelLength)
  //
  let totalSize = 0
  let totalGzipSize = 0
  assets.forEach(asset => {
    let {sizeLabel} = asset
    const {name, folder, gzipSizeLabel} = asset
    const fileNameLength = (folder + path.sep + name).length
    const sizeLength = sizeLabel.length

    totalSize += asset.size
    totalGzipSize += asset.gzippedSize

    if (sizeLength < longestLabelLength) {
      const rightPadding = ' '.repeat(longestLabelLength - sizeLength)
      sizeLabel += rightPadding
    }

    let fileNameLabel = gray(asset.folder + path.sep) + coloringAssetName(asset.name)

    if (fileNameLength < longestFileLength) {
      const rightPadding = ' '.repeat(longestFileLength - fileNameLength)
      fileNameLabel += rightPadding
    }

    logger.info(`  ${fileNameLabel}    ${gray(sizeLabel)}    ${gzipSizeLabel}`)
  })
  //   console.log(longestLabelLength, longestFileLength)
  const totalSizeLabel = `${blue.bold('Total size:')}  ${calcFileSize(totalSize)}`
  const gzippedSizeLabel = `${blue.bold('Gzipped size:')}  ${calcFileSize(totalGzipSize)}`
  logger.info(`\n  ${totalSizeLabel}\n  ${gzippedSizeLabel}\n`)
  logger.info(`${chalk.green('ready  ')}Built in ${timeFormat(Number(origin.time))}\n`)
}
/**
 * 统一的打印函数，用于显示不同类型的构建消息
 * @param type 消息类型: 'start' | 'ready'
 * @param message 要显示的消息
 */
function printMessage(type: 'start' | 'ready', message: string) {
  const prefix = type === 'start' ? chalk.cyan('start  ') : chalk.green('ready  ')
  console.log(prefix + chalk.white(message))
}

export function timeDone(mis: number | string = 0, tips = 'Ready') {
  logger.info(`${chalk.green('ready  ')}${tips} in ${timeFormat(Number(mis))}`)
}

/**
 * 显示构建开始提示
 */
export function printBuildStart(actionName = 'build') {
  printMessage('start', `${actionName} Started...`)
}

/**
 * 显示构建完成提示
 * @param stats 构建统计信息
 */
export function printBuildDone(stats: any) {
  const data = stats?.toJson({all: false, colors: false, assets: false, chunks: false, timings: true})
  printMessage('ready', `built in ${chalk.bold((data.time / 1000).toFixed(2))} s`)
}

/**
 * 显示模块构建开始提示
 * @param moduleId 模块ID
 * @param moduleCache 可选的模块缓存
 */
export function printModuleBuildStart(moduleId: string, moduleCache?: Map<string, number>) {
  if (moduleId.includes('/src/') && !moduleId.includes('node_modules')) {
    const relativePath = moduleId.split('/src/').pop() || ''
    if (relativePath) {
      printMessage('start', 'building ' + chalk.dim('src/' + relativePath))
    }
  }
}

/**
 * 记录构建开始
 * @param message 可选的自定义消息
 */
export function logStart(message = 'build started...') {
  printMessage('start', message)
}

/**
 * 记录构建完成
 * @param stats 构建统计信息或构建时间（毫秒）
 * @param message 可选的自定义消息前缀
 */
export function logDone(stats: any | number, message = 'built') {
  let timeInSeconds: string

  if (typeof stats === 'number') {
    // 如果传入的是毫秒数
    timeInSeconds = (stats / 1000).toFixed(2)
  } else {
    // 如果传入的是stats对象
    const data = stats?.toJson({all: false, colors: false, assets: false, chunks: false, timings: true})
    timeInSeconds = (data.time / 1000).toFixed(2)
  }

  printMessage('ready', `${message} in ${chalk.bold(timeInSeconds)} s`)
}
