import {Compiler} from '@empjs/cli'
import {importJsVm} from 'src/helper'
import type {EMPSHARERuntimeOptions} from './types'

const getShareRuntimeEntry = url => {
  const content = [`import '${url}'`].join('\n')
  return importJsVm(content)
}
// 当没有设置 runtimeLib 时候需要内置
export class EmpShareRemoteLibPlugin {
  options: EMPSHARERuntimeOptions
  constructor(op: EMPSHARERuntimeOptions) {
    this.options = op
  }
  apply(compiler: Compiler) {
    const {webpack} = compiler
    const entry = getShareRuntimeEntry('@empjs/share/library')
    new webpack.EntryPlugin(compiler.context, entry, {
      name: undefined,
    }).apply(compiler)
  }
}
