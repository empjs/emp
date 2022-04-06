import {RquireBuildOptions} from 'src/config/build'
import {MFOptions} from 'src/types/moduleFederation'
import {getTSConfig} from './getTSConfig'
import {getTSService} from './getTSService'
import path from 'path'
import ts from 'typescript'
import store from 'src/helper/store'
import logger from 'src/helper/logger'
import fs from 'fs-extra'
import {transformExposesPath, transformImportExposesPath, transformLibName, transformPathImport} from './transform'
import {ConfigResolveAliasType} from 'src/types'
//
export type DTSTLoadertype = {
  build: RquireBuildOptions
  mf?: MFOptions
  needClear?: boolean
  appSrc?: string
}
type CodeObjType = {
  code: string
  key: string[]
}
class DTSEmitFile {
  build?: RquireBuildOptions = undefined
  mf?: MFOptions = undefined
  outDir: string
  languageService: ts.LanguageService
  lib: CodeObjType = {code: '', key: []}
  tsconfig: ts.CompilerOptions
  empFilename = ''
  libFilename = ''
  appSrc?: string = undefined
  constructor() {
    this.tsconfig = getTSConfig(store.root) || {}
    this.outDir = path.resolve(store.root, 'dist/empShareTypes')
    this.tsconfig = {
      ...this.tsconfig,
      declaration: true,
      emitDeclarationOnly: true,
      //
      outDir: this.outDir,
      rootDir: store.root,
      // baseUrl: store.config.appSrc,
    }
    this.languageService = getTSService(this.tsconfig, store.root)
  }
  setup({build, mf, needClear, appSrc}: DTSTLoadertype) {
    this.build = build
    this.mf = mf
    this.appSrc = appSrc
    const outDir = path.resolve(store.root, build.typesOutDir)
    if (outDir != this.outDir) {
      this.outDir = outDir
      this.tsconfig.outDir = outDir
      this.languageService = getTSService(this.tsconfig, store.root)
    }
    needClear && fs.removeSync(this.outDir)
  }
  emit(filename: string, alias: ConfigResolveAliasType, typesOutDir: string) {
    const output = this.languageService.getEmitOutput(filename)
    try {
      if (!output.emitSkipped) {
        output.outputFiles.forEach(o => {
          if (o.name.endsWith('.d.ts')) {
            this.genCode(o, alias, typesOutDir)
          }
        })
      }
    } catch (e) {
      logger.warn('[emp dts]', filename, e)
    }
  }
  createFile() {
    if (!this.build) return
    fs.ensureDirSync(this.outDir)

    if (this.build.lib) {
      const libModName = this.build.lib.name || store.pkg.name
      let libCode = this.lib.code
      libCode = transformLibName(libModName, libCode)
      this.libFilename = path.resolve(this.outDir, this.build.typesLibName)
      fs.writeFileSync(this.libFilename, libCode, 'utf8')
    }
    if (this.mf?.exposes) {
      const empModName = this.mf.name || ''
      let empCode = this.lib.code
      // console.log(this.build.typesEmpName, empModName, empCode)
      empCode = transformLibName(empModName, empCode)
      this.empFilename = path.resolve(this.outDir, this.build.typesEmpName)
      // console.log('this.empFilename', this.empFilename)
      fs.writeFileSync(this.empFilename, empCode, 'utf8')
    }
    this.destroy()
  }

  genCode(o: ts.OutputFile, alias: ConfigResolveAliasType, typesOutDir: string) {
    if (!this.build) return
    if (!this.lib.key.includes(o.name)) {
      let mod = o.name.split(`/${this.build.typesOutDir}/`)[1].replace('.d.ts', '')
      if (mod.endsWith('/index')) {
        mod = mod.replace('/index', '')
      }
      //切换 alias路径
      o.text = transformPathImport(o, alias, typesOutDir, this.appSrc)
      const warpDeclareModuleResult = this.warpDeclareModule(mod, o.text)
      this.lib.code = this.lib.code + warpDeclareModuleResult.code
      this.lib.code = transformImportExposesPath(this.lib.code, mod, warpDeclareModuleResult.exposeName)
      this.lib.key.push(o.name)
    }
  }
  warpDeclareModule(module: string, code: string) {
    code = code.replace(/declare/g, '')
    const {newModule, isExpose} = transformExposesPath(module, this.mf)
    return {
      code: `declare module '${newModule}' {\r\n${code}}\r\n`,
      exposeName: isExpose ? newModule : '',
    }
  }
  destroy() {
    this.lib = {code: '', key: []}
  }
}
export default DTSEmitFile
