import ts from 'typescript'
import fs from 'fs-extra'
import path from 'path'
import logger from 'src/helper/logger'

function getTSConfigPath(cwd: string) {
  const configPath = ts.findConfigFile(cwd, ts.sys.fileExists, 'tsconfig.json')
  return configPath
}

function getTSConfig(cwd: string): ts.CompilerOptions | undefined {
  const tsconfigPath = getTSConfigPath(cwd)
  if (!tsconfigPath) {
    throw new Error("Could not find a valid 'tsconfig.json'.")
  }

  try {
    /**
     * 由于 tsconfig.json 内容可以是 JavaScript 对象，
     * 不一定是JSON，所以需要 eval 执行。
     * 如果通过 require 方式引入，格式不符合 JSON 则会根据格式报错，
     */
    const tsconfigStr = fs.readFileSync(tsconfigPath, 'utf8')
    const tsconfig = eval(`module.exports = ${tsconfigStr}`)
    // return tsconfig.compilerOptions
    // console.log('tsconfig', tsconfig)
    return tsconfig
  } catch (error) {
    logger.error(error)
  }
}

/**
 * 读文件的配置
 */
const parseConfigHost = {
  fileExists: fs.existsSync,
  readDirectory: ts.sys.readDirectory,
  readFile: function (file: string) {
    return fs.readFileSync(file, 'utf8')
  },
  useCaseSensitiveFileNames: true,
}

/**
 * 获取文件名
 * @param cwd
 * @returns
 */
function getFileNames(cwd: string) {
  const tsconfigPath = getTSConfigPath(cwd)
  const tsconfig = getTSConfig(cwd)

  if (tsconfigPath) {
    const parsed = ts.parseJsonConfigFileContent(tsconfig, parseConfigHost, path.dirname(tsconfigPath))
    return parsed.fileNames
  }
  return []
}

export {getTSConfigPath, getTSConfig, getFileNames}
