import assert from 'node:assert/strict'
import {execFile as execFileCallback} from 'node:child_process'
import {mkdir, realpath, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import path from 'node:path'
import {promisify} from 'node:util'

const repoRoot = path.resolve(import.meta.dirname, '../../..')
const execFile = promisify(execFileCallback)

const createFixture = async (name, empConfig) => {
  const root = path.join(tmpdir(), `emp-rspack2-${name}-${process.pid}`)
  await mkdir(path.join(root, 'src'), {recursive: true})
  await writeFile(path.join(root, 'package.json'), JSON.stringify({name, private: true, version: '0.0.0'}, null, 2))
  await writeFile(path.join(root, 'src/index.ts'), "export const fixtureValue = 'ok'\n")
  await writeFile(path.join(root, 'emp.config.ts'), `export default ${JSON.stringify(empConfig, null, 2)}\n`)
  return root
}

const loadConfigForFixture = async fixtureRoot => {
  const script = `
    process.chdir(${JSON.stringify(fixtureRoot)})
    process.env.NODE_ENV = ''
    process.env.ENV = ''
    const {store} = await import(${JSON.stringify(`file://${path.join(repoRoot, 'packages/cli/dist/index.js')}`)})
    await store.setup('build', {})
    console.log('__EMP_JSON__' + JSON.stringify(store.rsConfig))
  `
  const {stdout} = await execFile(process.execPath, ['--input-type=module', '--eval', script], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024 * 10,
  })
  const jsonStart = stdout.indexOf('__EMP_JSON__')
  assert.notEqual(jsonStart, -1, stdout)
  return JSON.parse(stdout.slice(jsonStart + '__EMP_JSON__'.length).trim())
}

{
  const {rspack} = await import(`file://${path.join(repoRoot, 'packages/cli/dist/index.js')}`)
  assert.equal(rspack.rspackVersion, '2.1.4')
}

{
  const fixtureRoot = await createFixture('modern-module', {
    appSrc: 'src',
    appEntry: 'index.ts',
    build: {
      useESM: true,
      target: 'es2018',
    },
  })
  const config = await loadConfigForFixture(fixtureRoot)

  assert.equal(config.output.module, true)
  assert.equal(config.output.library.type, 'modern-module')
  assert.equal(config.output.library.preserveModules, await realpath(path.join(fixtureRoot, 'src')))
}

{
  const config = await loadConfigForFixture(
    await createFixture('rspack2-options', {
      appSrc: 'src',
      appEntry: 'index.ts',
      build: {
        moduleIds: 'hashed',
        rspack: {
          splitChunks: {
            chunks: 'all',
            enforceSizeThreshold: 80000,
          },
          experiments: {
            pureFunctions: true,
            deferImport: true,
            sourceImport: true,
          },
          parser: {
            javascript: {
              pureFunctions: ['createPureValue'],
            },
            css: {
              resolveImport: false,
            },
          },
          swc: {
            detectSyntax: 'auto',
          },
        },
      },
    }),
  )

  assert.equal(config.optimization.moduleIds, 'hashed')
  assert.equal(config.optimization.splitChunks.chunks, 'all')
  assert.equal(config.optimization.splitChunks.enforceSizeThreshold, 80000)
  assert.equal(config.experiments.pureFunctions, true)
  assert.equal(config.experiments.deferImport, true)
  assert.equal(config.experiments.sourceImport, true)
  assert.equal(config.module.parser.javascript.createRequire, true)
  assert.deepEqual(config.module.parser.javascript.pureFunctions, ['createPureValue'])
  assert.equal(config.module.parser.css.resolveImport, false)
  assert.equal(config.module.parser['css/auto'].resolveImport, false)
  assert.equal(config.module.parser['css/module'].resolveImport, false)
  const swcUses = config.module.rules
    .flatMap(rule => rule.use ?? [])
    .filter(use => use.loader === 'builtin:swc-loader')
  assert.ok(swcUses.length >= 2)
  assert.ok(swcUses.every(use => use.options.detectSyntax === 'auto'))
}

{
  const config = await loadConfigForFixture(
    await createFixture('rspack21-options', {
      appSrc: 'src',
      appEntry: 'index.ts',
      cache: {
        type: 'persistent',
        maxAge: 1000 * 60 * 60,
        maxVersions: 2,
      },
      build: {
        rspack: {
          experiments: {
            runtimeMode: 'single',
            sourceImport: true,
          },
        },
      },
    }),
  )

  assert.equal(config.experiments.runtimeMode, 'single')
  assert.equal(config.experiments.sourceImport, true)
  assert.equal(config.cache.type, 'persistent')
  assert.equal(config.cache.maxAge, 1000 * 60 * 60)
  assert.equal(config.cache.maxVersions, 2)
}

{
  const config = await loadConfigForFixture(
    await createFixture('rspack21-defaults', {
      appSrc: 'src',
      appEntry: 'index.ts',
    }),
  )

  assert.equal(config.module.parser.javascript.createRequire, true)
  assert.equal(config.cache.type, 'persistent')
  assert.equal(config.cache.maxAge, 7 * 24 * 60 * 60)
  assert.equal(config.cache.maxVersions, 3)
  assert.equal(config.experiments.sourceImport, undefined)
}
