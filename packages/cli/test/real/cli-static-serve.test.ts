import {mkdir, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {describe, expect, it} from '@rstest/core'
import {
  createRealProject,
  findFreePort,
  listFiles,
  runCli,
  spawnCli,
  type SpawnedCommand,
  waitForHttp,
  waitForPortReleased,
  writeProjectFile,
} from '../support/real-project'

async function writeServeFixture(root: string, port: number, outDir = 'dist-serve') {
  await writeProjectFile(
    root,
    'package.json',
    JSON.stringify(
      {
        name: 'cli-static-serve-fixture',
        private: true,
        type: 'module',
      },
      null,
      2,
    ) + '\n',
  )

  await writeProjectFile(
    root,
    'tsconfig.json',
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2020',
          module: 'ESNext',
          moduleResolution: 'Bundler',
          lib: ['ES2020', 'DOM'],
          baseUrl: '.',
          strict: true,
          skipLibCheck: true,
        },
      },
      null,
      2,
    ) + '\n',
  )

  await writeProjectFile(
    root,
    'emp.config.ts',
    [
      'export default () => ({',
      "  appSrc: 'src',",
      "  appEntry: 'main.ts',",
      '  build: {',
      `    outDir: ${JSON.stringify(outDir)},`,
      "    assetsDir: 'assets-real',",
      "    sourcemap: {js: 'source-map', css: true},",
      '  },',
      "  html: {mountId: 'serve-root', title: 'CLI Serve Fixture'},",
      "  entries: {main: {}},",
      `  server: {host: '127.0.0.1', port: ${port}},`,
      '})',
      '',
    ].join('\n'),
  )

  await writeProjectFile(
    root,
    'src/main.ts',
    [
      "import './style.css'",
      "document.getElementById('serve-root')!.textContent = 'serve'",
      '',
    ].join('\n'),
  )
  await writeProjectFile(root, 'src/style.css', '.serve { color: #123456; }\n')
}

async function writeStaticFixture(root: string) {
  await mkdir(path.join(root, 'assets'), {recursive: true})
  await mkdir(path.join(root, 'docs'), {recursive: true})
  await mkdir(path.join(root, 'nested', 'first'), {recursive: true})
  await writeFile(path.join(root, 'index.html'), '<html><body>root index</body></html>')
  await writeFile(path.join(root, 'app.html'), '<html><body>spa fallback</body></html>')
  await writeFile(path.join(root, 'home.html'), '<html><body>home index</body></html>')
  await writeFile(path.join(root, 'assets', 'app.js'), 'window.__STATIC__ = "ok";\n')
  await writeFile(path.join(root, 'docs', 'home.html'), '<html><body>docs home</body></html>')
  await writeFile(path.join(root, 'docs', 'index.html'), '<html><body>docs index</body></html>')
  await writeFile(path.join(root, 'nested', 'first', 'home.html'), '<html><body>nested home</body></html>')
  await writeFile(path.join(root, 'nested', 'first', 'index.html'), '<html><body>nested index</body></html>')
}

