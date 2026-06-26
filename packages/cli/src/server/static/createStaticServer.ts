import fs from 'node:fs'
import fsp from 'node:fs/promises'
import http from 'node:http'
import https from 'node:https'
import path from 'node:path'
import {parse} from 'node:url'
import {
  brotliCompressSync,
  constants as zlibConstants,
  gzipSync,
} from 'node:zlib'
import connect from 'connect'
import cors from 'cors'
import {getLanIp} from 'src/helper/utils'
import type {StaticServeOptions, StaticServerHandle, StaticServeUrls} from './types'

const defaultHost = '0.0.0.0'
const gzipMinBytes = 48
const brotliMinBytes = 50

const contentTypes: Record<string, string> = {
  '.br': 'application/octet-stream',
  '.css': 'text/css; charset=utf-8',
  '.eot': 'application/vnd.ms-fontobject',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.otf': 'font/otf',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

const compressibleMediaTypes = new Set([
  'application/javascript',
  'application/json',
  'application/manifest+json',
  'application/wasm',
  'image/svg+xml',
  'font/otf',
  'font/ttf',
  'font/woff',
  'text/css',
  'text/html',
  'text/javascript',
  'text/plain',
])

function defaultResourcePath(fileName: string) {
  const currentDir = path.dirname(new URL(import.meta.url).pathname)
  const candidates = [
    path.resolve(currentDir, '../../../resource', fileName),
    path.resolve(currentDir, '../../../../resource', fileName),
  ]
  const found = candidates.find(candidate => fs.existsSync(candidate))
  if (!found) throw new Error(`EMP static HTTPS resource is missing: ${fileName}`)
  return found
}

function normalizeRoot(root: string) {
  return path.resolve(process.cwd(), root)
}

function toBrowserHost(host: string) {
  return host === '0.0.0.0' || host === '::' ? 'localhost' : host
}

function createUrls({protocol, host, port}: {protocol: 'http' | 'https'; host: string; port: number}): StaticServeUrls {
  const lanIp = getLanIp()
  const browserHost = toBrowserHost(host)
  return {
    localUrlForBrowser: `${protocol}://${browserHost}:${port}/`,
    localUrlForTerminal: `${protocol}://localhost:${port}/`,
    lanUrlForTerminal: `${protocol}://${lanIp}:${port}/`,
  }
}

async function resolveHttpsOptions(options: StaticServeOptions) {
  const keyPath = options.key ? path.resolve(process.cwd(), options.key) : defaultResourcePath('emp.key')
  const certPath = options.cert ? path.resolve(process.cwd(), options.cert) : defaultResourcePath('emp.cert')
  const [key, cert] = await Promise.all([fsp.readFile(keyPath), fsp.readFile(certPath)])
  return {key, cert}
}

function contentTypeFor(filePath: string) {
  return contentTypes[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream'
}

function isCompressible(contentType: string) {
  const mediaType = contentType.split(';')[0].trim().toLowerCase()
  return compressibleMediaTypes.has(mediaType)
}

function hasNoTransform(headers?: Record<string, string>) {
  const value = Object.entries(headers ?? {}).find(([key]) => key.toLowerCase() === 'cache-control')?.[1]
  return value?.toLowerCase().includes('no-transform') ?? false
}

function chooseEncoding(acceptEncoding: string, body: Buffer) {
  const accepted = acceptEncoding
    .split(',')
    .map(item => item.trim().split(';')[0])
    .filter(Boolean)
  if (accepted.includes('br') && body.byteLength >= brotliMinBytes) return 'br'
  if (accepted.includes('gzip') && body.byteLength >= gzipMinBytes) return 'gzip'
  return ''
}

function compressLikeCloudflare(body: Buffer, contentType: string, acceptEncoding: string, headers?: Record<string, string>) {
  if (!isCompressible(contentType) || hasNoTransform(headers)) {
    return {body, encoding: ''}
  }
  const encoding = chooseEncoding(acceptEncoding, body)
  if (encoding === 'br') {
    return {
      body: Buffer.from(
        brotliCompressSync(body, {
          params: {
            [zlibConstants.BROTLI_PARAM_QUALITY]: 4,
          },
        }),
      ),
      encoding,
    }
  }
  if (encoding === 'gzip') {
    return {body: Buffer.from(gzipSync(body, {level: 8})), encoding}
  }
  return {body, encoding: ''}
}

async function getRequestFile(root: string, url = '') {
  const pathname = parse(url).pathname || '/'
  const decodedPath = decodeURIComponent(pathname)
  const relativePath = decodedPath === '/' ? 'index.html' : decodedPath.replace(/^\/+/, '')
  const filePath = path.resolve(root, relativePath)
  if (!filePath.startsWith(root + path.sep) && filePath !== root) return ''
  const stat = await fsp.stat(filePath).catch(() => undefined)
  if (!stat?.isFile()) return ''
  return filePath
}

async function readBodyForRequest(root: string, url: string | undefined, spa: StaticServeOptions['spa']) {
  const filePath = await getRequestFile(root, url)
  if (filePath) {
    return {statusCode: 200, filePath, body: await fsp.readFile(filePath)}
  }
  if (spa) {
    const entry = typeof spa === 'string' ? spa : 'index.html'
    const spaPath = path.resolve(root, entry)
    return {statusCode: 200, filePath: spaPath, body: await fsp.readFile(spaPath)}
  }
  return {statusCode: 404, filePath: '', body: Buffer.alloc(0)}
}

export async function startStaticServer(options: StaticServeOptions): Promise<StaticServerHandle> {
  const root = normalizeRoot(options.root)
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    throw new Error(`Static root does not exist: ${root}`)
  }

  const app = connect()
  if (options.cors) app.use(cors())

  app.use(async (req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.statusCode = 404
      res.end()
      return
    }

    try {
      const result = await readBodyForRequest(root, req.url, options.spa)
      const contentType = result.filePath ? contentTypeFor(result.filePath) : 'text/plain; charset=utf-8'
      const headers = options.headers ?? {}
      let responseBody: Uint8Array = result.body
      let encoding = ''

      if (result.statusCode === 200 && options.compression !== false) {
        const compressed = compressLikeCloudflare(
          result.body,
          contentType,
          String(req.headers['accept-encoding'] ?? ''),
          headers,
        )
        responseBody = compressed.body
        encoding = compressed.encoding
      }

      res.statusCode = result.statusCode
      res.setHeader('Content-Type', contentType)
      res.setHeader('Vary', 'Accept-Encoding')
      for (const [key, value] of Object.entries(headers)) {
        res.setHeader(key, value)
      }
      if (encoding) {
        res.setHeader('Content-Encoding', encoding)
      }
      res.setHeader('Content-Length', responseBody.byteLength)
      res.end(req.method === 'HEAD' ? undefined : responseBody)
    } catch (error) {
      res.statusCode = 500
      res.end(error instanceof Error ? error.message : String(error))
    }
  })

  const protocol = options.https ? 'https' : 'http'
  const server = options.https ? https.createServer(await resolveHttpsOptions(options), app) : http.createServer(app)
  const requestedPort = options.port ?? 0
  const host = options.host ?? defaultHost

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(requestedPort, host, () => resolve())
  })

  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : requestedPort
  const urls = createUrls({protocol, host, port})

  return {
    server,
    root,
    host,
    port,
    protocol,
    urls,
    close: () =>
      new Promise((resolve, reject) => {
        server.close(error => (error ? reject(error) : resolve()))
      }),
  }
}
