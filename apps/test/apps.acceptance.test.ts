import {describe, expect, test} from '@rstest/core'
import {execFile as execFileCallback} from 'node:child_process'
import {existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {promisify} from 'node:util'
import {DEFAULT_APP_ACCEPTANCE} from '../../scripts/apps.catalog.mjs'
import {repoRoot} from '../../test/helpers/repo-root'

const execFile = promisify(execFileCallback)

type FederationManifest = {
  metaData?: {
    buildInfo?: {
      buildName?: string
    }
    remoteEntry?: {
      name?: string
    }
  }
  exposes?: Array<{
    path?: string
    assets?: {
      js?: {async?: string[]; sync?: string[]}
      css?: {async?: string[]; sync?: string[]}
    }
  }>
  remotes?: Array<{
    alias?: string
    entry?: string
    federationContainerName?: string
    moduleName?: string
  }>
}

const supplementalAppAcceptance = ['adapter-host', 'demo', 'dual-role', 'esm-federation', 'vue-2-base', 'vue-2-project']

async function buildApp(appDir: string) {
  const result = await execFile('corepack', ['pnpm@10.33.0', '--filter', `./apps/${appDir}`, 'build'], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024 * 20,
  })
  expect(result.stderr).not.toContain('ERROR')
  return result
}

function listDistFiles(appDir: string): string[] {
  return readdirSync(join(repoRoot, 'apps', appDir, 'dist'), {recursive: true}).map(String).sort()
}

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

function readDistText(appDir: string, file: string): string {
  return readFileSync(join(repoRoot, 'apps', appDir, 'dist', file), 'utf8')
}

function readDistJson<T>(appDir: string, file: string): T {
  return JSON.parse(readDistText(appDir, file)) as T
}

function readDistJs(appDir: string, distFiles: string[]): string {
  return distFiles
    .filter(file => file.endsWith('.js'))
    .map(file => readDistText(appDir, file))
    .join('\n')
}

function expectDistFileMatching(distFiles: string[], matcher: RegExp) {
  expect(distFiles.some(file => matcher.test(file)), `${matcher} not found in ${distFiles.join(', ')}`).toBe(true)
}

function expectManifestExposes(manifest: FederationManifest, expectedPaths: string[]) {
  const paths = (manifest.exposes ?? []).map(expose => expose.path).sort()
  expect(paths).toEqual([...expectedPaths].sort())
}

function expectManifestRemotes(manifest: FederationManifest, expectedModules: string[], containerName: string, entrySuffix: string) {
  const remotes = manifest.remotes ?? []
  expect(remotes.map(remote => remote.moduleName).sort()).toEqual([...expectedModules].sort())
  expect(remotes.every(remote => remote.federationContainerName === containerName)).toBe(true)
  expect(remotes.every(remote => String(remote.entry).endsWith(entrySuffix))).toBe(true)
}

function assertNoDefaultTailwindPostcssWarning(stderr: string) {
  expect(stderr).not.toContain('postcss-is-pseudo-class')
  expect(stderr).not.toContain('postcss-loader')
  expect(stderr).not.toContain('@tailwindcss/postcss')
}

