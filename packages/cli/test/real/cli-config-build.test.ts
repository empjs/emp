import {readFile, readdir, stat} from 'node:fs/promises'
import path from 'node:path'
import {describe, expect, it} from '@rstest/core'
import {
  createRealProject,
  pathExists,
  runCli,
  writeProjectFile,
} from '../support/real-project'

async function listFiles(root: string, relativeDir = ''): Promise<string[]> {
  const dir = path.join(root, relativeDir)
  const entries = await readdir(dir, {withFileTypes: true})
  const files: string[] = []
  for (const entry of entries) {
    const nextRelative = path.join(relativeDir, entry.name)
    const nextPath = path.join(root, nextRelative)
    if (entry.isDirectory()) {
      files.push(...(await listFiles(root, nextRelative)))
    } else if ((await stat(nextPath)).isFile()) {
      files.push(nextRelative)
    }
  }
  return files.sort()
}

async function findFirst(root: string, predicate: (file: string) => boolean) {
  const files = await listFiles(root)
  return files.find(predicate)
}

describe('cli config build', () => {
  it('builds a real fixture with env vars, aliases, assets, and sourcemaps', async () => {
    const project = await createRealProject('cli-config-build')
    try {
      await writeProjectFile(
        project.root,
        'package.json',
        JSON.stringify(
          {
            name: 'cli-config-build-fixture',
            private: true,
            type: 'module',
          },
          null,
          2,
        ) + '\n',
      )

      await writeProjectFile(
        project.root,
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
        project.root,
        'emp.config.ts',
        [
          'export default store => ({',
          "  base: '/cdn/',",
          "  appSrc: 'src',",
          "  appEntry: 'main.ts',",
          "  build: {",
          "    outDir: 'dist-real',",
          "    assetsDir: 'assets-real',",
          "    sourcemap: {js: 'source-map', css: true},",
          '  },',
          "  html: {mountId: 'custom-root', title: 'CLI Real Config'},",
          "  entries: {main: {}},",
          "  define: {",
          "    __EMP_TEST_ENV__: JSON.stringify('from-define'),",
          "    API_URL: JSON.stringify(store.cliOptions.envVars?.API_URL ?? ''),",
          '  },',
          "  defineFix: 'all',",
          `  resolve: {alias: {'@fixture': ${JSON.stringify(path.join(project.root, 'src', 'fixture'))}}},`,
          '})',
          '',
        ].join('\n'),
      )

      await writeProjectFile(
        project.root,
        'src/fixture/message.ts',
        "export const message = 'alias-hit'\n",
      )

      await writeProjectFile(
        project.root,
        'src/style.css',
        [
          ':root {',
          "  --fixture-color: #123456;",
          '}',
          '.fixture {',
          '  color: var(--fixture-color);',
          '}',
          '',
        ].join('\n'),
      )

      await writeProjectFile(
        project.root,
        'src/main.ts',
        [
          'declare const process: {env: {API_URL?: string}}',
          'declare const __EMP_TEST_ENV__: string',
          '',
          "import {message} from '@fixture/message'",
          "import './style.css'",
          '',
          'const mount = document.getElementById("custom-root")',
          'if (!mount) throw new Error("mount missing")',
          'mount.textContent = [',
          "  'title:' + document.title,",
          "  'env:' + process.env.API_URL,",
          "  'define:' + process.env.__EMP_TEST_ENV__,",
          '  message,',
          "].join('|')",
          '',
        ].join('\n'),
      )

      const result = await runCli(
        [
          'build',
          '--env',
          'prod',
          '--env-vars',
          'API_URL=https://api.example.test',
          '--clearLog=false',
        ],
        project.root,
        180000,
      )

      expect(result.code).toBe(0)
      expect(result.stderr).not.toContain('Failed to compile')

      const htmlPath = path.join(project.root, 'dist-real', 'main.html')
      const html = await readFile(htmlPath, 'utf8')
      expect(html).toContain('<title>CLI Real Config</title>')
      expect(html).toContain('id="custom-root"')
      expect(html).toContain('/cdn/')

      const files = await listFiles(path.join(project.root, 'dist-real'))
      const jsFile = files.find(file => file.startsWith('js/') && file.endsWith('.js'))
      const cssFile = files.find(file => file.startsWith('css/') && file.endsWith('.css'))
      const jsMapFile = files.find(file => file.startsWith('js/') && file.endsWith('.js.map'))
      const cssMapFile = files.find(file => file.startsWith('css/') && file.endsWith('.css.map'))

      expect(jsFile).toBeTruthy()
      expect(cssFile).toBeTruthy()
      expect(jsMapFile).toBeTruthy()
      expect(cssMapFile).toBeTruthy()

      const js = await readFile(path.join(project.root, 'dist-real', jsFile as string), 'utf8')
      const css = await readFile(path.join(project.root, 'dist-real', cssFile as string), 'utf8')

      expect(js).toContain('alias-hit')
      expect(js).toContain('from-define')
      expect(js).toContain('https://api.example.test')
      expect(js).not.toContain('process.env.API_URL')
      expect(css).toContain('--fixture-color')

      const indexMap = await findFirst(path.join(project.root, 'dist-real'), file => file.endsWith('.map'))
      expect(indexMap).toBeTruthy()
      expect(await pathExists(path.join(project.root, 'dist-real', indexMap as string))).toBe(true)
    } finally {
      await project.cleanup()
    }
  })
})
