export interface Directory {
  type: string
  minLength: number
}

export interface StaticOptions {
  type: string
}

export interface Items {
  type: string
  minLength: number
}

export interface AnyOf {
  type: string
  minLength: number
  items: Items
  minItems?: number
}

export interface PublicPath {
  anyOf: AnyOf[]
}

export interface AnyOf2 {
  type: string
}

export interface ServeIndex {
  anyOf: AnyOf2[]
}

export interface AnyOf3 {
  type: string
}

export interface Watch {
  anyOf: AnyOf3[]
}

export interface Properties {
  directory: Directory
  staticOptions: StaticOptions
  publicPath: PublicPath
  serveIndex: ServeIndex
  watch: Watch
}

export interface StaticObject {
  type: string
  additionalProperties: boolean
  properties: Properties
}

export interface StaticString {
  type: string
  minLength: number
}

export interface Definitions {
  StaticObject: StaticObject
  StaticString: StaticString
}

export interface Bonjour {
  type: string
}

export interface Host {
  type: string
}

export interface Path {
  type: string
}

export interface AnyOf4 {
  type: string
}

export interface Port {
  anyOf: AnyOf4[]
}

export interface Logging {
  enum: string[]
}

export interface Progress {
  type: string
}

export interface Errors {
  type: string
}

export interface Warnings {
  type: string
}

export interface Properties4 {
  errors: Errors
  warnings: Warnings
}

export interface AnyOf5 {
  type: string
  properties: Properties4
}

export interface Overlay {
  anyOf: AnyOf5[]
}

export interface Properties3 {
  host: Host
  path: Path
  port: Port
  logging: Logging
  progress: Progress
  overlay: Overlay
}

export interface Client {
  type: string
  properties: Properties3
  additionalProperties: boolean
}

export interface Compress {
  type: string
}

export interface Dev {
  type: string
}

export interface Items2 {
  type: string
}

export interface AnyOf6 {
  type: string
  items: Items2
  minItems?: number
}

export interface Firewall {
  anyOf: AnyOf6[]
}

export interface Headers {
  type: string
}

export interface AnyOf7 {
  type: string
}

export interface HistoryApiFallback {
  anyOf: AnyOf7[]
}

export interface AnyOf8 {
  type: string
}

export interface Host2 {
  anyOf: AnyOf8[]
}

export interface AnyOf9 {
  type: string
  enum: string[]
}

export interface Hot {
  anyOf: AnyOf9[]
}

export interface Http2 {
  type: string
}

export interface Passphrase {
  type: string
}

export interface RequestCert {
  type: string
}

export interface AnyOf11 {
  type: string
  instanceof: string
}

export interface Ca {
  anyOf: AnyOf11[]
}

export interface AnyOf12 {
  type: string
  instanceof: string
}

export interface Key {
  anyOf: AnyOf12[]
}

export interface AnyOf13 {
  type: string
  instanceof: string
}

export interface Pfx {
  anyOf: AnyOf13[]
}

export interface AnyOf14 {
  type: string
  instanceof: string
}

export interface Cert {
  anyOf: AnyOf14[]
}

export interface Properties5 {
  passphrase: Passphrase
  requestCert: RequestCert
  ca: Ca
  key: Key
  pfx: Pfx
  cert: Cert
}

export interface AnyOf10 {
  type: string
  additionalProperties?: boolean
  properties: Properties5
}

export interface Https {
  anyOf: AnyOf10[]
}

export interface AnyOf15 {
  type: string
  instanceof: string
}

export interface InjectClient {
  anyOf: AnyOf15[]
}

export interface AnyOf16 {
  type: string
  instanceof: string
}

export interface InjectHot {
  anyOf: AnyOf16[]
}

export interface LiveReload {
  type: string
}

export interface OnAfterSetupMiddleware {
  instanceof: string
}

export interface OnBeforeSetupMiddleware {
  instanceof: string
}

export interface OnListening {
  instanceof: string
}

export interface AnyOf17 {
  type: string
}

export interface Open {
  anyOf: AnyOf17[]
}

export interface Items3 {
  type: string
}

export interface AnyOf18 {
  type: string
  items: Items3
  minItems?: number
}

export interface OpenPage {
  anyOf: AnyOf18[]
}

export interface AnyOf19 {
  type: string
}

export interface Port2 {
  anyOf: AnyOf19[]
}

export interface AnyOf21 {
  type: string
  instanceof: string
}

export interface Items4 {
  anyOf: AnyOf21[]
}

export interface AnyOf20 {
  type: string
  items: Items4
  minItems?: number
}

export interface Proxy {
  anyOf: AnyOf20[]
}

export interface Public {
  type: string
}

export interface SetupExitSignals {
  type: string
}

export interface AnyOf23 {
  $ref: string
}

