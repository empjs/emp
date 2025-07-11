import ChainedMap from './ChainedMap';

export default class Output<P = any> extends ChainedMap<any, P> {
  constructor(parent: P) {
    super(parent);
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
    ]);
  }

  auxiliaryComment(value: any): this {
    return this.set('auxiliaryComment', value);
  }

  chunkCallbackName(value: string): this {
    return this.set('chunkCallbackName', value);
  }

  chunkFilename(value: string): this {
    return this.set('chunkFilename', value);
  }

  chunkLoadTimeout(value: number): this {
    return this.set('chunkLoadTimeout', value);
  }

  crossOriginLoading(value: string | boolean): this {
    return this.set('crossOriginLoading', value);
  }

  devtoolFallbackModuleFilenameTemplate(value: string): this {
    return this.set('devtoolFallbackModuleFilenameTemplate', value);
  }

  devtoolLineToLine(value: any): this {
    return this.set('devtoolLineToLine', value);
  }

  devtoolModuleFilenameTemplate(value: string): this {
    return this.set('devtoolModuleFilenameTemplate', value);
  }

  devtoolNamespace(value: string): this {
    return this.set('devtoolNamespace', value);
  }

  filename(value: string): this {
    return this.set('filename', value);
  }

  futureEmitAssets(value: boolean): this {
    return this.set('futureEmitAssets', value);
  }

  globalObject(value: string): this {
    return this.set('globalObject', value);
  }

  hashDigest(value: string): this {
    return this.set('hashDigest', value);
  }

  hashDigestLength(value: number): this {
    return this.set('hashDigestLength', value);
  }

  hashFunction(value: string): this {
    return this.set('hashFunction', value);
  }

  hashSalt(value: string): this {
    return this.set('hashSalt', value);
  }

  hotUpdateChunkFilename(value: string): this {
    return this.set('hotUpdateChunkFilename', value);
  }

  hotUpdateFunction(value: string): this {
    return this.set('hotUpdateFunction', value);
  }

  hotUpdateMainFilename(value: string): this {
    return this.set('hotUpdateMainFilename', value);
  }

  jsonpFunction(value: string): this {
    return this.set('jsonpFunction', value);
  }

  library(value: string | string[] | object): this {
    return this.set('library', value);
  }

  libraryExport(value: string | string[]): this {
    return this.set('libraryExport', value);
  }

  libraryTarget(value: string): this {
    return this.set('libraryTarget', value);
  }

  path(value: string): this {
    return this.set('path', value);
  }

  pathinfo(value: boolean): this {
    return this.set('pathinfo', value);
  }

  publicPath(value: string): this {
    return this.set('publicPath', value);
  }

  sourceMapFilename(value: string): this {
    return this.set('sourceMapFilename', value);
  }

  sourcePrefix(value: string): this {
    return this.set('sourcePrefix', value);
  }

  strictModuleExceptionHandling(value: boolean): this {
    return this.set('strictModuleExceptionHandling', value);
  }

  umdNamedDefine(value: boolean): this {
    return this.set('umdNamedDefine', value);
  }

  webassemblyModuleFilename(value: string): this {
    return this.set('webassemblyModuleFilename', value);
  }
}