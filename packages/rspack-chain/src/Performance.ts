import ChainedMap from './ChainedMap'

export default class Performance<P = any> extends ChainedMap<any, P> {
  constructor(parent: P) {
    super(parent)
    this.extend(['assetFilter', 'hints', 'maxAssetSize', 'maxEntrypointSize'])
  }

  assetFilter(value: any): this {
    return this.set('assetFilter', value)
  }

  hints(value: string | false): this {
    return this.set('hints', value)
  }

  maxAssetSize(value: number): this {
    return this.set('maxAssetSize', value)
  }

  maxEntrypointSize(value: number): this {
    return this.set('maxEntrypointSize', value)
  }
}
