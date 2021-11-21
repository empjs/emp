import chalk from 'chalk'
import path from 'path'
import fs from 'fs'
import filesize from 'filesize'
import {sync as gzipSize} from 'gzip-size'
import stripAnsi from 'strip-ansi'
import recursive from 'recursive-readdir'
import store from './store'
//
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024
//
class Reporter {
  private previousSizeMap: any
  canReadAsset(asset: string) {
    return (
      // /\.(js|css|html)$/.test(asset) &&
      !/service-worker\.js/.test(asset) && !/precache-manifest\.[0-9a-f]+\.js/.test(asset)
    )
  }
  removeFileNameHash(buildFolder: string, fileName: string) {
    return fileName
      .replace(buildFolder, '')
      .replace(/\\/g, '/')
      .replace(/\/?(.*)(\.[0-9a-f]+)(\.chunk)?(\.js|\.css)/, (match, p1, p2, p3, p4) => p1 + p4)
  }
  // Input: 1024, 2048
  // Output: "(+1 KB)"
  getDifferenceLabel(currentSize: number, previousSize: number) {
    const FIFTY_KILOBYTES = 1024 * 50
    const difference = currentSize - previousSize
    const fileSize = !Number.isNaN(difference) ? filesize(difference) : 0
    if (difference >= FIFTY_KILOBYTES) {
      return chalk.red('+' + fileSize)
    } else if (difference < FIFTY_KILOBYTES && difference > 0) {
      return chalk.yellow('+' + fileSize)
    } else if (difference < 0) {
      return chalk.green(fileSize)
    } else {
      return ''
    }
  }
  recursiveAsync(buildFolder: string) {
    return new Promise((resolve, reject) => {
      recursive(buildFolder, (e, fileNames) => {
        if (e) return reject(e)
        resolve(fileNames)
      })
    })
  }
  async measureFileSizesBeforeBuild(buildFolder = store.outDir) {
    const fileNames: any = await this.recursiveAsync(buildFolder)
    let sizes
    if (fileNames) {
      sizes = fileNames.filter(this.canReadAsset).reduce((memo: any, fileName: any) => {
        const contents = fs.readFileSync(fileName)
        const key = this.removeFileNameHash(buildFolder, fileName)
        memo[key] = gzipSize(contents)
        return memo
      }, {})
    }
    this.previousSizeMap = {
      root: buildFolder,
      sizes: sizes || {},
    }
  }
  printFileSizesAfterBuild(
    webpackStats: any,
    buildFolder = store.outDir,
    maxBundleGzipSize = WARN_AFTER_BUNDLE_GZIP_SIZE,
    maxChunkGzipSize = WARN_AFTER_CHUNK_GZIP_SIZE,
  ) {
    const {previousSizeMap} = this
    const root = previousSizeMap.root
    const sizes = previousSizeMap.sizes
    let assets = (webpackStats.stats || [webpackStats]).map((stats: any) =>
      stats
        .toJson({assets: true})
        .assets.filter((asset: any) => this.canReadAsset(asset.name))
        .map((asset: any) => {
          const fileContents = fs.readFileSync(path.join(root, asset.name))
          const size = gzipSize(fileContents)
          const previousSize = sizes[this.removeFileNameHash(root, asset.name)]
          const difference = this.getDifferenceLabel(size, previousSize)
          return {
            folder: path.join(path.basename(buildFolder), path.dirname(asset.name)),
            name: path.basename(asset.name),
            size: size,
            sizeLabel: filesize(size) + (difference ? ' (' + difference + ')' : ''),
          }
        }),
    )
    assets = assets.reduce((single: any, all: any) => all.concat(single), [])
    assets = assets.sort((a: any, b: any) => b.size - a.size)
    const longestSizeLabelLength = Math.max.apply(
      null,
      assets.map((a: any) => stripAnsi(a.sizeLabel).length),
    )
    let suggestBundleSplitting = false
    assets.forEach((asset: any) => {
      let sizeLabel = asset.sizeLabel
      const sizeLength = stripAnsi(sizeLabel).length
      if (sizeLength < longestSizeLabelLength) {
        const rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength)
        sizeLabel += rightPadding
      }
      const isMainBundle = asset.name.indexOf('main.') === 0
      const maxRecommendedSize = isMainBundle ? maxBundleGzipSize : maxChunkGzipSize
      const isLarge = maxRecommendedSize && asset.size > maxRecommendedSize
      if (isLarge && path.extname(asset.name) === '.js') {
        suggestBundleSplitting = true
      }
      console.log(
        '  ' +
          (isLarge ? chalk.yellow(sizeLabel) : sizeLabel) +
          '  ' +
          chalk.dim(asset.folder + path.sep) +
          chalk.cyan(asset.name),
      )
    })
    if (suggestBundleSplitting) {
      console.log()
      console.log(chalk.yellow('The bundle size is significantly larger than recommended.'))
      console.log(chalk.yellow('Consider reducing it with code splitting: https://goo.gl/9VhYWB'))
      console.log(chalk.yellow('You can also analyze the project dependencies: https://goo.gl/LeUzfb'))
    }
  }
}

export default new Reporter()
