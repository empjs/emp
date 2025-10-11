import fs from 'node:fs'
import {createJiti} from 'jiti'
import path from 'path'
// import {glob} from 'src/helper'
import store from 'src/store'
import pkg from '../../package.json'
import logger from './logger'
//
export const DEFAULT_CONFIG_FILES = [
  'emp-config.ts',
  'emp-config.js',
  'emp.config.ts',
  'emp.config.js',
  //
  'emp-config.mjs',
  'emp-config.cjs',
  'emp-config.mts',
  'emp-config.cts',
  //
  'emp.config.mjs',
  'emp.config.cjs',
  'emp.config.mts',
  'emp.config.cts',
]

//
// console.log('pkg.version', pkg.version)
export const loadConfig = createJiti(__filename, {
  // 启用默认导出兼容性
  interopDefault: true,
  // 启用文件系统缓存以提高性能
  fsCache: true,
  // 启用模块缓存集成
  moduleCache: true,
  cacheVersion: pkg.version,
  // debug: true,
  // tryNative: true,
  // nativeModules: ['@rspack/core', 'typescript'],
})

export const getEmpConfigPath = async () => {
  const timeTag = 'store.getEmpConfigPath'
  logger.time(timeTag)
  const paths = DEFAULT_CONFIG_FILES.map(filename => path.resolve(store.root, filename))
  const exists = await Promise.all(
    paths.map(p =>
      fs.promises.access(p).then(
        () => true,
        () => false,
      ),
    ),
  )
  const empConfigPath = paths.find((_, i) => exists[i])
  logger.timeEnd(timeTag)
  return empConfigPath
}

export const getTsConfig = async () => {
  let tsconfig: string | undefined = path.join(store.root, 'tsconfig.json')
  const exists = await fs.promises.access(tsconfig).then(
    () => true,
    () => false,
  )
  if (!exists) {
    tsconfig = undefined
  }
  return tsconfig
}

export const getBuildDependencies = () => {
  const entries: string[] = [__filename]
  if (store.rootPaths.pkg) {
    entries.push(store.rootPaths.pkg)
  }
  if (store.rootPaths.empConfig) {
    entries.push(store.rootPaths.empConfig)
  }
  if (store.rootPaths.tsConfig) {
    entries.push(store.rootPaths.tsConfig)
  }
  return entries
}
