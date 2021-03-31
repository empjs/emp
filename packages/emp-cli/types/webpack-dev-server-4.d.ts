export interface WebpackDevServer {
  bonjour?: boolean
  client?: Client
  compress?: boolean
  dev?: {[key: string]: any}
  firewall?: string[] | boolean
  headers?: {[key: string]: any}
  historyApiFallback?: boolean | {[key: string]: any}
  host?: null | string
  hot?: boolean | HotEnum
  http2?: boolean
  https?: boolean | HTTPSClass
  liveReload?: boolean
  onAfterSetupMiddleware?: any
  onBeforeSetupMiddleware?: any
  onListening?: any
  open?: boolean | {[key: string]: any} | string
  openPage?: string[] | string
  port?: number | null | string
  proxy?: any[] | {[key: string]: any}
  public?: string
  setupExitSignals?: boolean
  static?: Array<StaticObject | string> | boolean | StaticObject | string
  transportMode?: TransportModeClass | TransportModeEnum
}

export interface Client {
  host?: string
  logging?: Logging
  needClientEntry?: any
  needHotEntry?: any
  overlay?: boolean | OverlayObject
  path?: string
  port?: number | null | string
  progress?: boolean
}

export enum Logging {
  Error = 'error',
  Info = 'info',
  Log = 'log',
  None = 'none',
  Verbose = 'verbose',
  Warn = 'warn',
}

export interface OverlayObject {
  errors?: boolean
  warnings?: boolean
}

export enum HotEnum {
  Only = 'only',
}

export interface HTTPSClass {
  ca?: any
  cert?: any
  key?: any
  passphrase?: string
  pfx?: any
  requestCert?: boolean
}

export interface StaticObject {
  directory?: string
  publicPath?: string[] | string
  serveIndex?: boolean | {[key: string]: any}
  staticOptions?: {[key: string]: any}
  watch?: boolean | {[key: string]: any}
}

export interface TransportModeClass {
  client?: string
  server?: any
}

export enum TransportModeEnum {
  Sockjs = 'sockjs',
  Ws = 'ws',
}
