import {RquireBuildOptions} from 'src/config/build'
import {MFOptions} from 'src/types/moduleFederation'
import {getTSConfig} from './getTSConfig'
import {getTSService} from './getTSService'
import path from 'path'
import ts from 'typescript'
import store from 'src/helper/store'
// import logger from 'src/helper/logger'
import fs from 'fs-extra'
import {transformExposesPath, transformImportExposesPath, transformLibName, transformPathImport} from './transform'
import {ConfigResolveAliasType} from 'src/types'
import {getVueTsService} from './getVueTsService'
import {parse} from '@vue/compiler-sfc'

//
export type DTSTLoadertype = {
  build: RquireBuildOptions
  mf?: MFOptions
  needClear?: boolean
  appSrc?: string
}
export type DTSOptionsType = {
  alias: ConfigResolveAliasType
  typesOutDir: string
  appAbsSrc: string
  appSrc: string
  build: RquireBuildOptions
  mf: MFOptions
  needClear: boolean
  pkgName: string
}
type CodeObjType = {
  code: string
  key: string[]
}
class DTSEmitFile {
  outDir: string
  languageService: ts.LanguageService
  vueLanguageService: ts.LanguageService
  lib: CodeObjType = {code: '', key: []}
  tsconfig: ts.CompilerOptions
  empFilename = ''
  libFilename = ''
  op!: DTSOptionsType
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
    this.vueLanguageService = getVueTsService(this.tsconfig, store.root)
  }
  setup(op: DTSOptionsType) {
    this.op = op
    const outDir = path.resolve(store.root, this.op.build.typesOutDir)
    if (outDir != this.outDir) {
      this.outDir = outDir
      this.tsconfig.outDir = outDir
      this.languageService = getTSService(this.tsconfig, store.root)
    }
    this.op.needClear && fs.removeSync(this.outDir)
  }
  async emit(filename: string) {
    let output: ts.EmitOutput
    if (filename.endsWith('.vue')) {
      const content = await fs.promises.readFile(filename, 'utf-8')
      const sfc = parse(content)
      const {script, scriptSetup} = sfc.descriptor
      if (script || scriptSetup) {
        const lang = scriptSetup?.lang || script?.lang || 'js'
        if (/jsx?/.test(lang)) {
          return
        }
        output = this.vueLanguageService.getEmitOutput(`${filename}.${lang}`)
      } else {
        return
      }
    } else {
      output = this.languageService.getEmitOutput(filename)
    }

    try {
      if (!output.emitSkipped) {
        output.outputFiles.forEach(o => {
          if (o.name.endsWith('.d.ts')) {
            this.genCode(o)
          }
        })
      }
    } catch (e) {
      console.warn('[emp dts]', filename, e)
    }
  }
  createFile() {
    if (!this.op.build) return
    fs.ensureDirSync(this.outDir)

    if (this.op.build.lib) {
      const libModName = this.op.build.lib.name || this.op.pkgName
      let libCode = this.lib.code
      libCode = transformLibName(libModName, libCode, this.op)
      this.libFilename = path.resolve(this.outDir, this.op.build.typesLibName)
      // console.log('this.libFilename, libCode', this.libFilename, libCode)
      fs.writeFileSync(this.libFilename, libCode, 'utf8')
    }
    if (this.op.mf?.exposes) {
      const empModName = this.op.mf.name || ''
      let empCode = this.lib.code
      // console.log(this.build.typesEmpName, empModName, empCode)
      empCode = transformLibName(empModName, empCode, this.op)
      this.empFilename = path.resolve(this.outDir, this.op.build.typesEmpName)
      // console.log('this.empFilename', this.empFilename)
      fs.writeFileSync(this.empFilename, empCode, 'utf8')
    }
    this.destroy()
  }

  genCode(o: ts.OutputFile) {
    if (!this.op.build) return
    if (!this.lib.key.includes(o.name)) {
      let mod = o.name.split(`/${this.op.build.typesOutDir}/`)[1].replace(/(\.vue)?\.d\.ts/, '')
      if (mod.endsWith('/index')) {
        mod = mod.replace('/index', '')
      }
      //切换 alias路径
      o.text = transformPathImport(o, this.op)
      // console.log('genCode', o)
      const warpDeclareModuleResult = this.warpDeclareModule(mod, o.text)
      this.lib.code = this.lib.code + warpDeclareModuleResult.code
      this.lib.code = transformImportExposesPath(this.lib.code, mod, warpDeclareModuleResult.exposeName)
      this.lib.key.push(o.name)
    }
  }
  warpDeclareModule(module: string, code: string) {
    code = code.replace(/declare/g, '')
    const {newModule, isExpose} = transformExposesPath(module, this.op)
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
