import {readFile} from 'node:fs/promises'
import path from 'node:path'
import {describe, expect, it} from '@rstest/core'
import {createRealProject, listFiles, runCli, writeProjectFile} from '../support/real-project'

async function writeAutoPagesFixture(root: string) {
  await writeProjectFile(
    root,
    'package.json',
    JSON.stringify(
      {
        name: 'cli-auto-pages-fixture',
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
      '  autoPages: true,',
      "  html: {mountId: 'auto-root', title: 'Default Auto Page'},",
      '  entries: {',
      "    'info.ts': {title: 'Info Auto Page'},",
      "    'work/index.ts': {title: 'Work Auto Page'},",
      '  },',
      "  build: {outDir: 'dist-auto', assetsDir: 'assets-auto'},",
      '})',
      '',
    ].join('\n'),
  )

  await writeProjectFile(
    root,
    'src/pages/index.ts',
    "document.getElementById('auto-root')!.textContent = 'auto-index-page'\n",
  )
  await writeProjectFile(
    root,
    'src/pages/info.ts',
    "document.getElementById('auto-root')!.textContent = 'auto-info-page'\n",
  )
  await writeProjectFile(
    root,
    'src/pages/work/index.ts',
    "document.getElementById('auto-root')!.textContent = 'auto-work-page'\n",
  )
}

async function writeCustomAutoPagesFixture(root: string) {
  await writeProjectFile(
    root,
    'package.json',
    JSON.stringify(
      {
        name: 'cli-auto-pages-custom-path-fixture',
        private: true,
        type: 'module',
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
      "  autoPages: {path: 'screens'},",
      "  html: {mountId: 'custom-auto-root', title: 'Custom Auto Page'},",
      '  entries: {',
      "    'dashboard.tsx': {title: 'Dashboard Auto Page'},",
      "    'account/settings.jsx': {title: 'Settings Auto Page'},",
      '  },',
      "  build: {outDir: 'dist-custom-auto', assetsDir: 'assets-custom-auto'},",
      '})',
      '',
    ].join('\n'),
  )

  await writeProjectFile(
    root,
    'src/screens/dashboard.tsx',
    "document.getElementById('custom-auto-root')!.textContent = 'custom-tsx-page'\n",
  )
  await writeProjectFile(
    root,
    'src/screens/account/settings.jsx',
    "document.getElementById('custom-auto-root').textContent = 'custom-jsx-page'\n",
  )
}

describe('cli auto pages', () => {
  it('builds real pages discovered from src/pages with per-page html options', async () => {
    const project = await createRealProject('cli-auto-pages')
    try {
      await writeAutoPagesFixture(project.root)

      const result = await runCli(['build', '--clearLog=false'], project.root, 180000)
      expect(result.code).toBe(0)
      expect(result.stderr).not.toContain('Failed to compile')

      const distRoot = path.join(project.root, 'dist-auto')
      const files = await listFiles(distRoot)
      expect(files).toEqual(
        expect.arrayContaining([
          'index.html',
          'info.html',
          path.join('work', 'index.html'),
        ]),
      )

      const indexHtml = await readFile(path.join(distRoot, 'index.html'), 'utf8')
      const infoHtml = await readFile(path.join(distRoot, 'info.html'), 'utf8')
      const workHtml = await readFile(path.join(distRoot, 'work', 'index.html'), 'utf8')
      expect(indexHtml).toContain('<title>Default Auto Page</title>')
      expect(infoHtml).toContain('<title>Info Auto Page</title>')
      expect(workHtml).toContain('<title>Work Auto Page</title>')
      expect(indexHtml).toContain('id="auto-root"')
      expect(infoHtml).toContain('id="auto-root"')
      expect(workHtml).toContain('id="auto-root"')

      const js = (
        await Promise.all(
          files
            .filter(file => file.startsWith('js/') && file.endsWith('.js'))
            .map(file => readFile(path.join(distRoot, file), 'utf8')),
        )
      ).join('\n')
      expect(js).toContain('auto-index-page')
      expect(js).toContain('auto-info-page')
      expect(js).toContain('auto-work-page')
    } finally {
      await project.cleanup()
    }
  })

  it('builds TSX and JSX pages from a custom autoPages path', async () => {
    const project = await createRealProject('cli-auto-pages-custom-path')
    try {
      await writeCustomAutoPagesFixture(project.root)

      const result = await runCli(['build', '--clearLog=false'], project.root, 180000)
      expect(result.code).toBe(0)
      expect(result.stderr).not.toContain('Failed to compile')

      const distRoot = path.join(project.root, 'dist-custom-auto')
      const files = await listFiles(distRoot)
      expect(files).toEqual(
        expect.arrayContaining([
          'dashboard.html',
          path.join('account', 'settings.html'),
        ]),
      )

      const dashboardHtml = await readFile(path.join(distRoot, 'dashboard.html'), 'utf8')
      const settingsHtml = await readFile(path.join(distRoot, 'account', 'settings.html'), 'utf8')
      expect(dashboardHtml).toContain('<title>Dashboard Auto Page</title>')
      expect(settingsHtml).toContain('<title>Settings Auto Page</title>')
      expect(dashboardHtml).toContain('id="custom-auto-root"')
      expect(settingsHtml).toContain('id="custom-auto-root"')

      const js = (
        await Promise.all(
          files
            .filter(file => file.startsWith('js/') && file.endsWith('.js'))
            .map(file => readFile(path.join(distRoot, file), 'utf8')),
        )
      ).join('\n')
      expect(js).toContain('custom-tsx-page')
      expect(js).toContain('custom-jsx-page')
    } finally {
      await project.cleanup()
    }
  })
})
