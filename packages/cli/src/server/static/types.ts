import type {Server as HttpServer} from 'node:http'
import type {Server as HttpsServer} from 'node:https'

export type StaticHeaderMap = Record<string, string>

export type StaticCompressionMode = 'cloudflare' | false

export type StaticServeOptions = {
  root: string
  host?: string
  port?: number
  cors?: boolean
  spa?: boolean | string
  https?: boolean
  cert?: string
  key?: string
  headers?: StaticHeaderMap
  compression?: StaticCompressionMode
}

export type StaticServeUrls = {
  localUrlForBrowser: string
  localUrlForTerminal: string
  lanUrlForTerminal: string
}

export type StaticServerHandle = {
  server: HttpServer | HttpsServer
  root: string
  host: string
  port: number
  protocol: 'http' | 'https'
  urls: StaticServeUrls
  close: () => Promise<void>
}
