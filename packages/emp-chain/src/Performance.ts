import ChainedMap from './ChainedMap'

export default class Performance extends ChainedMap {
  constructor(parent: any) {
    super(parent)
  }

  assetFilter(value: (assetFilename: string) => boolean): this {
    return this.set('assetFilter', value)
  }

  hints(value: 'warning' | 'error' | false): this {
    return this.set('hints', value)
  }

  maxAssetSize(value: number): this {
    return this.set('maxAssetSize', value)
  }

  maxEntrypointSize(value: number): this {
    return this.set('maxEntrypointSize', value)
  }
}