const expectedArtifacts: Record<string, string[]> = {
  'dual-role': ['dist/@mf-types.d.ts', 'dist/@mf-types.zip', 'dist/emp.json', 'dist/emp.js', 'dist/index.html'],
  'esm-federation': ['dist/emp.json', 'dist/esm-entry.js', 'dist/index.html'],
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
      const result = await buildApp(appDir)

      for (const artifact of expectedArtifacts[appDir]) {
        expect(existsSync(join(repoRoot, 'apps', appDir, artifact))).toBe(true)
      }

      const distFiles = listDistFiles(appDir)
      expect(distFiles.length).toBeGreaterThan(0)

      if (appDir === 'rspack2-modern-module') {
        const js = readDistJs(appDir, distFiles)
        expect(js).toContain('rspack2 modern module ready')
        expect(js).toContain('document.body.appendChild')
      }

      if (appDir === 'esm-federation') {
        const manifest = readDistJson<FederationManifest>(appDir, 'emp.json')
        expect(manifest.metaData?.buildInfo?.buildName).toBe('esmFederation')
        expect(manifest.metaData?.remoteEntry?.name).toBe('esm-entry.js')
        expectManifestExposes(manifest, ['./Message'])
        const entry = readDistText(appDir, 'esm-entry.js')
        expect(entry).toMatch(/export\s*\{[^}]*get[^}]*init[^}]*\}/)
      }

      if (appDir === 'dual-role') {
        const manifest = readDistJson<FederationManifest>(appDir, 'emp.json')
        expect(manifest.metaData?.buildInfo?.buildName).toBe('dualRole')
        expectManifestExposes(manifest, ['./Peer'])

        const consumerRoot = mkdtempSync(join(tmpdir(), 'emp-dual-role-dts-'))
        try {
          const typeRoot = join(consumerRoot, 'remote-types')
          await execFile('unzip', [
            '-q',
            join(repoRoot, 'apps', appDir, 'dist', '@mf-types.zip'),
            '-d',
            typeRoot,
          ])
          const consumerFile = join(consumerRoot, 'consumer.ts')
          writeFileSync(
            consumerFile,
            [
              "import {renderPeer} from './remote-types/compiled-types/Peer'",
              "renderPeer(document.body, {sourcePort: '8201', targetPort: '8202'})",
              '',
            ].join('\n'),
          )
          await execFile(
            join(repoRoot, 'node_modules', '.bin', 'tsc'),
            ['--noEmit', '--strict', '--module', 'ESNext', '--moduleResolution', 'Bundler', '--target', 'ES2022', consumerFile],
            {cwd: consumerRoot},
          )
        } finally {
          rmSync(consumerRoot, {force: true, recursive: true})
        }
      }

      if (appDir === 'rspack2-optimization') {
        expectDistFileMatching(distFiles, /^js\/index\.[a-f0-9]+\.js$/)
        expectDistFileMatching(distFiles, /^js\/\d+\.[a-f0-9]+\.js$/)
        expectDistFileMatching(distFiles, /^css\/\d+\.[a-f0-9]+\.css$/)

        const js = readDistJs(appDir, distFiles)
        expect(js).toContain('pure-value')
        expect(js).not.toContain('unused-call')
      }

      if (appDir === 'mf-host') {
        const manifest = readDistJson<FederationManifest>(appDir, 'emp.json')
        expect(manifest.metaData?.buildInfo?.buildName).toBe('mf-host')
        expect(manifest.metaData?.remoteEntry?.name).toBe('emp.js')
        expectManifestExposes(manifest, ['./App', './CountComp', './RuntimeCapability', './Section'])
        const appExpose = manifest.exposes?.find(expose => expose.path === './App')
        const asyncAssets = [...(appExpose?.assets?.js?.async ?? []), ...(appExpose?.assets?.css?.async ?? [])]
        expect(asyncAssets.length).toBeGreaterThanOrEqual(2)
        for (const asset of asyncAssets) {
          expect(existsSync(join(repoRoot, 'apps', appDir, 'dist', asset))).toBe(true)
        }
      }

      if (appDir === 'mf-app') {
        const manifest = readDistJson<FederationManifest>(appDir, 'emp.json')
        expect(manifest.exposes).toEqual([])
        const remotes = manifest.remotes ?? []
        expect(remotes.map(remote => remote.moduleName).sort()).toEqual(['.', 'ScopedCard'])
        expect(remotes.find(remote => remote.moduleName === '.')?.federationContainerName).toBe('mfHost')
        expect(remotes.find(remote => remote.moduleName === '.')?.entry).toMatch(/:6001\/emp\.json$/)
        expect(remotes.find(remote => remote.moduleName === 'ScopedCard')?.federationContainerName).toBe('tailwindRemote')
        expect(remotes.find(remote => remote.moduleName === 'ScopedCard')?.entry).toMatch(/:8104\/emp\.json$/)
      }

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
        const manifest = readDistJson<FederationManifest>(appDir, 'emp.json')
        expectManifestExposes(manifest, ['./ScopedCard'])
      }

      if (appDir === 'vue-3-base') {
        const pkg = JSON.parse(readFileSync(join(repoRoot, 'apps', appDir, 'package.json'), 'utf8'))
        const config = readFileSync(join(repoRoot, 'apps', appDir, 'emp.config.ts'), 'utf8')
        const countStore = readFileSync(join(repoRoot, 'apps', appDir, 'src/components/piniaCounterStore.ts'), 'utf8')
        const piniaCount = readFileSync(join(repoRoot, 'apps', appDir, 'src/components/PiniaCount.vue'), 'utf8')
        const manifest = readDistJson<FederationManifest>(appDir, 'mf-manifest.json')

        expect(pkg.dependencies?.pinia).toBe('^3.0.3')
        expect(config).toContain('@empjs/cdn-vue-router-pinia')
        expect(config).toContain("'./PiniaCount'")
        expect(config).toContain("o['pinia'] = `EMP_ADAPTER_VUE.Pinia`")
        expect(countStore).toContain('defineStore')
        expect(piniaCount).toContain('storeToRefs')
        expectManifestExposes(manifest, [
          './Antd',
          './ButtonComponent',
          './Home',
          './JSXComponent',
          './PiniaCount',
          './TableComponent',
          './TsxScript',
        ])
      }

      if (appDir === 'vue-3-project') {
        const pkg = JSON.parse(readFileSync(join(repoRoot, 'apps', appDir, 'package.json'), 'utf8'))
        const config = readFileSync(join(repoRoot, 'apps', appDir, 'emp.config.ts'), 'utf8')
        const bootstrap = readFileSync(join(repoRoot, 'apps', appDir, 'src/bootstrap.ts'), 'utf8')
        const home = readFileSync(join(repoRoot, 'apps', appDir, 'src/Home.vue'), 'utf8')
        const manifest = readDistJson<FederationManifest>(appDir, 'mf-manifest.json')

        expect(pkg.dependencies?.pinia).toBe('^3.0.3')
        expect(config).toContain('@empjs/cdn-vue-router-pinia')
        expect(config).toContain("o['pinia'] = `EMP_ADAPTER_VUE.Pinia`")
        expect(bootstrap).toContain('createPinia')
        expect(home).toContain('@v3/PiniaCount')
        expectManifestRemotes(
          manifest,
          ['Antd', 'ButtonComponent', 'Home', 'JSXComponent', 'PiniaCount', 'TableComponent', 'TsxScript'],
          'vue3Base',
          ':9301/emp.js',
        )
      }

      if (appDir === 'react-19-tanstack') {
        const routeTree = readFileSync(join(repoRoot, 'apps', appDir, 'src/routeTree.gen.ts'), 'utf8')
        expect(routeTree).toContain("'/router-lab'")
        expect(routeTree).toContain("'/router-lab/$id'")
        assertNoDefaultTailwindPostcssWarning(result.stderr)

        const html = readDistText(appDir, 'index.html')
        expect(html).toContain('href="/css/')
        expect(html).toContain('src="/js/index.')
        expect(html).not.toContain('href="css/')
        expect(html).not.toContain('src="js/index.')

        const css = readDistCss(appDir)
        expect(css).toContain('.tailwind-react-contaner')
        expect(css).toContain('group-hover')
      }
    }, 120000)
  }
})

