import {RquireBuildOptions} from 'src/config/build'
import {MFOptions} from 'src/types/moduleFederation'
import {getTSConfig} from './getTSConfig'
import {getTSService} from './getTSService'
import path from 'path'
import ts from 'typescript'
import store from 'src/helper/store'
import logger from 'src/helper/logger'
import fs from 'fs-extra'
//
export type DTSTLoadertype = {
  build: RquireBuildOptions
  mf?: MFOptions
}
type CodeObjType = {
  code: string
  key: string[]
}
class DTSEmitFile {
  build?: RquireBuildOptions
  mf?: MFOptions
  outDir: string
  languageService: ts.LanguageService
  lib: CodeObjType = {code: '', key: []}
  emp: CodeObjType = {code: '', key: []}
  tsconfig: ts.CompilerOptions
  constructor() {
    this.tsconfig = getTSConfig(store.root) || {}
    this.outDir = path.resolve(store.root, 'dist/empShareTypes')
    this.languageService = getTSService(
      {
        ...this.tsconfig,
        declaration: true,
        emitDeclarationOnly: true,
        outDir: this.outDir,
      },
      store.root,
    )
  }
  setup({build, mf}: DTSTLoadertype) {
    this.build = build
    this.mf = mf
    const outDir = path.resolve(store.root, build.typesOutDir)
    if (outDir != this.outDir) {
      this.outDir = outDir
      this.languageService = getTSService(
        {
          ...this.tsconfig,
          declaration: true,
          emitDeclarationOnly: true,
          outDir: this.outDir,
        },
        store.root,
      )
    }
    fs.removeSync(this.outDir)
  }
  emit(filename: string) {
    const output = this.languageService.getEmitOutput(filename)
    try {
      if (!output.emitSkipped) {
        output.outputFiles.forEach(o => {
          if (o.name.endsWith('.d.ts')) {
            this.libCode(o)
          }
        })
      }
    } catch (e) {
      logger.warn('[emp dts]', filename, e)
    }
  }
  createFile() {
    if (!this.build) return
    // console.log('[this.lib.code]', this.lib.code)
    fs.ensureDirSync(this.outDir)
    const outFilename = path.resolve(this.outDir, `${this.build.typesAppName}.d.ts`)
    fs.writeFileSync(outFilename, this.lib.code, 'utf8')
    this.destroy()
  }
  libCode(o: ts.OutputFile) {
    if (!this.lib.key.includes(o.name)) {
      const mod = o.name.replace(`${this.outDir}/`, '').replace('.d.ts', '')
      this.lib.code = this.lib.code + this.warpDeclareModule(mod, o.text)
      this.lib.key.push(o.name)
    }
  }
  /**
   * 包裹出 declare 表达式块
   * @param name 项目名
   * @param module 模块路径
   * @param text 声明内容
   * @returns
   */
  warpDeclareModule(module: string, code: string) {
    code = code.replace(/declare/g, '')
    return `declare module '${module}' {\r\n${code}}\r\n`
  }
  destroy() {
    this.lib = {code: '', key: []}
    this.emp = {code: '', key: []}
  }
}
export default new DTSEmitFile()
