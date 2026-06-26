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
const defaultIndexCandidates = ['index.html']

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
  '.ts': 'text/plain; charset=utf-8',
  '.tsx': 'text/plain; charset=utf-8',
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

function isInsideRoot(root: string, filePath: string) {
  return filePath.startsWith(root + path.sep) || filePath === root
}

function normalizeIndexCandidates(index?: string[]) {
  const candidates = index?.length ? index : defaultIndexCandidates
  return candidates.map(candidate => candidate.trim()).filter(Boolean)
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let size = bytes / 1024
  let unit = units.shift() ?? 'KB'
  while (size >= 1024 && units.length > 0) {
    size /= 1024
    unit = units.shift() ?? unit
  }
  return `${size.toFixed(size >= 10 ? 0 : 1)} ${unit}`
}

function browserPathFor(root: string, directoryPath: string) {
  const relativePath = path.relative(root, directoryPath)
  if (!relativePath) return '/'
  return `/${relativePath.split(path.sep).map(encodeURIComponent).join('/')}/`
}

function extensionLabel(fileName: string, isDirectory: boolean) {
  if (isDirectory) return 'DIR'
  const extension = path.extname(fileName).slice(1).toUpperCase()
  return extension || 'FILE'
}

function extensionColorClass(label: string, isDirectory: boolean) {
  if (isDirectory) return 'emp-static-kind-dir'
  return `emp-static-kind-${label.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`
}

function renderStaticSvgIcon(isDirectory: boolean) {
  if (isDirectory) {
    return `<svg class="emp-static-svg" viewBox="0 0 44 36" fill="none" aria-hidden="true">
      <path d="M4.5 10.5h13l3.4 4.6h18.6v14.4a3 3 0 0 1-3 3h-32a3 3 0 0 1-3-3v-16a3 3 0 0 1 3-3Z" fill="currentColor" opacity=".16"/>
      <path d="M4.5 8.5h12.2l3.4 4.5h19.4v16.5a3 3 0 0 1-3 3h-32a3 3 0 0 1-3-3v-18a3 3 0 0 1 3-3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`
  }
  return `<svg class="emp-static-svg" viewBox="0 0 36 44" fill="none" aria-hidden="true">
    <path d="M8.5 3.5h13.8L31.5 13v23.5a4 4 0 0 1-4 4h-19a4 4 0 0 1-4-4v-29a4 4 0 0 1 4-4Z" fill="currentColor" opacity=".08"/>
    <path d="M22 3.8V12a2 2 0 0 0 2 2h7.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8.5 3.5h13.8L31.5 13v23.5a4 4 0 0 1-4 4h-19a4 4 0 0 1-4-4v-29a4 4 0 0 1 4-4Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
  </svg>`
}

