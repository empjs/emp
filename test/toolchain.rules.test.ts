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
      'test:toolchain',
      'test:tsconfig',
      'test:ts7:prepare',
      'test:ts7',
      'test:ts7:packages',
      'test:tsgo',
      'test:rules',
      'test:apps:single',
      'test:apps:mf',
      'test:library-output',
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

  test('root pins TypeScript 7 rc and native tsgo preview', () => {
    const pkg = readJson('package.json')
    expect(pkg.devDependencies.typescript).toBe('7.0.1-rc')
    expect(pkg.devDependencies['@typescript/native-preview']).toBe('7.0.0-dev.20260624.1')
    expect(pkg.scripts['test:ts7:prepare']).toBe(
      'corepack pnpm --filter @empjs/chain build && corepack pnpm --filter @empjs/cli build',
    )
    expect(pkg.scripts['test:ts7']).toBe(
      'corepack pnpm test:ts7:prepare && corepack pnpm dlx --package typescript@7.0.1-rc tsc --noEmit --pretty false --project packages/cli/tsconfig.json',
    )
    expect(pkg.scripts['test:tsgo']).toBe(
      'corepack pnpm test:ts7:prepare && corepack pnpm dlx --package @typescript/native-preview@7.0.0-dev.20260624.1 tsgo --noEmit --pretty false --project packages/cli/tsconfig.json',
    )
  })

  test('cli depends on Rspack 2.1 and TS7-aware checker', () => {
    const cliPkg = readJson('packages/cli/package.json')
    expect(cliPkg.dependencies['@rspack/core']).toBe('^2.1.0')
    expect(cliPkg.dependencies['@rspack/dev-server']).toBe('^2.1.0')
    expect(cliPkg.dependencies['@swc/helpers']).toBe('^0.5.23')
    expect(cliPkg.dependencies['ts-checker-rspack-plugin']).toBe('^1.5.1')
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
