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
  tsconfig: ts.CompilerOptions
  empFilename = ''
  libFilename = ''
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
  setup({build, mf}: DTSTLoadertype) {
    this.build = build
    this.mf = mf
    const outDir = path.resolve(store.root, build.typesOutDir)
    if (outDir != this.outDir) {
      this.outDir = outDir
      this.tsconfig.outDir = outDir
      this.languageService = getTSService(this.tsconfig, store.root)
    }
    fs.removeSync(this.outDir)
  }
  emit(filename: string) {
    const output = this.languageService.getEmitOutput(filename)
    try {
      if (!output.emitSkipped) {
        output.outputFiles.forEach(o => {
          if (o.name.endsWith('.d.ts')) {
            this.genCode(o)
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
      this.libFilename = path.resolve(this.outDir, `${this.build.typesLibName}.d.ts`)
      fs.writeFileSync(this.libFilename, libCode, 'utf8')
    }
    if (this.mf?.exposes) {
      const empModName = this.mf.name || ''
      let empCode = this.lib.code
      empCode = transformLibName(empModName, empCode)
      this.empFilename = path.resolve(this.outDir, `${this.build.typesEmpName}.d.ts`)
      fs.writeFileSync(this.empFilename, empCode, 'utf8')
    }
    this.destroy()
  }

  genCode(o: ts.OutputFile) {
    if (!this.build) return
    if (!this.lib.key.includes(o.name)) {
      let mod = o.name.split(`/${this.build.typesOutDir}/`)[1].replace('.d.ts', '')
      if (mod.endsWith('/index')) {
        mod = mod.replace('/index', '')
      }
      o.text = transformPathImport(o)
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
