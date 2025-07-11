import ChainedMap from './ChainedMap'
import Plugin from './Plugin'

interface OptimizationConfig {
  minimizer?: any[]
  concatenateModules?: boolean
  flagIncludedChunks?: boolean
  mergeDuplicateChunks?: boolean
  minimize?: boolean
  namedChunks?: boolean
  namedModules?: boolean
  nodeEnv?: string | false
  noEmitOnErrors?: boolean
  occurrenceOrder?: boolean
  portableRecords?: boolean
  providedExports?: boolean
  removeAvailableModules?: boolean
  removeEmptyChunks?: boolean
  runtimeChunk?: string | boolean | object
  sideEffects?: boolean
  splitChunks?: object
  usedExports?: boolean
  [key: string]: any
}

export default class Optimization<P = any> extends ChainedMap<any, P> {
  minimizers: ChainedMap<any, this>

  constructor(parent: P) {
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

  minimizer(name: string) {
    if (Array.isArray(name)) {
      throw new Error(
        'optimization.minimizer() no longer supports being passed an array. ' +
          'Either switch to the new syntax (https://github.com/neutrinojs/webpack-chain#config-optimization-minimizers-adding) or downgrade to webpack-chain 4. ' +
          'If using Vue this likely means a Vue plugin has not yet been updated to support Vue CLI 4+.',
      )
    }

    return this.minimizers.getOrCompute(name, () => new Plugin(this, name, 'optimization.minimizer'))
  }

  concatenateModules(value: boolean): this {
    return this.set('concatenateModules', value)
  }

  flagIncludedChunks(value: boolean): this {
    return this.set('flagIncludedChunks', value)
  }

  mergeDuplicateChunks(value: boolean): this {
    return this.set('mergeDuplicateChunks', value)
  }

  minimize(value: boolean): this {
    return this.set('minimize', value)
  }

  namedChunks(value: boolean): this {
    return this.set('namedChunks', value)
  }

  namedModules(value: boolean): this {
    return this.set('namedModules', value)
  }

  nodeEnv(value: string | false): this {
    return this.set('nodeEnv', value)
  }

  noEmitOnErrors(value: boolean): this {
    return this.set('noEmitOnErrors', value)
  }

  occurrenceOrder(value: boolean): this {
    return this.set('occurrenceOrder', value)
  }

  portableRecords(value: boolean): this {
    return this.set('portableRecords', value)
  }

  providedExports(value: boolean): this {
    return this.set('providedExports', value)
  }

  removeAvailableModules(value: boolean): this {
    return this.set('removeAvailableModules', value)
  }

  removeEmptyChunks(value: boolean): this {
    return this.set('removeEmptyChunks', value)
  }

  runtimeChunk(value: string | boolean | object): this {
    return this.set('runtimeChunk', value)
  }

  sideEffects(value: boolean): this {
    return this.set('sideEffects', value)
  }

  splitChunks(value: object): this {
    return this.set('splitChunks', value)
  }

  usedExports(value: boolean): this {
    return this.set('usedExports', value)
  }

  toConfig(): OptimizationConfig {
    return this.clean(
      Object.assign(this.entries() || {}, {
        minimizer: this.minimizers.values().map(plugin => plugin.toConfig()),
      }),
    ) as OptimizationConfig
  }

  override merge(obj: any, omit: string[] = []): this {
    if (!omit.includes('minimizer') && 'minimizer' in obj) {
      Object.keys(obj.minimizer).forEach(name => this.minimizer(name).merge(obj.minimizer[name]))
    }

    return super.merge(obj, [...omit, 'minimizer'])
  }
}
