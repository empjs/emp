import {appendFile, readFile} from 'node:fs/promises'
import path from 'node:path'
import {describe, expect, it} from '@rstest/core'
import {createRealProject, findFreePort, runCli, spawnCli, waitForHttp, waitForPortReleased, writeProjectFile} from '../support/real-project'

async function writeLifecycleFixture(root: string, marksPath: string, port?: number) {
  await writeProjectFile(
    root,
    'package.json',
    JSON.stringify(
      {
        name: 'cli-lifecycle-fixture',
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

  const markFactory = `const mark = name => appendFile(${JSON.stringify(marksPath)}, JSON.stringify({name}) + '\\n')`
  const configLines = [
    "import {appendFile} from 'node:fs/promises'",
    markFactory,
    'export default () => ({',
    "  appSrc: 'src',",
    "  appEntry: 'main.ts',",
    '  build: {',
    "    outDir: 'dist-lifecycle',",
    "    assetsDir: 'assets-real',",
    "    sourcemap: {js: 'source-map', css: true},",
    '  },',
    "  html: {mountId: 'lifecycle-root', title: 'Lifecycle Fixture'},",
    "  entries: {main: {}},",
  ]
  if (port) {
    configLines.push(`  server: {host: '127.0.0.1', port: ${port}},`)
  }
  configLines.push(
    '  lifeCycle: {',
    "    afterGetEmpOptions: () => mark('afterGetEmpOptions'),",
    "    beforePlugin: () => mark('beforePlugin'),",
    "    afterPlugin: () => mark('afterPlugin'),",
    "    beforeEmpPlugin: () => mark('beforeEmpPlugin'),",
    "    afterEmpPlugin: () => mark('afterEmpPlugin'),",
    "    beforeBuild: () => mark('beforeBuild'),",
    "    afterBuild: () => mark('afterBuild'),",
    "    beforeDevServe: () => mark('beforeDevServe'),",
    "    afterDevServe: () => mark('afterDevServe'),",
    '  },',
    "  plugins: [{rsConfig: () => mark('plugin.rsConfig')}],",
    '})',
    '',
  )
  await writeProjectFile(root, 'emp.config.ts', configLines.join('\n'))
  await writeProjectFile(root, 'src/main.ts', "import './style.css'\ndocument.getElementById('lifecycle-root')!.textContent = 'lifecycle'\n")
  await writeProjectFile(root, 'src/style.css', '.lifecycle { color: #123456; }\n')
}

async function readMarks(marksPath: string) {
  const content = await readFile(marksPath, 'utf8')
  return content
    .trim()
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line) as {name: string})
    .map(entry => entry.name)
}

describe('cli lifecycle and plugin order', () => {
  it('writes build lifecycle marks in the real execution order', async () => {
    const project = await createRealProject('cli-lifecycle-build')
    const marksPath = path.join(project.root, 'marks.jsonl')
    try {
      await writeLifecycleFixture(project.root, marksPath)
      const result = await runCli(['build', '--clearLog=false'], project.root, 180000)
      const marks = await readMarks(marksPath)

      expect(result.code).toBe(0)
      expect(marks).toEqual([
        'afterGetEmpOptions',
        'beforePlugin',
        'afterPlugin',
        'beforeEmpPlugin',
        'plugin.rsConfig',
        'afterEmpPlugin',
        'beforeBuild',
        'afterBuild',
      ])
    } finally {
      await project.cleanup()
    }
  })

  it('writes dev lifecycle marks before the process shuts down', async () => {
    const project = await createRealProject('cli-lifecycle-dev')
    const marksPath = path.join(project.root, 'marks.jsonl')
    try {
      const port = await findFreePort()
      await writeLifecycleFixture(project.root, marksPath, port)
      const child = await spawnCli(['dev', '--clearLog=false'], project.root)

      try {
        const response = await waitForHttp(`http://127.0.0.1:${port}/main.html`, 180000)
        expect(response.status).toBe(200)
      } finally {
        await child.stop('SIGTERM')
      }
      await waitForPortReleased(port)

      const marks = await readMarks(marksPath)
      expect(marks).toContain('afterGetEmpOptions')
      expect(marks).toContain('beforePlugin')
      expect(marks).toContain('afterPlugin')
      expect(marks).toContain('beforeEmpPlugin')
      expect(marks).toContain('afterEmpPlugin')
      expect(marks.indexOf('beforeEmpPlugin')).toBeLessThan(marks.indexOf('plugin.rsConfig'))
      expect(marks.indexOf('plugin.rsConfig')).toBeLessThan(marks.indexOf('afterEmpPlugin'))
      expect(marks).toContain('beforeDevServe')
      expect(marks).toContain('afterDevServe')
      expect(marks.indexOf('beforeDevServe')).toBeLessThan(marks.indexOf('afterDevServe'))
      expect(child.child.exitCode ?? child.child.signalCode).not.toBeNull()
    } finally {
      await project.cleanup()
    }
  })
})
