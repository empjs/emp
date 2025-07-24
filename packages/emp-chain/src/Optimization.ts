import ChainedMap from './ChainedMap'
import Plugin from './Plugin'

export default class Optimization extends ChainedMap {
  minimizers: ChainedMap

  constructor(parent: any) {
    super(parent)
    this.minimizers = new ChainedMap(this)
    this.extend([
      'concatenateModules',
      'flagIncludedChunks',
      'mergeDuplicateChunks',
      'minimize',
      'namedChunks',
      'namedModules',
      'nodeEnv',
      'noEmitOnErrors',
      'occurrenceOrder',
      'portableRecords',
      'providedExports',
      'removeAvailableModules',
      'removeEmptyChunks',
      'runtimeChunk',
      'sideEffects',
      'splitChunks',
      'usedExports',
    ])
  }

  minimizer(name: string | any[]): any {
    if (Array.isArray(name)) {
      throw new Error(
        'optimization.minimizer() no longer supports being passed an array. ' +
          'Either switch to the new syntax (https://github.com/neutrinojs/webpack-chain#config-optimization-minimizers-adding) or downgrade to webpack-chain 4. ' +
          'If using Vue this likely means a Vue plugin has not yet been updated to support Vue CLI 4+.',
      )
    }

    return this.minimizers.getOrCompute(
      name as string,
      () => new Plugin(this, name as string, 'optimization.minimizer'),
    )
  }

  toConfig(): any {
    return this.clean(
      Object.assign(this.entries() || {}, {
        minimizer: this.minimizers.values().map((plugin: any) => plugin.toConfig()),
      }),
    )
  }

  override merge(obj: any, omit: string[] = []): this {
    if (!omit.includes('minimizer') && 'minimizer' in obj) {
      Object.keys(obj.minimizer).forEach(name => this.minimizer(name).merge(obj.minimizer[name]))
    }

    return super.merge(obj, [...omit, 'minimizer'])
  }
}