async function waitForJsonPayload(child: SpawnedCommand) {
  const startedAt = Date.now()
  while (Date.now() - startedAt < 10000) {
    const {stdout, stderr} = child.output()
    try {
      const payload = JSON.parse(stdout.trim())
      if (payload?.urls?.localUrlForBrowser) return {payload, stderr}
    } catch {
      // keep waiting for the full JSON payload
    }
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  throw new Error(`Timed out waiting for static CLI JSON output:\n${child.output().stdout}\n${child.output().stderr}`)
}

async function fetchText(url: string, headers?: Record<string, string>) {
  const response = await fetch(url, {headers})
  return {response, text: await response.text()}
}

describe('cli static and serve', () => {
  it('serves static files with json, cors, custom headers, spa fallback, index priority, and no compression', async () => {
    const project = await createRealProject('cli-static')
    try {
      await writeStaticFixture(project.root)
      const child = await spawnCli(
        [
          'static',
          project.root,
          '--host',
          '127.0.0.1',
          '--port',
          '0',
          '--json',
          '--cors',
          '--headers',
          'x-test=ok',
          '--spa',
          'app.html',
          '--index',
          'home.html',
          'index.html',
          '--compression',
          'none',
        ],
        project.root,
      )
      let staticPort: number | undefined

      try {
        const {payload} = await waitForJsonPayload(child)
        staticPort = Number(new URL(payload.urls.localUrlForBrowser).port)
        expect(payload.root).toBe(project.root)
        expect(payload.protocol).toBe('http')

        const asset = await fetchText(`${payload.urls.localUrlForBrowser}assets/app.js`)
        expect(asset.response.status).toBe(200)
        expect(asset.response.headers.get('access-control-allow-origin')).toBe('*')
        expect(asset.response.headers.get('x-test')).toBe('ok')
        expect(asset.response.headers.get('content-encoding')).toBeNull()
        expect(asset.text).toContain('window.__STATIC__ = "ok"')

        const spa = await fetchText(`${payload.urls.localUrlForBrowser}missing/route`)
        expect(spa.response.status).toBe(200)
        expect(spa.text).toContain('spa fallback')

        const docs = await fetchText(`${payload.urls.localUrlForBrowser}docs/`)
        expect(docs.response.status).toBe(200)
        expect(docs.text).toContain('docs home')

        const nested = await fetchText(`${payload.urls.localUrlForBrowser}nested/first/`)
        expect(nested.response.status).toBe(200)
        expect(nested.text).toContain('nested home')
      } finally {
        await child.stop('SIGTERM')
      }
      if (staticPort) await waitForPortReleased(staticPort)
    } finally {
      await project.cleanup()
    }
  })

  it('rejects missing static roots with the expected error text', async () => {
    const repoRoot = path.resolve(import.meta.dirname, '../../..')
    const result = await runCli(['static', path.join(repoRoot, 'missing-static-root'), '--json'], repoRoot)

    expect(result.code).not.toBe(0)
    expect(`${result.stdout}${result.stderr}`).toContain('Static root does not exist')
  })

  it('serves built html and assets through emp serve after a real build', async () => {
    const project = await createRealProject('cli-serve')
    try {
      const port = await findFreePort()
      await writeServeFixture(project.root, port)
      const build = await runCli(['build', '--clearLog=false'], project.root, 180000)
      expect(build.code).toBe(0)

      const child = await spawnCli(['serve', '--env', 'prod', '--clearLog=false'], project.root)
      try {
        const html = await waitForHttp(`http://127.0.0.1:${port}/main.html`, 180000)
        expect(html.status).toBe(200)
        const htmlText = await html.text()
        expect(htmlText).toContain('CLI Serve Fixture')
        expect(htmlText).toContain('serve-root')

        const files = await listFiles(path.join(project.root, 'dist-serve'))
        const jsFile = files.find(file => file.startsWith('js/') && file.endsWith('.js'))
        expect(jsFile).toBeTruthy()
        const asset = await fetchText(`http://127.0.0.1:${port}/${jsFile}`)
        expect(asset.response.status).toBe(200)
        expect(asset.text).toContain('serve')
      } finally {
        await child.stop('SIGTERM')
      }
      await waitForPortReleased(port)
    } finally {
      await project.cleanup()
    }
  })

  it('rejects emp serve before build with the expected message', async () => {
    const project = await createRealProject('cli-serve-prebuild')
    try {
      const port = await findFreePort()
      await writeServeFixture(project.root, port)
      const result = await runCli(['serve', '--env', 'prod', '--clearLog=false'], project.root)

      expect(result.code).not.toBe(0)
      expect(`${result.stdout}${result.stderr}`).toContain('emp serve must be executed after emp build')
    } finally {
      await project.cleanup()
    }
  })
})
