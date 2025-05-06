import type {Compiler} from '@rspack/core'
// import {rspack} from '@rspack/core'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import {importJsVm} from 'src/helper/utils'
import store from 'src/store'
import type {InjectTagsType} from 'src/types/config'
// const HtmlWebpackPlugin: typeof rspack.HtmlRspackPlugin = rspack.HtmlRspackPlugin
export {HtmlWebpackPlugin}
//
export function getPolyfillEntry() {
  const content = [`import 'core-js/${store.empConfig.build.polyfill.coreJsFeatures}'`].join('\n')
  return importJsVm(content)
}
export class EmpPolyfillPlugin {
  constructor() {}

  apply(compiler: Compiler) {
    const {webpack} = compiler
    if (!store.empConfig.build.polyfill.entryCdn) {
      new webpack.EntryPlugin(compiler.context, getPolyfillEntry(), {
        name: undefined,
      }).apply(compiler)
    }
    //
    // compiler.options.entry = store.deepAssign(compiler.options.entry, {
    //   coreJs: {
    //     import: [getPolyfillEntry()],
    //     library: {
    //       name: 'CoreJs',
    //       type: 'iife',
    //     },
    //   },
    // })
    // console.log('compiler.options.entry', compiler.options.entry)
  }
}
//

export class HtmlEmpInjectPlugin {
  PluginName = `HtmlEmpInjectPlugin`
  chunk = ''
  files: InjectTagsType = []
  constructor(files: InjectTagsType, name = '', chunk = '') {
    this.PluginName = `${this.PluginName}-${name}`
    this.files = files
    this.chunk = chunk
  }
  apply(compiler: any) {
    compiler.hooks.compilation.tap(this.PluginName, (compilation: any) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapPromise(this.PluginName, async data => {
        // HtmlWebpackPlugin.getCompilationHooks(compilation).alterAssetTagGroups.tapAsync(this.PluginName, (data, cb) => {
        // 过滤 chunk
        if (this.chunk && !data.plugin.userOptions.chunks?.includes(this.chunk)) return data
        this.files.map(f => {
          const {pos, ...tagInfo} = f
          const posTags = pos === 'body' ? data.bodyTags : data.headTags
          posTags.push({
            attributes: {},
            voidTag: false,
            meta: {
              plugin: undefined,
            },
            tagName: 'script',
            ...tagInfo,
          })
        })
        return data
      })
    })
  }
}
