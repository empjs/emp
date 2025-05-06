import fs from 'node:fs'
import path from 'node:path'
import type {Stats, StatsAsset} from '@rspack/core'
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
  logger.info(`${green('✓')} Ready in ${timeFormat(Number(origin.time))}\n`)
}
export function timeDone(mis: number | string = 0) {
  logger.info(`${green('✓')} Ready in ${timeFormat(Number(mis))}`)
}
