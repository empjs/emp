import {mkdtemp, mkdir, rm, writeFile} from 'node:fs/promises'
import http from 'node:http'
import https from 'node:https'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
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

async function withFixture(run: (root: string) => Promise<void>) {
  const root = await mkdtemp(join(tmpdir(), 'emp-static-'))
  try {
    await mkdir(join(root, 'assets'), {recursive: true})
    await writeFile(join(root, 'index.html'), '<html><body>fallback</body></html>')
    await writeFile(join(root, 'assets', 'sdk.js'), largeJs)
    await writeFile(join(root, 'assets', 'tiny.js'), 'x')
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
