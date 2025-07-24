import ChainedMap from './ChainedMap'

export default class Output extends ChainedMap {
  constructor(parent: any) {
    super(parent)
    this.extend([
      'auxiliaryComment',
      'chunkCallbackName',
      'chunkFilename',
      'chunkLoadTimeout',
      'crossOriginLoading',
      'devtoolFallbackModuleFilenameTemplate',
      'devtoolLineToLine',
      'devtoolModuleFilenameTemplate',
      'devtoolNamespace',
      'filename',
      'futureEmitAssets',
      'globalObject',
      'hashDigest',
      'hashDigestLength',
      'hashFunction',
      'hashSalt',
      'hotUpdateChunkFilename',
      'hotUpdateFunction',
      'hotUpdateMainFilename',
      'jsonpFunction',
      'library',
      'libraryExport',
      'libraryTarget',
      'path',
      'pathinfo',
      'publicPath',
      'sourceMapFilename',
      'sourcePrefix',
      'strictModuleExceptionHandling',
      'umdNamedDefine',
      'webassemblyModuleFilename',
    ])
  }
}
