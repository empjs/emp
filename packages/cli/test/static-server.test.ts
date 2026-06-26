import {spawn, type ChildProcessWithoutNullStreams} from 'node:child_process'
import {once} from 'node:events'
import {mkdtemp, mkdir, rm, writeFile} from 'node:fs/promises'
import http from 'node:http'
import https from 'node:https'
import {tmpdir} from 'node:os'
import {delimiter, join, resolve} from 'node:path'
import {
  brotliCompressSync,
  brotliDecompressSync,
  constants as zlibConstants,
  gunzipSync,
  gzipSync,
} from 'node:zlib'
import {describe, expect, it} from '@rstest/core'
import {startStaticServer} from '../src/server/static/createStaticServer'

const largeJs = 'window.__EMP_STATIC__ = "cloudflare-compression";\n'.repeat(200)
const sourceTs = 'export const answer: number = 42\n'
const sourceTsx = 'export function Answer() { return <span>42</span> }\n'
const cliRoot = resolve(import.meta.dirname, '..')
const cliSourceRunner = [
  "import {createJiti} from 'jiti'",
  "process.argv = [process.execPath, 'emp', ...process.argv.slice(1)]",
  "const jiti = createJiti(import.meta.url, {interopDefault: true})",
  "const mod = await jiti.import('./src/script/index.ts')",
  'await mod.default()',
].join(';')

type StaticCliPayload = {
  urls: {
    localUrlForBrowser: string
  }
  host: string
  port: number
}

async function withFixture(run: (root: string) => Promise<void>) {
  const root = await mkdtemp(join(tmpdir(), 'emp-static-'))
  try {
    await mkdir(join(root, 'assets'), {recursive: true})
    await mkdir(join(root, 'assets', 'components'), {recursive: true})
    await mkdir(join(root, 'docs'), {recursive: true})
    await writeFile(join(root, 'index.html'), '<html><body>fallback</body></html>')
    await writeFile(join(root, 'assets', 'sdk.js'), largeJs)
    await writeFile(join(root, 'assets', 'source.ts'), sourceTs)
    await writeFile(join(root, 'assets', 'source.tsx'), sourceTsx)
    await writeFile(join(root, 'assets', 'tiny.js'), 'x')
    await writeFile(join(root, 'docs', 'home.html'), '<html><body>docs home</body></html>')
    await writeFile(join(root, 'docs', 'index.html'), '<html><body>docs index</body></html>')
    await run(root)
  } finally {
    await rm(root, {recursive: true, force: true})
  }
}

function cloudflareBrotli(input: string) {
  return brotliCompressSync(Buffer.from(input), {
    params: {
      [zlibConstants.BROTLI_PARAM_QUALITY]: 4,
    },
  })
}

function cloudflareGzip(input: string) {
  return gzipSync(Buffer.from(input), {level: 8})
}

function requestRaw(url: string, headers: Record<string, string> = {}) {
  return new Promise<{statusCode: number; headers: http.IncomingHttpHeaders; body: Buffer}>((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http
    const request = client.request(
      url,
      {
        headers,
        rejectUnauthorized: false,
      },
      response => {
        const chunks: Buffer[] = []
        response.on('data', chunk => chunks.push(Buffer.from(chunk)))
        response.on('end', () =>
          resolve({
            statusCode: response.statusCode ?? 0,
            headers: response.headers,
            body: Buffer.concat(chunks),
          }),
        )
      },
    )
    request.on('error', reject)
    request.end()
  })
}

function waitForStaticCliPayload(child: ChildProcessWithoutNullStreams) {
  return new Promise<StaticCliPayload>((resolve, reject) => {
    let stdout = ''
    let stderr = ''
    let settled = false

    const cleanup = () => {
      clearTimeout(timer)
      child.stdout.off('data', onStdout)
      child.stderr.off('data', onStderr)
      child.off('exit', onExit)
    }

    const settle = (callback: () => void) => {
      if (settled) return
      settled = true
      cleanup()
      callback()
    }

    const tryResolve = () => {
      try {
        const payload = JSON.parse(stdout.trim()) as StaticCliPayload
        if (payload.urls?.localUrlForBrowser && payload.host && typeof payload.port === 'number') {
          settle(() => resolve(payload))
        }
      } catch {
        // stdout can arrive in multiple chunks; keep buffering until JSON is complete.
      }
    }

    const onStdout = (chunk: Buffer) => {
      stdout += chunk.toString()
      tryResolve()
    }

    const onStderr = (chunk: Buffer) => {
      stderr += chunk.toString()
    }

    const onExit = (code: number | null, signal: NodeJS.Signals | null) => {
      settle(() =>
        reject(new Error(`emp static exited before printing JSON (code=${code}, signal=${signal})\n${stderr}`)),
      )
    }

    const timer = setTimeout(() => {
      settle(() => reject(new Error(`Timed out waiting for emp static JSON output\nstdout:\n${stdout}\nstderr:\n${stderr}`)))
    }, 10000)

    child.stdout.on('data', onStdout)
    child.stderr.on('data', onStderr)
    child.once('exit', onExit)
  })
}

