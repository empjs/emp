import path from 'node:path'
import {describe, expect, it} from '@rstest/core'
import {listFiles, createRealProject, findFreePort, runCli, spawnCli, waitForHttp, waitForPortReleased, writeProjectFile} from '../support/real-project'

async function writeRuntimeFixture(root: string, options: {outDir: string; port?: number}) {
  await writeProjectFile(
    root,
    'package.json',
    JSON.stringify(
      {
        name: 'cli-command-runtime-fixture',
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

  const configLines = [
    'export default () => ({',
    "  appSrc: 'src',",
    "  appEntry: 'main.ts',",
    '  build: {',
    `    outDir: ${JSON.stringify(options.outDir)},`,
    "    assetsDir: 'assets-real',",
    "    sourcemap: {js: 'source-map', css: true},",
    '  },',
    "  html: {mountId: 'runtime-root', title: 'CLI Runtime Fixture'},",
    "  entries: {main: {}},",
  ]
  if (options.port) {
    configLines.push(`  server: {host: '127.0.0.1', port: ${options.port}},`)
  }
  configLines.push('})', '')

  await writeProjectFile(root, 'emp.config.ts', configLines.join('\n'))
  await writeProjectFile(
    root,
    'src/main.ts',
    [
      "import './style.css'",
      "document.getElementById('runtime-root')!.textContent = 'runtime'",
      '',
    ].join('\n'),
  )
  await writeProjectFile(root, 'src/style.css', '.runtime { color: #123456; }\n')
}

describe('cli command runtime', () => {
  it('rejects unsupported dts and init commands with the v4 alpha message', async () => {
    const repoRoot = path.resolve(import.meta.dirname, '../../..')
    const dts = await runCli(['dts'], repoRoot)
    const init = await runCli(['init'], repoRoot)

    expect(dts.code).toBe(1)
    expect(init.code).toBe(1)
    expect(`${dts.stdout}${dts.stderr}`).toContain('emp dts 在 @empjs/cli v4 alpha 中尚未实现。')
    expect(`${init.stdout}${init.stderr}`).toContain('emp init 在 @empjs/cli v4 alpha 中尚未实现。')
  })

  it('rejects invalid env-vars input with a key=value message', async () => {
    const repoRoot = path.resolve(import.meta.dirname, '../../..')
    const result = await runCli(['build', '--env-vars', 'bad'], repoRoot)

    expect(result.code).not.toBe(0)
    expect(`${result.stdout}${result.stderr}`).toContain('key=value')
  })

  it('surfaces analyzer output when build --analyze is enabled', async () => {
      const project = await createRealProject('cli-analyze')
      try {
        await writeRuntimeFixture(project.root, {outDir: 'dist-analyze', port: await findFreePort()})
        const result = await runCli(['build', '--analyze', '--clearLog=false'], project.root, 180000)
        expect(result.code).toBe(0)
        expect(result.stderr).not.toContain('Failed to compile')

        const files = await listFiles(path.join(project.root, 'dist-analyze'))
        const analyzerArtifact = files.find(
          file =>
            file.endsWith('report.html') ||
            file.endsWith('analyzer.html') ||
            file.endsWith('bundle-report.html') ||
            (file.endsWith('.html') && file !== 'main.html'),
        )
        const analyzerLog = `${result.stdout}\n${result.stderr}`

        expect(Boolean(analyzerArtifact) || /Could't analyze webpack bundle/i.test(analyzerLog)).toBe(true)
      } finally {
        await project.cleanup()
      }
  })

  it('starts build --watch --serve, serves html, and stops cleanly on SIGTERM', async () => {
    const project = await createRealProject('cli-watch-serve')
    try {
      const port = await findFreePort()
      await writeRuntimeFixture(project.root, {outDir: 'dist-watch', port})
      const child = await spawnCli(['build', '--watch', '--serve', '--clearLog=false'], project.root)

      try {
        const response = await waitForHttp(`http://127.0.0.1:${port}/main.html`, 180000)
        expect(response.status).toBe(200)
        const html = await response.text()
        expect(html).toContain('CLI Runtime Fixture')
        expect(html).toContain('runtime-root')
        const files = await listFiles(path.join(project.root, 'dist-watch'))
        const jsFile = files.find(file => file.startsWith('js/') && file.endsWith('.js'))
        expect(jsFile).toBeTruthy()
        const assetResponse = await waitForHttp(`http://127.0.0.1:${port}/${jsFile}`)
        expect(assetResponse.status).toBe(200)
      } finally {
        await child.stop('SIGTERM')
      }
      await waitForPortReleased(port)

      expect(child.child.exitCode ?? child.child.signalCode).not.toBeNull()
      const output = child.output()
      expect(`${output.stdout}${output.stderr}`).not.toContain('Failed to compile')
    } finally {
      await project.cleanup()
    }
  })
})
