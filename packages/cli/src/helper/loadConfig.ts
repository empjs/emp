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

export const getEmpConfigCandidatePaths = (root = store.root) =>
  DEFAULT_CONFIG_FILES.map(filename => path.resolve(root, filename))

/**
 * 配置文件的两套拼写：连字符版 emp-config.* 与点号版 emp.config.*。
 * 两套共用同一份候选列表，靠顺序区分优先级。
 */
export const CONFIG_FILE_FAMILIES = ['emp-config', 'emp.config'] as const

export const getConfigFileFamily = (configPath: string) => {
  const filename = path.basename(configPath)
  return CONFIG_FILE_FAMILIES.find(family => filename.startsWith(`${family}.`))
}

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

/**
 * 在给定根目录下按 `DEFAULT_CONFIG_FILES` 顺序查找 emp 配置文件。
 *
 * 同一目录同时存在连字符版（`emp-config.*`）与点号版（`emp.config.*`）时直接报错：
 * 旧行为是按候选顺序取第一份、另一份被静默忽略，属于最难排查的配置失效路径。
 */
export const findEmpConfigPath = async (root: string) => {
  const paths = getEmpConfigCandidatePaths(root)
  const exists = await Promise.all(
    paths.map(p =>
      fs.promises.access(p).then(
        () => true,
        () => false,
      ),
    ),
  )
  const found = paths.filter((_, i) => exists[i])
  const families = new Set(found.map(p => getConfigFileFamily(p)).filter(Boolean))
  if (families.size > 1) {
    throw new Error(
      [
        '检测到两种拼写的 emp 配置文件同时存在，无法判断应以哪一份为准：',
        ...found.map(p => `  - ${path.relative(root, p)}`),
        '请只保留一份，推荐 emp.config.ts。',
      ].join('\n'),
    )
  }
  return found[0]
}

export const getEmpConfigPath = async () => {
  const timeTag = 'store.getEmpConfigPath'
  logger.time(timeTag)
  try {
    return await findEmpConfigPath(store.root)
  } finally {
    logger.timeEnd(timeTag)
  }
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