async function closeStaticCliProcess(child: ChildProcessWithoutNullStreams) {
  if (child.exitCode !== null || child.signalCode !== null) return

  child.kill('SIGTERM')
  const result = await Promise.race([once(child, 'exit'), new Promise(resolve => setTimeout(resolve, 1000, 'timeout'))])

  if (result === 'timeout' && child.exitCode === null && child.signalCode === null) {
    child.kill('SIGKILL')
    await once(child, 'exit')
  }
}

async function startStaticCliWithArgs(args: string[]) {
  const child = spawn(process.execPath, ['--input-type=module', '--eval', cliSourceRunner, ...args], {
    cwd: cliRoot,
    env: {
      ...process.env,
      NODE_PATH: [cliRoot, process.env.NODE_PATH].filter(Boolean).join(delimiter),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  try {
    return {child, payload: await waitForStaticCliPayload(child)}
  } catch (error) {
    await closeStaticCliProcess(child)
    throw error
  }
}

async function startStaticCli(root: string, extraArgs: string[]) {
  return startStaticCliWithArgs(['static', root, '--host', '127.0.0.1', '--port', '0', '--json', ...extraArgs])
}

describe('startStaticServer', () => {
  it('serves static files with cors headers', async () => {
    await withFixture(async root => {
      const server = await startStaticServer({root, host: '127.0.0.1', port: 0, cors: true})
      try {
        const response = await requestRaw(`${server.urls.localUrlForBrowser}assets/sdk.js`)
        expect(response.statusCode).toBe(200)
        expect(response.headers['access-control-allow-origin']).toBe('*')
        expect(response.body.toString()).toBe(largeJs)
      } finally {
        await server.close()
      }
    })
  })

  it('opens TypeScript source files as readable text files', async () => {
    await withFixture(async root => {
      const server = await startStaticServer({root, host: '127.0.0.1', port: 0})
      try {
        const response = await requestRaw(`${server.urls.localUrlForBrowser}assets/source.ts`)
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toContain('text/plain')
        expect(response.body.toString()).toBe(sourceTs)
      } finally {
        await server.close()
      }
    })
  })

  it('opens TSX source files as readable text files', async () => {
    await withFixture(async root => {
      const server = await startStaticServer({root, host: '127.0.0.1', port: 0})
      try {
        const response = await requestRaw(`${server.urls.localUrlForBrowser}assets/source.tsx`)

        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toContain('text/plain')
        expect(response.body.toString()).toBe(sourceTsx)
      } finally {
        await server.close()
      }
    })
  })

  it('returns spa fallback only when spa is enabled', async () => {
    await withFixture(async root => {
      const server = await startStaticServer({root, host: '127.0.0.1', port: 0, spa: 'index.html'})
      try {
        const response = await requestRaw(`${server.urls.localUrlForBrowser}missing/route`)
        expect(response.statusCode).toBe(200)
        expect(response.body.toString()).toBe('<html><body>fallback</body></html>')
      } finally {
        await server.close()
      }
    })
  })

  it('returns 404 for missing files when spa is disabled', async () => {
    await withFixture(async root => {
      const server = await startStaticServer({root, host: '127.0.0.1', port: 0})
      try {
        const response = await requestRaw(`${server.urls.localUrlForBrowser}missing.js`)
        expect(response.statusCode).toBe(404)
      } finally {
        await server.close()
      }
    })
  })

  it('serves directory requests from the first matching index candidate', async () => {
    await withFixture(async root => {
      const server = await startStaticServer({
        root,
        host: '127.0.0.1',
        port: 0,
        index: ['home.html', 'index.html'],
      })
      try {
        const response = await requestRaw(`${server.urls.localUrlForBrowser}docs/`)
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toContain('text/html')
        expect(response.body.toString()).toBe('<html><body>docs home</body></html>')
      } finally {
        await server.close()
      }
    })
  })

  it('applies index candidates when started through the CLI', async () => {
    await withFixture(async root => {
      const {child, payload} = await startStaticCli(root, ['--index', 'home.html', 'index.html'])
      try {
        const response = await requestRaw(`${payload.urls.localUrlForBrowser}docs/`)

        expect(payload.host).toBe('127.0.0.1')
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toContain('text/html')
        expect(response.body.toString()).toBe('<html><body>docs home</body></html>')
      } finally {
        await closeStaticCliProcess(child)
      }
    })
  })

  it('keeps the static root when the CLI index option is placed before it', async () => {
    await withFixture(async root => {
      const {child, payload} = await startStaticCliWithArgs([
        'static',
        '--host',
        '127.0.0.1',
        '--port',
        '0',
        '--json',
        '--index',
        'home.html',
        'index.html',
        root,
      ])
      try {
        const response = await requestRaw(`${payload.urls.localUrlForBrowser}docs/`)

        expect(payload.host).toBe('127.0.0.1')
        expect(response.statusCode).toBe(200)
        expect(response.body.toString()).toBe('<html><body>docs home</body></html>')
      } finally {
        await closeStaticCliProcess(child)
      }
    })
  })

  it('renders a styled directory listing when no index candidate exists', async () => {
    await withFixture(async root => {
      const server = await startStaticServer({
        root,
        host: '127.0.0.1',
        port: 0,
        index: ['missing.html'],
      })
      try {
        const response = await requestRaw(`${server.urls.localUrlForBrowser}assets/`)
        const html = response.body.toString()

        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toContain('text/html')
        expect(html).toContain('EMP Static Index')
        expect(html).toContain('class="emp-static-index"')
        expect(html).toContain('class="emp-static-shell"')
        expect(html).toContain('class="emp-static-grid"')
        expect(html).toContain('class="emp-static-card"')
        expect(html).toContain('<svg class="emp-static-svg"')
        expect(html).toContain('emp-static-file-card')
        expect(html).toContain('emp-static-folder-card')
        expect(html).toContain('emp-static-kind-js')
        expect(html).toContain('emp-static-kind-ts')
        expect(html).toContain('class="emp-static-badge">JS</span>')
        expect(html).toContain('class="emp-static-badge">TS</span>')
        expect(html).toContain('class="emp-static-badge">TSX</span>')
        expect(html).toContain('href="/assets/sdk.js"')
        expect(html).toContain('href="/assets/source.ts"')
        expect(html).toContain('href="/assets/source.tsx"')
        expect(html).toContain('href="/assets/components/"')
        expect(html).toContain('sdk.js')
        expect(html).toContain('source.ts')
        expect(html).toContain('source.tsx')
        expect(html).toContain('components')
        expect(html).toContain('<b>Type</b>')
        expect(html).toContain('Directory')
        expect(html).toContain('tiny.js')
        expect(html).toContain('Size')
        expect(html).toContain('Modified')
      } finally {
        await server.close()
      }
    })
  })

  it('rejects missing roots with an explicit message', async () => {
    await expect(startStaticServer({root: join(tmpdir(), 'emp-static-missing'), port: 0})).rejects.toThrow(
      /Static root does not exist/,
    )
  })

  it('serves over https with the bundled EMP certificate', async () => {
    await withFixture(async root => {
      const server = await startStaticServer({root, host: '127.0.0.1', port: 0, https: true})
      try {
        const response = await requestRaw(`${server.urls.localUrlForBrowser}assets/sdk.js`)
        expect(server.protocol).toBe('https')
        expect(response.statusCode).toBe(200)
      } finally {
        await server.close()
      }
    })
  })

  it('matches Cloudflare default Brotli ratio for compressible CDN assets', async () => {
    await withFixture(async root => {
      const server = await startStaticServer({root, host: '127.0.0.1', port: 0})
      try {
        const response = await requestRaw(`${server.urls.localUrlForBrowser}assets/sdk.js`, {
          'accept-encoding': 'br, gzip',
        })
        const expected = cloudflareBrotli(largeJs)
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-encoding']).toBe('br')
        expect(response.body.byteLength).toBe(expected.byteLength)
        expect(brotliDecompressSync(response.body).toString()).toBe(largeJs)
      } finally {
        await server.close()
      }
    })
  })

  it('matches Cloudflare default Gzip ratio when Brotli is unsupported', async () => {
    await withFixture(async root => {
      const server = await startStaticServer({root, host: '127.0.0.1', port: 0})
      try {
        const response = await requestRaw(`${server.urls.localUrlForBrowser}assets/sdk.js`, {
          'accept-encoding': 'gzip',
        })
        const expected = cloudflareGzip(largeJs)
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-encoding']).toBe('gzip')
        expect(response.body.byteLength).toBe(expected.byteLength)
        expect(gunzipSync(response.body).toString()).toBe(largeJs)
      } finally {
        await server.close()
      }
    })
  })

  it('keeps tiny responses uncompressed like Cloudflare', async () => {
    await withFixture(async root => {
      const server = await startStaticServer({root, host: '127.0.0.1', port: 0})
      try {
        const response = await requestRaw(`${server.urls.localUrlForBrowser}assets/tiny.js`, {
          'accept-encoding': 'br, gzip',
        })
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-encoding']).toBeUndefined()
        expect(response.body.toString()).toBe('x')
      } finally {
        await server.close()
      }
    })
  })
})
