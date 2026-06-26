import openBrowser from 'src/helper/openBrowser'
import {startStaticServer} from 'src/server/static/createStaticServer'
import type {StaticCompressionMode, StaticHeaderMap, StaticServeOptions} from 'src/server/static/types'

export type StaticCommandOptions = {
  root?: string
  host?: string
  port?: string | number
  cors?: boolean
  spa?: boolean | string
  https?: boolean
  cert?: string
  key?: string
  headers?: string[]
  index?: string[]
  open?: boolean
  json?: boolean
  compression?: string | boolean
}

function parseHeaders(values?: string[]): StaticHeaderMap | undefined {
  if (!values || values.length === 0) return undefined
  return Object.fromEntries(
    values.map(value => {
      const separator = value.indexOf('=')
      if (separator < 1) throw new Error(`Invalid header format, expected key=value: ${value}`)
      return [value.slice(0, separator), value.slice(separator + 1)]
    }),
  )
}

function parseCompression(value: string | boolean | undefined): StaticCompressionMode {
  if (value === false || value === 'false' || value === 'off' || value === 'none') return false
  return 'cloudflare'
}

export function normalizeStaticOptions(root: string | undefined, options: StaticCommandOptions): StaticServeOptions {
  return {
    root: root || options.root || 'dist',
    host: options.host || '0.0.0.0',
    port: options.port === undefined ? 0 : Number(options.port),
    cors: !!options.cors,
    spa: options.spa,
    https: !!options.https,
    cert: options.cert,
    key: options.key,
    headers: parseHeaders(options.headers),
    index: options.index,
    compression: parseCompression(options.compression),
  }
}

export async function runStaticCommand(root: string | undefined, options: StaticCommandOptions) {
  const server = await startStaticServer(normalizeStaticOptions(root, options))
  const payload = {
    root: server.root,
    protocol: server.protocol,
    host: server.host,
    port: server.port,
    urls: server.urls,
  }

  if (options.json) {
    console.log(JSON.stringify(payload, null, 2))
  } else {
    console.log(`EMP static server`)
    console.log(`  root: ${server.root}`)
    console.log(`  local: ${server.urls.localUrlForTerminal}`)
    console.log(`  network: ${server.urls.lanUrlForTerminal}`)
  }

  if (options.open) {
    openBrowser(server.urls.localUrlForBrowser)
  }
}
