import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import {describe, expect, test} from '@rstest/core'
import {repoRoot} from './helpers/repo-root'

const readJson = (file: string) => JSON.parse(readFileSync(join(repoRoot, file), 'utf8'))
const readText = (file: string) => readFileSync(join(repoRoot, file), 'utf8')
const readLockImporter = (importer: string) => {
  const lockfile = readText('pnpm-lock.yaml')
  const marker = `\n  ${importer}:\n`
  const start = lockfile.indexOf(marker)
  if (start === -1) {
    throw new Error(`Missing lockfile importer: ${importer}`)
  }
  const rest = lockfile.slice(start + marker.length)
  const nextImporter = rest.search(/\n  [^\s][^:\n]*:\n/)
  return nextImporter === -1 ? rest : rest.slice(0, nextImporter)
}

describe('toolchain version contract', () => {
  test('root README stays aligned with the v4 homepage product surface', () => {
    const readme = readText('README.md')

    expect(readme).toContain('docs/assets/emp-federation-fox-full.png')
    expect(readme).toContain('高性能微前端联邦构建')
    expect(readme).toContain('ESM 输出')
    expect(readme).toContain('ESM 优先输出')
    expect(readme).toContain('TS 7 稳定类型基线')
    expect(readme).toContain('TypeScript 7 stable')
    expect(readme).not.toContain('TypeScript 7 RC')
    expect(readme).toContain('Rspack 2')
    expect(readme).toContain('Module Federation 2')
  })

  test('root scripts are grouped by workflow area', () => {
    const pkg = readJson('package.json')
    expect(Object.keys(pkg.scripts)).toEqual([
      'emp',
      'emp:build',
      'emp:prod',
      'empbuild',
      'empbuild:lib',
      'empbuild:plugin',
      'empbuild:bridge',
      'empbuild:cdn',
      'website:dev',
      'website:build',
      'website:start',
      'offical:dev',
      'offical:build',
      'offical:start',
      'adapter',
      'adapter:build',
      'adapter:deploy',
      'adapter:start',
      'mf',
      'mf:prod',
      'vue',
      'vue:prod',
      'vue2',
      'vue2:prod',
      'cloudflare:mf-cjs',
      'cloudflare:mf-react',
      'cloudflare:mf-vue2',
      'cloudflare:mf-vue3',
      'cloudflare:react-19-tanstack',
      'test:cli',
      'test:real:cli',
      'test:packages',
      'test:plugins',
      'test:toolchain',
      'test:tsconfig',
      'test:ts7:prepare',
      'test:ts7',
      'test:ts7:packages',
      'test:rules',
      'test:apps:single',
      'test:library-output',
      'test:release:rc1',
      'test:apps:browser',
      'test:browser:all',
      'test:browser:watch',
      'workflow:check',
      'ci:verify',
      'apps:list',
      'apps:check',
      'apps:acceptance',
      'apps:bench',
      'static:list',
      'static:doctor',
      'static:start',
      'static:env',
      'cdn:serve',
      'lint',
      'check:rslib-presets',
      'release:acceptance',
      'release:check',
      'release:version',
      'release:changelog',
      'release:pack',
      'release:publish:dry',
      'release:publish',
    ])
  })

  test('root pins TypeScript 7 stable without the unused native tsgo preview', () => {
    const pkg = readJson('package.json')
    expect(pkg.devDependencies.typescript).toBe('7.0.2')
    expect(pkg.devDependencies['@typescript/native-preview']).toBeUndefined()
    expect(pkg.scripts['test:ts7:prepare']).toBe(
      'corepack pnpm --filter @empjs/chain build && corepack pnpm --filter @empjs/cli build',
    )
    expect(pkg.scripts['test:ts7']).toBe(
      'corepack pnpm test:ts7:prepare && corepack pnpm dlx --package typescript@7.0.2 tsc --noEmit --pretty false --project packages/cli/tsconfig.json',
    )
    expect(pkg.scripts['test:ts7:packages']).toContain('typescript@7.0.2')
    expect(pkg.scripts['test:tsgo']).toBeUndefined()
    expect(pkg.scripts['ci:verify']).not.toContain('test:tsgo')
    expect(readText('pnpm-lock.yaml')).not.toContain('@typescript/native-preview@7.0.0-dev')
  })

  test('project-facing TypeScript declarations use TS7 stable everywhere', () => {
    const cdnReact17Pkg = readJson('packages/cdn-react-17/package.json')
    const vue3BasePkg = readJson('apps/vue-3-base/package.json')
    const templates = readText('packages/cli/src/agent-create/templates.ts')

    expect(cdnReact17Pkg.devDependencies.typescript).toBe('7.0.2')
    expect(vue3BasePkg.devDependencies.typescript).toBe('7.0.2')
    expect(vue3BasePkg.devDependencies['@vue/tsconfig']).toBe('^0.9.1')
    expect(templates).toContain("typescript: '^7.0.2'")
    expect(templates).not.toContain("typescript: '^5.9.2'")
  })

  test('apps acceptance includes shared tsconfig and DTS type guards', () => {
    const pkg = readJson('package.json')
    expect(pkg.scripts['apps:acceptance']).toBe(
      'corepack pnpm test:tsconfig && corepack pnpm empbuild && corepack pnpm apps:check && corepack pnpm test:apps:single && corepack pnpm test:library-output',
    )
    expect(pkg.scripts['test:release:rc1']).toBe('node scripts/run-root-test.mjs release-rc1')
    expect(pkg.scripts['release:acceptance']).toBe('node scripts/release-acceptance-report.mjs')
    expect(readText('scripts/root-test-targets.mjs')).toContain(
      "const releaseTestTargetEntries = [['release-rc1', ['test/release-rc1.acceptance.test.ts']]]",
    )
  })

  test('package tests include real plugin config coverage', () => {
    const pkg = readJson('package.json')
    expect(pkg.scripts['test:plugins']).toBe(
      'corepack pnpm --filter @empjs/chain build && corepack pnpm empbuild:plugin && node scripts/run-root-test.mjs plugins',
    )
    expect(pkg.scripts['test:packages']).toContain('corepack pnpm test:plugins')
    expect(readText('scripts/root-test-targets.mjs')).toContain(
      "['plugins', ['test/plugin-config-shape.test.ts', 'test/plugin-output-coverage.test.ts']]",
    )
  })

  test('Rstest uses the current Rsbuild and Rspack stack', () => {
    const pkg = readJson('package.json')
    const cliPkg = readJson('packages/cli/package.json')
    const postcssPkg = readJson('packages/plugin-postcss/package.json')
    const lockfile = readText('pnpm-lock.yaml')

    expect(pkg.devDependencies['@rstest/core']).toBe('0.11.1')
    expect(pkg.devDependencies['@rstest/browser']).toBe('0.11.1')
    expect(cliPkg.devDependencies['@rstest/core']).toBe('0.11.1')
    expect(postcssPkg.dependencies['postcss-loader']).toBe('^8.2.1')
    expect(lockfile).toContain('@rstest/core@0.11.1')
    expect(lockfile).toContain('@rstest/browser@0.11.1')
    expect(lockfile).toContain('@rsbuild/core@2.1.5')
    expect(lockfile).toContain('@rspack/core@2.1.4')
    expect(lockfile).not.toContain('@rstest/core@0.11.0')
    expect(lockfile).not.toContain('@rstest/browser@0.11.0')
    expect(lockfile).not.toContain('@rsbuild/core@2.0.15')
    expect(lockfile).not.toContain('@rspack/core@2.0.8')
  })

  test('cli depends on the current Rspack 2.1 latest and TS7-aware tooling', () => {
    const cliPkg = readJson('packages/cli/package.json')
    const reactPkg = readJson('packages/plugin-react/package.json')
    const cliRstestConfig = readText('packages/cli/rstest.config.ts')
    const lockfile = readText('pnpm-lock.yaml')

    expect(cliPkg.dependencies['@rspack/core']).toBe('2.1.4')
    expect(cliPkg.dependencies['@rspack/dev-server']).toBe('^2.1.0')
    expect(reactPkg.dependencies['@rspack/plugin-react-refresh']).toBe('^2.0.2')
    expect(cliPkg.dependencies['@swc/helpers']).toBe('^0.5.23')
    expect(cliPkg.dependencies['@rsdoctor/rspack-plugin']).toBe('1.5.18')
    expect(cliPkg.dependencies.cors).toBe('2.8.6')
    expect(cliPkg.dependencies['fs-extra']).toBe('11.3.6')
    expect(cliPkg.dependencies['html-webpack-plugin']).toBe('5.6.7')
    expect(cliPkg.dependencies['ts-checker-rspack-plugin']).toBe('^1.5.2')
    expect(cliPkg.devDependencies['@vue/tsconfig']).toBe('^0.9.1')
    expect(lockfile).toContain('@rsdoctor/rspack-plugin@1.5.18')
    expect(lockfile).toContain('ts-checker-rspack-plugin@1.5.2')
    expect(lockfile).not.toContain('@rsdoctor/rspack-plugin@1.5.17')
    expect(lockfile).not.toContain('ts-checker-rspack-plugin@1.5.1')
    expect(cliRstestConfig).toContain("pool: {type: 'forks', maxWorkers: 1, minWorkers: 1}")
    expect(cliRstestConfig).toContain('maxConcurrency: 1')
    expect(cliRstestConfig).toContain('testTimeout: 180000')
  })

  test('emp-share keeps Module Federation current and SWC patched', () => {
    const sharePkg = readJson('packages/emp-share/package.json')
    const lockfile = readText('pnpm-lock.yaml')
    const shareLockImporter = readLockImporter('packages/emp-share')

    expect(sharePkg.dependencies['@module-federation/rspack']).toBe('^2.8.0')
    expect(sharePkg.dependencies['@module-federation/runtime']).toBe('^2.8.0')
    expect(sharePkg.dependencies['@module-federation/runtime-tools']).toBe('^2.8.0')
    expect(sharePkg.dependencies['@module-federation/sdk']).toBe('^2.8.0')
    expect(sharePkg.devDependencies['@swc/core']).toBe('^1.15.43')
    expect(lockfile).toContain('@module-federation/rspack@2.8.0')
    expect(lockfile).toContain('@module-federation/dts-plugin@2.8.0')
    expect(lockfile).toContain('@swc/core@1.15.43')
    expect(shareLockImporter).toContain('specifier: ^1.15.43')
    expect(shareLockImporter).toContain('version: 1.15.43(@swc/helpers@0.5.23)')
  })

  test('declaration tooling uses native TS7 support from Module Federation 2.8', () => {
    const pkg = readJson('package.json')
    const rslibPresetsPkg = readJson('packages/rslib-presets/package.json')
    const workspace = readText('pnpm-workspace.yaml')
    const lockfile = readText('pnpm-lock.yaml')
    expect(pkg.devDependencies['@rslib/core']).toBe('^0.23.2')
    expect(rslibPresetsPkg.dependencies['@rslib/core']).toBe('^0.23.2')
    expect(pkg.devDependencies['typescript-mf']).toBeUndefined()
    expect(pkg.devDependencies['typescript-rslib']).toBeUndefined()
    expect(workspace).not.toContain('patchedDependencies:')
    expect(workspace).not.toContain('@module-federation/dts-plugin@2.7.0')
    expect(workspace).not.toContain('rsbuild-plugin-dts: patches/rsbuild-plugin-dts.patch')
    expect(lockfile).toContain('rsbuild-plugin-dts@0.23.2')
    expect(lockfile).toContain('typescript: ^4.9.0 || ^5.0.0 || ^6.0.0 || ^7.0.0')
    expect(lockfile).toContain('typescript@7.0.2')
    expect(lockfile).not.toContain('typescript@5.9.3')
    expect(lockfile).not.toContain('typescript-mf')
  })
})
