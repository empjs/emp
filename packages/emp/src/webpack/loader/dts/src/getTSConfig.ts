import ts from 'typescript'
import fs from 'fs-extra'
import path from 'path'

function getTSConfigPath(cwd: string) {
  const configPath = ts.findConfigFile(cwd, ts.sys.fileExists, 'tsconfig.json')
  return configPath
}

function getTSConfig(cwd: string): ts.CompilerOptions {
  const tsconfigPath = getTSConfigPath(cwd)
  if (!tsconfigPath) {
    throw new Error("Could not find a valid 'tsconfig.json'.")
  }

  const tsconfig = require(tsconfigPath)
  return tsconfig
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
