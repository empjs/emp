import ChainedMap from './ChainedMap'
import ChainedSet from './ChainedSet'

export default class DevServer extends ChainedMap {
  allowedHosts: ChainedSet

  constructor(parent: any) {
    super(parent)

    this.allowedHosts = new ChainedSet(this)

    this.extend([
      'after',
      'before',
      'bonjour',
      'clientLogLevel',
      'color',
      'compress',
      'contentBase',
      'disableHostCheck',
      'filename',
      'headers',
      'historyApiFallback',
      'host',
      'hot',
      'hotOnly',
      'http2',
      'https',
      'index',
      'info',
      'inline',
      'lazy',
      'mimeTypes',
      'noInfo',
      'open',
      'openPage',
      'overlay',
      'pfx',
      'pfxPassphrase',
      'port',
      'proxy',
      'progress',
      'public',
      'publicPath',
      'quiet',
      'setup',
      'socket',
      'sockHost',
      'sockPath',
      'sockPort',
      'staticOptions',
      'stats',
      'stdin',
      'useLocalIp',
      'watchContentBase',
      'watchOptions',
      'writeToDisk',
    ])
  }

  toConfig(): any {
    return this.clean({
      allowedHosts: this.allowedHosts.values(),
      ...(this.entries() || {}),
    })
  }

  override merge(obj: any, omit: string[] = []): this {
    if (!omit.includes('allowedHosts') && 'allowedHosts' in obj) {
      this.allowedHosts.merge(obj.allowedHosts)
    }

    return super.merge(obj, ['allowedHosts'])
  }
}
