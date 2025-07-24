import ChainedMap from './ChainedMap'

export default class Performance extends ChainedMap {
  constructor(parent: any) {
    super(parent)
    this.extend(['assetFilter', 'hints', 'maxAssetSize', 'maxEntrypointSize'])
  }
}
