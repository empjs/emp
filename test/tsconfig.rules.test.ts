import {execFileSync} from 'node:child_process'
import {existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs'
import {join} from 'node:path'
import {describe, expect, test} from '@rstest/core'
import {repoRoot} from './helpers/repo-root'

const trackedTsconfigs = execFileSync('git', ['ls-files'], {cwd: repoRoot, encoding: 'utf8'})
  .trim()
  .split('\n')
  .filter(file => /(^|\/)tsconfig[^/]*\.json$/.test(file))
  .filter(file => file.startsWith('packages/') || file.startsWith('apps/'))
  .filter(file => existsSync(join(repoRoot, file)))

const stripJsonComments = (text: string) =>
  text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')

const readTsconfig = (file: string) => {
  try {
    return JSON.parse(stripJsonComments(readFileSync(join(repoRoot, file), 'utf8')))
  } catch (error) {
    throw new Error(`${file}: ${(error as Error).message}`)
  }
}

const runTsc = (project: string) => {
  try {
    execFileSync('npx', ['tsc', '--noEmit', '--pretty', 'false', '--project', project], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: 'pipe',
    })
  } catch (error) {
    const result = error as Error & {stdout?: string; stderr?: string}
    throw new Error([result.message, result.stdout, result.stderr].filter(Boolean).join('\n'))
  }
}

describe('TS7-compatible tsconfig contract', () => {
  test('tracked tsconfigs do not use removed TypeScript 7 options', () => {
    const offenders: string[] = []
    for (const file of trackedTsconfigs) {
      const config = readTsconfig(file)
      const compilerOptions = config.compilerOptions ?? {}
      if ('baseUrl' in compilerOptions) offenders.push(`${file}:baseUrl`)
      if (['node', 'node10'].includes(String(compilerOptions.moduleResolution).toLowerCase())) {
        offenders.push(`${file}:moduleResolution=${compilerOptions.moduleResolution}`)
      }
    }
    expect(offenders).toEqual([])
  })

  test('package and app tsconfigs inherit the shared baselines', () => {
    const offenders: string[] = []
    for (const file of trackedTsconfigs) {
      if (file === 'packages/tsconfig.base.json') continue
      const config = readTsconfig(file)
      if (file.startsWith('packages/') && file.endsWith('/tsconfig.json') && !file.includes('/cli/')) {
        if (!['../tsconfig.rslib-bundler.json', '../tsconfig.rslib-nodenext.json'].includes(config.extends)) {
          offenders.push(`${file}:extends=${config.extends}`)
        }
      }
      if (file.startsWith('apps/') && file.endsWith('/tsconfig.json')) {
        if (!['@empjs/cli/tsconfig/react', '@empjs/cli/tsconfig/vue'].includes(config.extends)) {
          offenders.push(`${file}:extends=${config.extends}`)
        }
      }
    }
    expect(offenders).toEqual([])
  })

  test('app tsconfigs with custom paths keep inherited defaults explicitly', () => {
    const offenders: string[] = []
    for (const file of trackedTsconfigs.filter(file => file.startsWith('apps/'))) {
      const config = readTsconfig(file)
      const paths = config.compilerOptions?.paths
      if (!paths) continue
      if (!paths['src/*']) offenders.push(`${file}:missing src/*`)
      if (!paths['*']) offenders.push(`${file}:missing @mf-types fallback`)
    }
    expect(offenders).toEqual([])
  })

  test('package tsconfigs keep local rootDir for Rslib declaration layout', () => {
    const offenders: string[] = []
    for (const file of trackedTsconfigs) {
      if (!file.startsWith('packages/') || !file.endsWith('/tsconfig.json') || file.includes('/cli/')) continue
      const config = readTsconfig(file)
      if (['../tsconfig.rslib-bundler.json', '../tsconfig.rslib-nodenext.json'].includes(config.extends)) {
        if (config.compilerOptions?.rootDir !== 'src') offenders.push(`${file}:rootDir=${config.compilerOptions?.rootDir}`)
      }
    }
    expect(offenders).toEqual([])
  })

  test('shared app baseline accepts style imports under TypeScript 7', () => {
    const tempRoot = join(repoRoot, 'apps/mf-host/node_modules/.tmp')
    mkdirSync(tempRoot, {recursive: true})
    const tempDir = mkdtempSync(join(tempRoot, 'emp-tsconfig-style-'))

    try {
      const srcDir = join(tempDir, 'src')
      mkdirSync(srcDir, {recursive: true})
      writeFileSync(
        join(srcDir, 'index.ts'),
        [
          "import classes from './app.module.scss'",
          "import './app.css'",
          "import './app.scss'",
          "import './app.sass'",
          "import './app.less'",
          "import './app.styl'",
          '',
          "export const ready = Boolean(classes.wrap2 && classes['button-1'])",
          '',
        ].join('\n'),
      )

      for (const styleFile of ['app.module.scss', 'app.css', 'app.scss', 'app.sass', 'app.less', 'app.styl']) {
        writeFileSync(join(srcDir, styleFile), '')
      }

      const tsconfig = join(tempDir, 'tsconfig.json')
      writeFileSync(
        tsconfig,
        `${JSON.stringify(
          {
            extends: '@empjs/cli/tsconfig/react',
            include: ['src'],
          },
          null,
          2,
        )}\n`,
      )

      runTsc(tsconfig)
    } finally {
      rmSync(tempDir, {force: true, recursive: true})
    }
  })
})
