import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import {describe, expect, test} from '@rstest/core'
import {repoRoot} from './helpers/repo-root'

const readJson = (file: string) => JSON.parse(readFileSync(join(repoRoot, file), 'utf8'))
const readText = (file: string) => readFileSync(join(repoRoot, file), 'utf8')

describe('toolchain version contract', () => {
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
      'release:check',
      'release:version',
      'release:changelog',
      'release:pack',
      'release:publish:dry',
      'release:publish',
    ])
  })

  test('root pins TypeScript 7 rc without the unused native tsgo preview', () => {
    const pkg = readJson('package.json')
    expect(pkg.devDependencies.typescript).toBe('7.0.1-rc')
    expect(pkg.devDependencies['@typescript/native-preview']).toBeUndefined()
    expect(pkg.scripts['test:ts7:prepare']).toBe(
      'corepack pnpm --filter @empjs/chain build && corepack pnpm --filter @empjs/cli build',
    )
    expect(pkg.scripts['test:ts7']).toBe(
      'corepack pnpm test:ts7:prepare && corepack pnpm dlx --package typescript@7.0.1-rc tsc --noEmit --pretty false --project packages/cli/tsconfig.json',
    )
    expect(pkg.scripts['test:tsgo']).toBeUndefined()
    expect(pkg.scripts['ci:verify']).not.toContain('test:tsgo')
    expect(readText('pnpm-lock.yaml')).not.toContain('@typescript/native-preview@7.0.0-dev')
  })

  test('apps acceptance includes shared tsconfig and DTS type guards', () => {
    const pkg = readJson('package.json')
    expect(pkg.scripts['apps:acceptance']).toBe(
      'corepack pnpm test:tsconfig && corepack pnpm empbuild && corepack pnpm apps:check && corepack pnpm test:apps:single && corepack pnpm test:library-output',
    )
    expect(pkg.scripts['test:release:rc1']).toBe('node scripts/run-root-test.mjs release-rc1')
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

  test('cli depends on Rspack 2.1 and TS7-aware checker', () => {
    const cliPkg = readJson('packages/cli/package.json')
    const reactPkg = readJson('packages/plugin-react/package.json')
    const cliRstestConfig = readText('packages/cli/rstest.config.ts')
    expect(cliPkg.dependencies['@rspack/core']).toBe('2.1.2')
    expect(cliPkg.dependencies['@rspack/dev-server']).toBe('^2.1.0')
    expect(reactPkg.dependencies['@rspack/plugin-react-refresh']).toBe('^2.0.0')
    expect(cliPkg.dependencies['@swc/helpers']).toBe('^0.5.23')
    expect(cliPkg.dependencies['ts-checker-rspack-plugin']).toBe('^1.5.1')
    expect(cliRstestConfig).toContain("pool: {type: 'forks', maxWorkers: 1, minWorkers: 1}")
    expect(cliRstestConfig).toContain('maxConcurrency: 1')
    expect(cliRstestConfig).toContain('testTimeout: 180000')
  })

  test('declaration tooling uses TS7-aware Rslib and Module Federation compatibility alias', () => {
    const pkg = readJson('package.json')
    const workspace = readText('pnpm-workspace.yaml')
    const lockfile = readText('pnpm-lock.yaml')
    const mfPatch = readText('patches/@module-federation__dts-plugin@2.6.0.patch')

    expect(pkg.devDependencies['@rslib/core']).toBe('^0.23.1')
    expect(pkg.devDependencies['typescript-mf']).toBe('npm:typescript@5.9.3')
    expect(pkg.devDependencies['typescript-rslib']).toBeUndefined()
    expect(workspace).toContain('patchedDependencies:')
    expect(workspace).toContain("'@module-federation/dts-plugin@2.6.0': patches/@module-federation__dts-plugin@2.6.0.patch")
    expect(workspace).not.toContain('rsbuild-plugin-dts: patches/rsbuild-plugin-dts.patch')
    expect(lockfile).toContain('rsbuild-plugin-dts@0.23.1')
    expect(lockfile).toContain('typescript: ^5 || ^6 || ^7.0.1-0')
    expect(mfPatch).toContain('from "typescript-mf"')
    expect(mfPatch).toContain('require("typescript-mf")')
  })
})
