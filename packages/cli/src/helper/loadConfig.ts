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
  return fsFindByConfigFileName()
}
/* const globFindConfig = async () => {
  logger.time('getEmpConfigPath')
  const exp = path.join(store.root, `emp{-,.}config.{ts,js,mjs,cjs}`)
  const entries = (await glob([exp], {windowsPathsNoEscape: true})) || []
  logger.timeEnd('getEmpConfigPath')
  return entries[0]
} */
const fsFindByConfigFileName = () => {
  logger.time('[store]GetEmpConfigPath')
  let resolvedPath
  for (const filename of DEFAULT_CONFIG_FILES) {
    const filePath = path.resolve(store.root, filename)
    if (!fs.existsSync(filePath)) continue
    resolvedPath = filePath
    break
  }
  logger.timeEnd('[store]GetEmpConfigPath')
  return resolvedPath
}
