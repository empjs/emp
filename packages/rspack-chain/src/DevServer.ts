import ChainedMap from './ChainedMap'
import ChainedSet from './ChainedSet'

interface DevServerConfig {
  allowedHosts?: string[]
  after?: Function
  before?: Function
  bonjour?: boolean
  clientLogLevel?: string
  color?: boolean
  compress?: boolean
  contentBase?: string | string[] | boolean
  disableHostCheck?: boolean
  filename?: string
  headers?: object
  historyApiFallback?: boolean | object
  host?: string
  hot?: boolean
  hotOnly?: boolean
  http2?: boolean
  https?: boolean | object
  index?: string
  info?: boolean
  inline?: boolean
  lazy?: boolean
  mimeTypes?: object
  noInfo?: boolean
  open?: boolean | string
  openPage?: string | string[]
  overlay?: boolean | object
  pfx?: string
  pfxPassphrase?: string
  port?: number
  proxy?: object | object[]
  progress?: boolean
  public?: string
  publicPath?: string
  quiet?: boolean
  setup?: Function
  socket?: string
  sockHost?: string
  sockPath?: string
  sockPort?: string | number
  staticOptions?: object
  stats?: string | boolean | object
  stdin?: boolean
  useLocalIp?: boolean
  watchContentBase?: boolean
  watchOptions?: object
  writeToDisk?: boolean | Function
  [key: string]: any
}

export default class DevServer<P = any> extends ChainedMap<any, P> {
  allowedHosts: ChainedSet<string, this>

  constructor(parent: P) {
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

  after(value: Function): this {
    return this.set('after', value)
  }

  before(value: Function): this {
    return this.set('before', value)
  }

  bonjour(value: boolean): this {
    return this.set('bonjour', value)
  }

  clientLogLevel(value: string): this {
    return this.set('clientLogLevel', value)
  }

  color(value: boolean): this {
    return this.set('color', value)
  }

  compress(value: boolean): this {
    return this.set('compress', value)
  }

  contentBase(value: string | string[] | boolean): this {
    return this.set('contentBase', value)
  }

  disableHostCheck(value: boolean): this {
    return this.set('disableHostCheck', value)
  }

  filename(value: string): this {
    return this.set('filename', value)
  }

  headers(value: object): this {
    return this.set('headers', value)
  }

  historyApiFallback(value: boolean | object): this {
    return this.set('historyApiFallback', value)
  }

  host(value: string): this {
    return this.set('host', value)
  }

  hot(value: boolean): this {
    return this.set('hot', value)
  }

  hotOnly(value: boolean): this {
    return this.set('hotOnly', value)
  }

  http2(value: boolean): this {
    return this.set('http2', value)
  }

  https(value: boolean | object): this {
    return this.set('https', value)
  }

  index(value: string): this {
    return this.set('index', value)
  }

  info(value: boolean): this {
    return this.set('info', value)
  }

  inline(value: boolean): this {
    return this.set('inline', value)
  }

  lazy(value: boolean): this {
    return this.set('lazy', value)
  }

  mimeTypes(value: object): this {
    return this.set('mimeTypes', value)
  }

  noInfo(value: boolean): this {
    return this.set('noInfo', value)
  }

  open(value: boolean | string): this {
    return this.set('open', value)
  }

  openPage(value: string | string[]): this {
    return this.set('openPage', value)
  }

  overlay(value: boolean | object): this {
    return this.set('overlay', value)
  }

  pfx(value: string): this {
    return this.set('pfx', value)
  }

  pfxPassphrase(value: string): this {
    return this.set('pfxPassphrase', value)
  }

  port(value: number): this {
    return this.set('port', value)
  }

  proxy(value: object | object[]): this {
    return this.set('proxy', value)
  }

  progress(value: boolean): this {
    return this.set('progress', value)
  }

  public(value: string): this {
    return this.set('public', value)
  }

  publicPath(value: string): this {
    return this.set('publicPath', value)
  }

  quiet(value: boolean): this {
    return this.set('quiet', value)
  }

  setup(value: Function): this {
    return this.set('setup', value)
  }

  socket(value: string): this {
    return this.set('socket', value)
  }

  sockHost(value: string): this {
    return this.set('sockHost', value)
  }

  sockPath(value: string): this {
    return this.set('sockPath', value)
  }

  sockPort(value: string | number): this {
    return this.set('sockPort', value)
  }

  staticOptions(value: object): this {
    return this.set('staticOptions', value)
  }

  stats(value: string | boolean | object): this {
    return this.set('stats', value)
  }

  stdin(value: boolean): this {
    return this.set('stdin', value)
  }

  useLocalIp(value: boolean): this {
    return this.set('useLocalIp', value)
  }

  watchContentBase(value: boolean): this {
    return this.set('watchContentBase', value)
  }

  watchOptions(value: object): this {
    return this.set('watchOptions', value)
  }

  writeToDisk(value: boolean | Function): this {
    return this.set('writeToDisk', value)
  }

  toConfig(): DevServerConfig {
    const entryPoints = this.allowedHosts.values()

    return this.clean(
      Object.assign(this.entries() || {}, {
        allowedHosts: entryPoints.length ? entryPoints : undefined,
      }),
    ) as DevServerConfig
  }

  override merge(obj: any, omit: string[] = []): this {
    if (!omit.includes('allowedHosts') && 'allowedHosts' in obj) {
      this.allowedHosts.merge(obj.allowedHosts)
    }

    return super.merge(obj, [...omit, 'allowedHosts'])
  }
}