async function renderDirectoryIndex(root: string, directoryPath: string) {
  const browserPath = browserPathFor(root, directoryPath)
  const entries = await fsp.readdir(directoryPath, {withFileTypes: true})
  const cards = await Promise.all(
    entries
      .sort((left, right) => {
        if (left.isDirectory() !== right.isDirectory()) return left.isDirectory() ? -1 : 1
        return left.name.localeCompare(right.name)
      })
      .map(async entry => {
        const filePath = path.join(directoryPath, entry.name)
        const stat = await fsp.stat(filePath)
        const name = `${entry.name}${entry.isDirectory() ? '/' : ''}`
        const href = `${browserPath}${encodeURIComponent(entry.name)}${entry.isDirectory() ? '/' : ''}`
        const label = extensionLabel(entry.name, entry.isDirectory())
        const colorClass = extensionColorClass(label, entry.isDirectory())
        const type = entry.isDirectory() ? 'Directory' : label
        const size = entry.isDirectory() ? '-' : formatBytes(stat.size)
        const modified = stat.mtime.toISOString().replace('T', ' ').slice(0, 19)
        return `<a class="emp-static-card" href="${href}">
          <span class="${entry.isDirectory() ? 'emp-static-folder-card' : 'emp-static-file-card'} ${colorClass}">
            <span class="emp-static-icon">${renderStaticSvgIcon(entry.isDirectory())}</span>
            <span class="emp-static-badge">${escapeHtml(label)}</span>
          </span>
          <span class="emp-static-name">${escapeHtml(name)}</span>
          <span class="emp-static-meta"><b>Type</b>${escapeHtml(type)}</span>
          <span class="emp-static-meta"><b>Size</b>${escapeHtml(size)}</span>
          <span class="emp-static-meta emp-static-modified"><b>Modified</b>${escapeHtml(modified)}</span>
        </a>`
      }),
  )

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>EMP Static Index ${escapeHtml(browserPath)}</title>
  <style>
    :root { color-scheme: light; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif; }
    body { margin: 0; min-height: 100vh; background: #f5f5f7; color: #1d1d1f; }
    .emp-static-index { max-width: 1180px; margin: 0 auto; padding: 38px 24px 56px; }
    .emp-static-shell { background: rgba(255, 255, 255, 0.86); border: 1px solid rgba(0, 0, 0, 0.08); border-radius: 8px; box-shadow: 0 18px 45px rgba(0, 0, 0, 0.08); overflow: hidden; }
    header { display: flex; align-items: flex-end; justify-content: space-between; gap: 18px; padding: 22px 24px; border-bottom: 1px solid rgba(0, 0, 0, 0.07); background: rgba(250, 250, 252, 0.92); }
    h1 { margin: 0 0 6px; font-size: 28px; line-height: 1.15; font-weight: 720; letter-spacing: 0; }
    .path { color: #5f6368; font-family: "SF Mono", ui-monospace, Menlo, Monaco, Consolas, monospace; font-size: 13px; overflow-wrap: anywhere; }
    .emp-static-count { color: #6e6e73; font-size: 13px; white-space: nowrap; }
    .emp-static-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(188px, 1fr)); gap: 12px; padding: 18px; }
    .emp-static-card { display: grid; grid-template-rows: auto auto 1fr; min-height: 166px; padding: 14px; border: 1px solid rgba(0, 0, 0, 0.08); border-radius: 8px; background: linear-gradient(180deg, #ffffff 0%, #fbfbfd 100%); color: inherit; text-decoration: none; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04); transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease; }
    .emp-static-card:hover { transform: translateY(-2px); border-color: rgba(0, 113, 227, 0.35); box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1); }
    .emp-static-file-card, .emp-static-folder-card { position: relative; display: inline-grid; place-items: center; width: 58px; height: 58px; margin-bottom: 12px; color: #06c; }
    .emp-static-file-card { color: #5f6368; }
    .emp-static-folder-card { color: #0071e3; }
    .emp-static-icon { display: inline-grid; place-items: center; width: 58px; height: 58px; border-radius: 8px; background: #f5f5f7; }
    .emp-static-folder-card .emp-static-icon { background: #e8f2ff; }
    .emp-static-svg { width: 44px; height: 44px; color: currentColor; display: block; }
    .emp-static-badge { position: absolute; right: -4px; bottom: 2px; min-width: 26px; max-width: 40px; padding: 2px 5px; border-radius: 6px; background: #1d1d1f; color: #fff; font-size: 10px; line-height: 1.2; font-weight: 700; text-align: center; letter-spacing: 0; overflow: hidden; text-overflow: ellipsis; }
    .emp-static-folder-card .emp-static-badge { background: #0071e3; }
    .emp-static-kind-js { color: #b7791f; }
    .emp-static-kind-js .emp-static-icon { background: #fff6d7; }
    .emp-static-kind-js .emp-static-badge { background: #b7791f; }
    .emp-static-kind-ts, .emp-static-kind-tsx { color: #0071e3; }
    .emp-static-kind-ts .emp-static-icon, .emp-static-kind-tsx .emp-static-icon { background: #e8f2ff; }
    .emp-static-kind-ts .emp-static-badge, .emp-static-kind-tsx .emp-static-badge { background: #0071e3; }
    .emp-static-kind-css { color: #7e57c2; }
    .emp-static-kind-css .emp-static-icon { background: #f0ebff; }
    .emp-static-kind-css .emp-static-badge { background: #7e57c2; }
    .emp-static-kind-html { color: #c2542d; }
    .emp-static-kind-html .emp-static-icon { background: #fff0e8; }
    .emp-static-kind-html .emp-static-badge { background: #c2542d; }
    .emp-static-kind-json { color: #5f6368; }
    .emp-static-kind-json .emp-static-icon { background: #eef0f3; }
    .emp-static-kind-json .emp-static-badge { background: #5f6368; }
    .emp-static-kind-vue { color: #2f8f63; }
    .emp-static-kind-vue .emp-static-icon { background: #e7f6ee; }
    .emp-static-kind-vue .emp-static-badge { background: #2f8f63; }
    .emp-static-name { min-width: 0; margin-bottom: 12px; font-size: 15px; line-height: 1.3; font-weight: 650; overflow-wrap: anywhere; }
    .emp-static-meta { display: flex; justify-content: space-between; gap: 10px; color: #6e6e73; font-size: 12px; line-height: 1.5; }
    .emp-static-meta b { color: #3a3a3c; font-weight: 600; }
    .emp-static-modified { margin-top: 2px; grid-column: 1; }
    @media (max-width: 640px) {
      .emp-static-index { padding: 20px 12px 32px; }
      header { display: block; padding: 18px; }
      .emp-static-count { display: block; margin-top: 12px; }
      .emp-static-grid { grid-template-columns: 1fr; padding: 12px; }
    }
  </style>
</head>
<body>
  <main class="emp-static-index">
    <section class="emp-static-shell">
      <header>
        <div>
          <h1>EMP Static Index</h1>
          <div class="path">${escapeHtml(browserPath)}</div>
        </div>
        <div class="emp-static-count">${cards.length} items</div>
      </header>
      <div class="emp-static-grid">${cards.join('')}</div>
    </section>
  </main>
</body>
</html>`
}

async function getRequestTarget(root: string, url = '') {
  const pathname = parse(url).pathname || '/'
  const decodedPath = decodeURIComponent(pathname)
  const relativePath = decodedPath === '/' ? '.' : decodedPath.replace(/^\/+/, '')
  const filePath = path.resolve(root, relativePath)
  if (!isInsideRoot(root, filePath)) return undefined
  return filePath
}

async function readBodyForRequest(
  root: string,
  url: string | undefined,
  spa: StaticServeOptions['spa'],
  index: StaticServeOptions['index'],
) {
  const requestPath = await getRequestTarget(root, url)
  if (requestPath) {
    const stat = await fsp.stat(requestPath).catch(() => undefined)
    if (stat?.isFile()) {
      return {statusCode: 200, filePath: requestPath, body: await fsp.readFile(requestPath)}
    }
    if (stat?.isDirectory()) {
      for (const candidate of normalizeIndexCandidates(index)) {
        const candidatePath = path.resolve(requestPath, candidate)
        if (!isInsideRoot(requestPath, candidatePath)) continue
        const candidateStat = await fsp.stat(candidatePath).catch(() => undefined)
        if (candidateStat?.isFile()) {
          return {statusCode: 200, filePath: candidatePath, body: await fsp.readFile(candidatePath)}
        }
      }
      return {
        statusCode: 200,
        filePath: '',
        contentType: 'text/html; charset=utf-8',
        body: Buffer.from(await renderDirectoryIndex(root, requestPath)),
      }
    }
  }
  if (spa) {
    const entry = typeof spa === 'string' ? spa : 'index.html'
    const spaPath = path.resolve(root, entry)
    return {statusCode: 200, filePath: spaPath, body: await fsp.readFile(spaPath)}
  }
  return {statusCode: 404, filePath: '', contentType: 'text/plain; charset=utf-8', body: Buffer.alloc(0)}
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
      const result = await readBodyForRequest(root, req.url, options.spa, options.index)
      const contentType = result.contentType ?? (result.filePath ? contentTypeFor(result.filePath) : 'text/plain; charset=utf-8')
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
