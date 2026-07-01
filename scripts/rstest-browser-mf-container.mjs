import {createReadStream} from 'node:fs'
import {readFile, stat} from 'node:fs/promises'
import http from 'node:http'
import {createRequire} from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const browserPackageJson = require.resolve('@rstest/browser/package.json')
const browserContainerDir = path.join(path.dirname(browserPackageJson), 'dist/browser-container')

const port = Number(process.env.RSTEST_MF_CONTAINER_PORT ?? 51203)
const proxyTargets = JSON.parse(process.env.APPS_BROWSER_PROXY_TARGETS ?? '{}')

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
])

const sendFile = async (res, filePath) => {
  try {
    const fileStat = await stat(filePath)
    if (!fileStat.isFile()) {
      res.writeHead(404)
      res.end()
      return
    }

    res.writeHead(200, {
      'content-length': fileStat.size,
      'content-type': contentTypes.get(path.extname(filePath)) ?? 'application/octet-stream',
    })
    createReadStream(filePath).pipe(res)
  } catch {
    res.writeHead(404)
    res.end()
  }
}

const sendContainerIndex = async res => {
  const html = await readFile(path.join(browserContainerDir, 'index.html'), 'utf-8')
  res.writeHead(200, {'content-type': 'text/html; charset=utf-8'})
  res.end(html)
}

const proxyRequest = async (req, res, target) => {
  try {
    const headers = new Headers(req.headers)
    headers.delete('host')
    const hasBody = req.method !== 'GET' && req.method !== 'HEAD'
    const response = await fetch(target, {
      method: req.method,
      headers,
      body: hasBody ? req : undefined,
      duplex: hasBody ? 'half' : undefined,
    })
    const buffer = Buffer.from(await response.arrayBuffer())
    const contentType = response.headers.get('content-type') ?? 'application/octet-stream'

    res.writeHead(response.status, {
      'access-control-allow-origin': '*',
      'content-length': buffer.length,
      'content-type': contentType,
    })
    res.end(buffer)
  } catch (error) {
    res.writeHead(502, {'content-type': 'text/plain; charset=utf-8'})
    res.end(`Failed to proxy ${target}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

const parseContainerStaticPath = pathname => {
  const match = pathname.match(/^\/container-static\/([^/]+)\/?(.*)$/)
  if (!match) return null
  return {
    appName: match[1],
    targetPath: match[2] || '',
  }
}

const proxyApp = async (req, res, url, appName, targetPath) => {
  const appBaseUrl = proxyTargets[appName]
  if (!appBaseUrl) return false
  const target = new URL(targetPath + url.search, appBaseUrl)
  await proxyRequest(req, res, target)
  return true
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`)

  if (url.pathname === '/' || url.pathname === '/index.html') {
    await sendContainerIndex(res)
    return
  }

  const appPath = parseContainerStaticPath(url.pathname)
  if (appPath && (await proxyApp(req, res, url, appPath.appName, appPath.targetPath))) {
    return
  }

  if (url.pathname.startsWith('/api/') && proxyTargets.demo) {
    await proxyRequest(req, res, new URL(url.pathname.replace(/^\//, '') + url.search, proxyTargets.demo))
    return
  }

  if (url.pathname.startsWith('/container-static/')) {
    const relativePath = url.pathname.replace(/^\/container-static\//, 'container-static/')
    await sendFile(res, path.join(browserContainerDir, relativePath))
    return
  }

  res.writeHead(404, {'content-type': 'text/plain; charset=utf-8'})
  res.end('Not found')
})

server.listen(port, '0.0.0.0', () => {
  console.log(`Rstest apps browser container: http://localhost:${port}/`)
  console.log(`Proxy targets: ${Object.keys(proxyTargets).sort().join(', ')}`)
})
