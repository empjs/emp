import ChainedMap from './ChainedMap'
import Plugin from './Plugin'

export default class Optimization extends ChainedMap {
  minimizers: ChainedMap

  constructor(parent: any) {
    super(parent)
    this.minimizers = new ChainedMap(this)
    // Avoid generating any-typed shorthand methods that override typed ones below
    this.extend([])
  }

  // Provide a typed method for optimization.splitChunks
  splitChunks(
    value:
      | false
      | {
          chunks?: 'all' | 'async' | 'initial'
          minSize?: number
          minChunks?: number
          automaticNameDelimiter?: string
          cacheGroups?: Record<string, any>
          [key: string]: any
        },
  ): this {
    return this.set('splitChunks', value)
  }

  // Typed setters for common optimization fields
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

  namedChunks(value: boolean | string): this {
    return this.set('namedChunks', value)
  }

  namedModules(value: boolean | string): this {
    return this.set('namedModules', value)
  }

  nodeEnv(value: string | boolean): this {
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

  runtimeChunk(
    value:
      | boolean
      | 'single'
      | 'multiple'
      | {
          name?: string | ((entryPoint: any) => string)
        },
  ): this {
    return this.set('runtimeChunk', value)
  }

  sideEffects(value: boolean): this {
    return this.set('sideEffects', value)
  }

  usedExports(value: boolean | 'global'): this {
    return this.set('usedExports', value)
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
