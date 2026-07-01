import {describe, expect, test} from '@rstest/core'
import {execFile as execFileCallback} from 'node:child_process'
import {existsSync, readdirSync, readFileSync} from 'node:fs'
import {join} from 'node:path'
import {promisify} from 'node:util'
import {DEFAULT_APP_ACCEPTANCE} from '../../scripts/apps.catalog.mjs'
import {repoRoot} from '../../test/helpers/repo-root'

const execFile = promisify(execFileCallback)

function readDistCss(appDir: string): string {
  const distCssDir = join(repoRoot, 'apps', appDir, 'dist', 'css')
  if (!existsSync(distCssDir)) {
    return ''
  }

  const cssFiles = readdirSync(distCssDir, {recursive: true})
  return cssFiles
    .filter(file => String(file).endsWith('.css'))
    .map(file => readFileSync(join(distCssDir, String(file)), 'utf8'))
    .join('\n')
}

function assertNoDefaultTailwindPostcssWarning(stderr: string) {
  expect(stderr).not.toContain('postcss-is-pseudo-class')
  expect(stderr).not.toContain('postcss-loader')
  expect(stderr).not.toContain('@tailwindcss/postcss')
}

const expectedArtifacts: Record<string, string[]> = {
  'rspack2-modern-module': ['dist/index.html'],
  'rspack2-optimization': ['dist/index.html'],
  'mf-host': ['dist/emp.json', 'dist/emp.js'],
  'mf-app': ['dist/emp.json', 'dist/index.html'],
  'vue-3-base': ['dist/mf-manifest.json', 'dist/emp.js'],
  'vue-3-project': ['dist/mf-manifest.json', 'dist/index.html'],
  'tailwind-4': ['dist/index.html'],
  'react-19-tanstack': ['dist/index.html'],
}

describe('default apps real acceptance', () => {
  for (const appDir of DEFAULT_APP_ACCEPTANCE) {
    test(`${appDir} builds and emits expected artifacts`, async () => {
      const result = await execFile('corepack', ['pnpm@10.33.0', '--filter', `./apps/${appDir}`, 'build'], {
        cwd: repoRoot,
        maxBuffer: 1024 * 1024 * 20,
      })

      expect(result.stderr).not.toContain('ERROR')
      for (const artifact of expectedArtifacts[appDir]) {
        expect(existsSync(join(repoRoot, 'apps', appDir, artifact))).toBe(true)
      }

      const distFiles = readdirSync(join(repoRoot, 'apps', appDir, 'dist'), {recursive: true})
      expect(distFiles.length).toBeGreaterThan(0)

      if (appDir === 'tailwind-4') {
        const pkg = JSON.parse(readFileSync(join(repoRoot, 'apps', appDir, 'package.json'), 'utf8'))
        expect(pkg.devDependencies?.['@empjs/plugin-tailwindcss']).toBe('workspace:^')
        expect(pkg.devDependencies?.['@empjs/plugin-tailwindcss2']).toBeUndefined()
        expect(pkg.devDependencies?.['@empjs/plugin-tailwindcss3']).toBeUndefined()
        expect(distFiles.some(file => String(file).startsWith('css/') && String(file).endsWith('.css'))).toBe(true)
        assertNoDefaultTailwindPostcssWarning(result.stderr)

        const css = readDistCss(appDir)
        expect(css).toContain('--tw')
        expect(css).toContain('.grid')
        expect(css).toContain('.bg-')
      }

      if (appDir === 'vue-3-base') {
        const pkg = JSON.parse(readFileSync(join(repoRoot, 'apps', appDir, 'package.json'), 'utf8'))
        const config = readFileSync(join(repoRoot, 'apps', appDir, 'emp.config.ts'), 'utf8')
        const countStore = readFileSync(join(repoRoot, 'apps', appDir, 'src/components/piniaCounterStore.ts'), 'utf8')
        const piniaCount = readFileSync(join(repoRoot, 'apps', appDir, 'src/components/PiniaCount.vue'), 'utf8')

        expect(pkg.dependencies?.pinia).toBe('^3.0.3')
        expect(config).toContain('@empjs/cdn-vue-router-pinia')
        expect(config).toContain("'./PiniaCount'")
        expect(config).toContain("o['pinia'] = `EMP_ADAPTER_VUE.Pinia`")
        expect(countStore).toContain('defineStore')
        expect(piniaCount).toContain('storeToRefs')
      }

      if (appDir === 'vue-3-project') {
        const pkg = JSON.parse(readFileSync(join(repoRoot, 'apps', appDir, 'package.json'), 'utf8'))
        const config = readFileSync(join(repoRoot, 'apps', appDir, 'emp.config.ts'), 'utf8')
        const bootstrap = readFileSync(join(repoRoot, 'apps', appDir, 'src/bootstrap.ts'), 'utf8')
        const home = readFileSync(join(repoRoot, 'apps', appDir, 'src/Home.vue'), 'utf8')

        expect(pkg.dependencies?.pinia).toBe('^3.0.3')
        expect(config).toContain('@empjs/cdn-vue-router-pinia')
        expect(config).toContain("o['pinia'] = `EMP_ADAPTER_VUE.Pinia`")
        expect(bootstrap).toContain('createPinia')
        expect(home).toContain('@v3/PiniaCount')
      }

      if (appDir === 'react-19-tanstack') {
        const routeTree = readFileSync(join(repoRoot, 'apps', appDir, 'src/routeTree.gen.ts'), 'utf8')
        expect(routeTree).toContain("'/router-lab'")
        expect(routeTree).toContain("'/router-lab/$id'")
        assertNoDefaultTailwindPostcssWarning(result.stderr)

        const css = readDistCss(appDir)
        expect(css).toContain('.tailwind-react-contaner')
        expect(css).toContain('group-hover')
      }
    }, 120000)
  }
})