export interface Items5 {
  anyOf: AnyOf23[]
}

export interface AnyOf22 {
  type: string
  $ref: string
  items: Items5
  minItems?: number
}

export interface Static {
  anyOf: AnyOf22[]
}

export interface Stdin {
  type: string
}

export interface Client2 {
  type: string
}

export interface AnyOf25 {
  type: string
  instanceof: string
}

export interface Server {
  anyOf: AnyOf25[]
}

export interface Properties6 {
  client: Client2
  server: Server
}

export interface AnyOf24 {
  type: string
  properties: Properties6
  additionalProperties: boolean
  enum: string[]
}

export interface TransportMode {
  anyOf: AnyOf24[]
}

export interface UseLocalIp {
  type: string
}
/**
      "bonjour": "should be {Boolean} (https://webpack.js.org/configuration/dev-server/#devserverbonjour)",
      "client": "should be {Object} (https://webpack.js.org/configuration/dev-server/#devserverclient)",
      "compress": "should be {Boolean} (https://webpack.js.org/configuration/dev-server/#devservercompress)",
      "dev": "should be {Object} (https://webpack.js.org/configuration/dev-server/#devserverdev-)",
      "firewall": "should be {Boolean|Array} (https://webpack.js.org/configuration/dev-server/#devserverfirewall)",
      "headers": "should be {Object} (https://webpack.js.org/configuration/dev-server/#devserverheaders)",
      "historyApiFallback": "should be {Boolean|Object} (https://webpack.js.org/configuration/dev-server/#devserverhistoryapifallback)",
      "host": "should be {String|Null} (https://webpack.js.org/configuration/dev-server/#devserverhost)",
      "hot": "should be {Boolean|String} (https://webpack.js.org/configuration/dev-server/#devserverhot)",
      "http2": "should be {Boolean} (https://webpack.js.org/configuration/dev-server/#devserverhttp2)",
      "https": "should be {Object|Boolean} (https://webpack.js.org/configuration/dev-server/#devserverhttps)",
      "injectClient": "should be {Boolean|Function} (https://webpack.js.org/configuration/dev-server/#devserverinjectclient)",
      "injectHot": "should be {Boolean|Function} (https://webpack.js.org/configuration/dev-server/#devserverinjecthot)",
      "liveReload": "should be {Boolean} (https://webpack.js.org/configuration/dev-server/#devserverlivereload)",
      "onAfterSetupMiddleware": "should be {Function} (https://webpack.js.org/configuration/dev-server/#devserverafter)",
      "onBeforeSetupMiddleware": "should be {Function} (https://webpack.js.org/configuration/dev-server/#devserverbefore)",
      "onListening": "should be {Function} (https://webpack.js.org/configuration/dev-server/#onlistening)",
      "open": "should be {String|Boolean|Object} (https://webpack.js.org/configuration/dev-server/#devserveropen)",
      "openPage": "should be {String|Array} (https://webpack.js.org/configuration/dev-server/#devserveropenpage)",
      "port": "should be {Number|String|Null} (https://webpack.js.org/configuration/dev-server/#devserverport)",
      "proxy": "should be {Object|Array} (https://webpack.js.org/configuration/dev-server/#devserverproxy)",
      "public": "should be {String} (https://webpack.js.org/configuration/dev-server/#devserverpublic)",
      "setupExitSignals": "should be {Boolean} (https://webpack.js.org/configuration/dev-server/#devserversetupexitsignals)",
      "static": "should be {Boolean|String|Object|Array} (https://webpack.js.org/configuration/dev-server/#devserverstatic)",
      "stdin": "should be {Boolean} (https://webpack.js.org/configuration/dev-server/#devserverstdin)",
      "transportMode": "should be {String|Object} (https://webpack.js.org/configuration/dev-server/#devservertransportmode)",
      "useLocalIp": "should be {Boolean} (https://webpack.js.org/configuration/dev-server/#devserveruselocalip)"
 */
export interface WebpackDevServerI {
  bonjour?: Bonjour
  client?: Client
  compress?: Compress
  dev?: Dev
  firewall?: Firewall
  headers?: Headers
  historyApiFallback?: HistoryApiFallback
  host?: Host2
  hot?: Hot
  http2?: Http2
  https?: Https
  injectClient?: InjectClient
  injectHot?: InjectHot
  liveReload?: LiveReload
  onAfterSetupMiddleware?: OnAfterSetupMiddleware
  onBeforeSetupMiddleware?: OnBeforeSetupMiddleware
  onListening?: OnListening
  open?: Open
  openPage?: OpenPage
  port?: number | string
  proxy?: Proxy
  public?: Public
  setupExitSignals?: SetupExitSignals
  static?: Static
  stdin?: Stdin
  transportMode?: TransportMode
  useLocalIp?: UseLocalIp
}
