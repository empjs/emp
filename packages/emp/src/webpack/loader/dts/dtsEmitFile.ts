import {RquireBuildOptions} from 'src/config/build'
import {MFOptions} from 'src/types/moduleFederation'
import {getTSConfig} from './getTSConfig'
import {getTSService} from './getTSService'
import webpack from 'webpack'
import path from 'path'
import ts from 'typescript'
import store from 'src/helper/store'
import logger from 'src/helper/logger'

export type DTSTLoadertype = {
  build: RquireBuildOptions
  moduleFederation: MFOptions
}
type CodeObjType = {
  code: string
  key: string[]
}
class DTSEmitFile {
  build?: RquireBuildOptions
  mf?: MFOptions
  outDir: string
  context?: webpack.LoaderContext<Partial<DTSTLoadertype>>
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
  setup(context: webpack.LoaderContext<Partial<DTSTLoadertype>>, {build, moduleFederation}: DTSTLoadertype) {
    this.context = context
    this.build = build
    this.mf = moduleFederation
    const outDir = path.resolve(context.rootContext, build.typesOutDir)
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
  }
  emit() {
    if (!this.context) return
    const filename = this.context.resourcePath
    const output = this.languageService.getEmitOutput(filename)
    try {
      if (!output.emitSkipped) {
        output.outputFiles.forEach(o => {
          if (o.name.endsWith('.d.ts')) {
            this.libCode(o)
          }
        })
        console.log('[this.lib.code]', this.lib.code)
      }
    } catch (e) {
      logger.warn('[emp dts]', filename, e)
    }
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
}
export default new DTSEmitFile()