describe('supplemental apps artifact contracts', () => {
  for (const appDir of supplementalAppAcceptance) {
    test(`${appDir} builds and keeps its artifact contract`, async () => {
      await buildApp(appDir)
      const distFiles = listDistFiles(appDir)

      if (appDir === 'adapter-host') {
        const manifest = readDistJson<FederationManifest>(appDir, 'emp.json')
        expect(existsSync(join(repoRoot, 'apps', appDir, 'dist', 'emp.js'))).toBe(true)
        expect(manifest.metaData?.buildInfo?.buildName).toBe('adapter-host')
        expect(manifest.metaData?.remoteEntry?.name).toBe('emp.js')
        expectManifestExposes(manifest, ['./App'])
      }

      if (appDir === 'demo') {
        expect(distFiles).toEqual(expect.arrayContaining(['index.html', 'info.html', 'proxy-test.html', 'work/index.html']))
        expectDistFileMatching(distFiles, /^js\/coreJs\.[a-f0-9]+\.js$/)
        expectDistFileMatching(distFiles, /^js\/lib-react\.[a-f0-9]+\.js$/)
        expectDistFileMatching(distFiles, /^js\/lib-antd\.[a-f0-9]+\.js$/)
        expectDistFileMatching(distFiles, /^js\/lib-common\.[a-f0-9]+\.js$/)
        expectDistFileMatching(distFiles, /^js\/proxy-test\.[a-f0-9]+\.js$/)
        const html = readDistText(appDir, 'index.html')
        expect(html).not.toContain('type="module"')
        expect(html.indexOf('js/coreJs.')).toBeGreaterThan(-1)
        expect(html.indexOf('js/coreJs.')).toBeLessThan(html.indexOf('js/index.'))
      }

      if (appDir === 'vue-2-base') {
        const manifest = readDistJson<FederationManifest>(appDir, 'mf-manifest.json')
        expect(manifest.metaData?.buildInfo?.buildName).toBe('vue-2-base')
        expect(manifest.metaData?.remoteEntry?.name).toBe('emp.js')
        expectManifestExposes(manifest, ['./CompositionApi', './Content', './Table', './setup', './store'])
      }

      if (appDir === 'vue-2-project') {
        const manifest = readDistJson<FederationManifest>(appDir, 'mf-manifest.json')
        expect(manifest.exposes).toEqual([])
        const remotes = manifest.remotes ?? []
        expect(remotes.map(remote => remote.moduleName).sort()).toEqual([
          'CompositionApi',
          'Content',
          'PiniaCount',
          'Table',
          'store',
        ])
        expect(
          remotes
            .filter(remote => remote.federationContainerName === 'vue2Base')
            .every(remote => String(remote.entry).endsWith(':9001/emp.js')),
        ).toBe(true)
        expect(remotes.find(remote => remote.moduleName === 'PiniaCount')?.federationContainerName).toBe('vue3Base')
        expect(remotes.find(remote => remote.moduleName === 'PiniaCount')?.entry).toMatch(/:9301\/emp\.js$/)
      }
    }, 120000)
  }
})
