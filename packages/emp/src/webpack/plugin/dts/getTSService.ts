import ts from 'typescript'
import fs from 'fs-extra'
import {getFileNames} from './getTSConfig'

/**
 * 缓存，缓存 TS 编译的结果
 */
const cache: {
  program?: ts.Program
  languageService?: ts.LanguageService
  fileNameMapping: Record<string, string>
  cwd: string
} = {fileNameMapping: {}, cwd: ''}

/**
 * 创建 TS 服务,并且根据 .ts & .tsx 文件编译出 d.ts
 * Typescript 文档:
 * https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API#incremental-build-support-using-the-language-services
 * @param options
 * @param cwd
 * @returns
 */
function getTSService(options: ts.CompilerOptions, cwd: string) {
  if (cache.languageService && cache.cwd === cwd) {
    return cache.languageService
  }
  cache.cwd = cwd
  const rootFileNames = getFileNames(cwd)

  const files: ts.MapLike<{version: number}> = {}

  // initialize the list of files
  rootFileNames.forEach(fileName => {
    files[fileName] = {version: 0}
  })

  const servicesHost: ts.LanguageServiceHost = {
    getScriptFileNames: () => rootFileNames,
    getScriptVersion: fileName => files[fileName] && files[fileName].version.toString(),
    getScriptSnapshot: fileName => {
      if (!fs.existsSync(fileName)) {
        return undefined
      }

      return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString())
    },
    getCurrentDirectory: () => cwd,
    getCompilationSettings: () => options,
    getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    directoryExists: ts.sys.directoryExists,
    getDirectories: ts.sys.getDirectories,
  }

  const languageService = ts.createLanguageService(servicesHost, ts.createDocumentRegistry())
  cache.languageService = languageService

  return languageService
}

export {getTSService}
