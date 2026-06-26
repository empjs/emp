import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import {describe, expect, test} from '@rstest/core'

const repoRoot = process.cwd()
const readJson = (file: string) => JSON.parse(readFileSync(join(repoRoot, file), 'utf8'))
const readText = (file: string) => readFileSync(join(repoRoot, file), 'utf8')

describe('toolchain version contract', () => {
  test('root pins TypeScript 7 rc and native tsgo preview', () => {
    const pkg = readJson('package.json')
    expect(pkg.devDependencies.typescript).toBe('7.0.1-rc')
    expect(pkg.devDependencies['@typescript/native-preview']).toBe('7.0.0-dev.20260624.1')
    expect(pkg.scripts['test:ts7']).toBe(
      'corepack pnpm dlx --package typescript@7.0.1-rc tsc --noEmit --pretty false --project packages/cli/tsconfig.json',
    )
    expect(pkg.scripts['test:tsgo']).toBe(
      'corepack pnpm dlx --package @typescript/native-preview@7.0.0-dev.20260624.1 tsgo --noEmit --pretty false --project packages/cli/tsconfig.json',
    )
  })

  test('cli depends on Rspack 2.1 and TS7-aware checker', () => {
    const cliPkg = readJson('packages/cli/package.json')
    expect(cliPkg.dependencies['@rspack/core']).toBe('^2.1.0')
    expect(cliPkg.dependencies['@rspack/dev-server']).toBe('^2.1.0')
    expect(cliPkg.dependencies['@swc/helpers']).toBe('^0.5.23')
    expect(cliPkg.dependencies['ts-checker-rspack-plugin']).toBe('^1.5.1')
  })

  test('declaration tooling uses explicit TypeScript compatibility aliases', () => {
    const pkg = readJson('package.json')
    const workspace = readText('pnpm-workspace.yaml')
    const rslibPatch = readText('patches/rsbuild-plugin-dts.patch')
    const mfPatch = readText('patches/@module-federation__dts-plugin@2.6.0.patch')

    expect(pkg.devDependencies['typescript-mf']).toBe('npm:typescript@5.9.3')
    expect(pkg.devDependencies['typescript-rslib']).toBe('npm:typescript@6.0.3')
    expect(workspace).toContain('patchedDependencies:')
    expect(workspace).toContain("'@module-federation/dts-plugin@2.6.0': patches/@module-federation__dts-plugin@2.6.0.patch")
    expect(workspace).toContain('rsbuild-plugin-dts: patches/rsbuild-plugin-dts.patch')
    expect(rslibPatch).toContain('utils_require("typescript-rslib")')
    expect(mfPatch).toContain('from "typescript-mf"')
    expect(mfPatch).toContain('require("typescript-mf")')
  })
})
