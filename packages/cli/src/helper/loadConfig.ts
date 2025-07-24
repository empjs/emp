import fs from 'node:fs'
import {createJiti} from 'jiti'
import path from 'path'
// import {glob} from 'src/helper'
import store from 'src/store'
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
export const loadConfig = createJiti(__filename, {
  // esmResolve: true,
  // disable require cache to support restart CLI and read the new config
  // requireCache: false,
  interopDefault: true,
  // debug: true,
})

export const getEmpConfigPath = async () => {
  logger.time('[store]GetEmpConfigPath')
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
  logger.timeEnd('[store]GetEmpConfigPath')
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
