import assert from 'node:assert/strict'
import {execFile as execFileCallback} from 'node:child_process'
import {mkdir, writeFile} from 'node:fs/promises'
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
  assert.equal(rspack.rspackVersion, '2.2.3')
}

{
  const config = await loadConfigForFixture(
    await createFixture('default-target', {
      appSrc: 'src',
      appEntry: 'index.ts',
    }),
  )

  assert.deepEqual(config.target, ['web', 'es5'])
  const swcUses = config.module.rules.flatMap(rule => rule.use ?? []).filter(use => use.loader === 'builtin:swc-loader')
  assert.ok(swcUses.every(use => use.options.jsc?.target === 'es5'))
}

{
  const config = await loadConfigForFixture(
    await createFixture('css-prefix', {
      appSrc: 'src',
      appEntry: 'index.ts',
      css: {prefixName: 'product'},
    }),
  )

  assert.match(config.module.generator['css/auto'].localIdentName, /^product-/)
  assert.match(config.module.generator['css/module'].localIdentName, /^product-/)
}

{
  const config = await loadConfigForFixture(
    await createFixture('legacy-css-prefix', {
      appSrc: 'src',
      appEntry: 'index.ts',
      css: {prifixName: 'legacy'},
    }),
  )

  assert.match(config.module.generator['css/auto'].localIdentName, /^legacy-/)
  assert.match(config.module.generator['css/module'].localIdentName, /^legacy-/)
}

{
  const fixtureRoot = await createFixture('esm-format', {
    appSrc: 'src',
    appEntry: 'index.ts',
    build: {
      targets: ['Chrome >= 80', 'Safari >= 14'],
      format: 'esm',
    },
  })
  const config = await loadConfigForFixture(fixtureRoot)

  assert.equal(config.target, 'browserslist:Chrome >= 80, Safari >= 14')
  assert.equal(config.output.module, true)
  assert.equal(config.output.library, undefined)
  const swcUses = config.module.rules
    .flatMap(rule => rule.use ?? [])
    .filter(use => use.loader === 'builtin:swc-loader')
  assert.ok(swcUses.every(use => use.options.env?.targets?.includes('Chrome >= 80')))
  assert.ok(swcUses.every(use => use.options.jsc?.target === undefined))
}

{
  const config = await loadConfigForFixture(
    await createFixture('compatibility-target', {
      appSrc: 'src',
      appEntry: 'index.ts',
      build: {
        targets: ['Chrome >= 60'],
        format: 'script',
        polyfill: {
          mode: 'entry',
          splitChunks: true,
        },
      },
    }),
  )

  assert.equal(config.target, 'browserslist:Chrome >= 60')
  assert.equal(config.output.module, false)
  const swcUses = config.module.rules
    .flatMap(rule => rule.use ?? [])
    .filter(use => use.loader === 'builtin:swc-loader')
  assert.ok(swcUses.length >= 2)
  assert.ok(swcUses.every(use => use.options.env?.mode === 'entry'))
  assert.ok(swcUses.every(use => use.options.env?.targets?.includes('Chrome >= 60')))
}

{
  const config = await loadConfigForFixture(
    await createFixture('legacy-syntax-target', {
      appSrc: 'src',
      appEntry: 'index.ts',
      build: {
        target: 'es2017',
      },
      output: {
        environment: {
          optionalChaining: true,
        },
      },
    }),
  )

  assert.deepEqual(config.target, ['web', 'es2017'])
  assert.equal(config.output.environment.optionalChaining, true)
  const swcUses = config.module.rules
    .flatMap(rule => rule.use ?? [])
    .filter(use => use.loader === 'builtin:swc-loader')
  assert.ok(swcUses.every(use => use.options.jsc?.target === 'es2017'))
  assert.ok(swcUses.every(use => use.options.env === undefined))
}

{
  const config = await loadConfigForFixture(
    await createFixture('legacy-esm-alias', {
      appSrc: 'src',
      appEntry: 'index.ts',
      build: {
        target: 'es2018',
        useESM: true,
      },
    }),
  )

  assert.equal(config.output.module, true)
}

{
  const config = await loadConfigForFixture(
    await createFixture('legacy-devtool-disabled', {
      appSrc: 'src',
      appEntry: 'index.ts',
      build: {
        devtool: false,
      },
    }),
  )

  assert.equal(config.devtool, false)
}

{
  const config = await loadConfigForFixture(
    await createFixture('legacy-browser-targets', {
      appSrc: 'src',
      appEntry: 'index.ts',
      build: {
        polyfill: {
          mode: 'entry',
          browserslist: ['Chrome >= 70'],
        },
      },
    }),
  )

  assert.equal(config.target, 'browserslist:Chrome >= 70')
  const swcUses = config.module.rules.flatMap(rule => rule.use ?? []).filter(use => use.loader === 'builtin:swc-loader')
  assert.ok(swcUses.every(use => use.options.env?.targets?.includes('Chrome >= 70')))
}

{
  await assert.rejects(
    loadConfigForFixture(
      await createFixture('conflicting-format', {
        appSrc: 'src',
        appEntry: 'index.ts',
        build: {
          format: 'script',
          useESM: true,
        },
      }),
    ),
    /build\.format .* build\.useESM/,
  )
}

{
  await assert.rejects(
    loadConfigForFixture(
      await createFixture('conflicting-targets', {
        appSrc: 'src',
        appEntry: 'index.ts',
        build: {
          target: 'es2015',
          targets: ['Chrome >= 60'],
        },
      }),
    ),
    /build\.targets .* build\.target/,
  )
}

{
  await assert.rejects(
    loadConfigForFixture(
      await createFixture('conflicting-browser-alias', {
        appSrc: 'src',
        appEntry: 'index.ts',
        build: {
          targets: ['Chrome >= 60'],
          polyfill: {browserslist: ['Chrome >= 70']},
        },
      }),
    ),
    /build\.targets .* build\.polyfill\.browserslist/,
  )
}

{
  await assert.rejects(
    loadConfigForFixture(
      await createFixture('conflicting-sourcemap-alias', {
        appSrc: 'src',
        appEntry: 'index.ts',
        build: {
          devtool: 'source-map',
          sourcemap: {js: 'hidden-source-map'},
        },
      }),
    ),
    /build\.sourcemap\.js .* build\.devtool/,
  )
}

{
  await assert.rejects(
    loadConfigForFixture(
      await createFixture('conflicting-css-prefix-alias', {
        appSrc: 'src',
        appEntry: 'index.ts',
        css: {
          prefixName: 'canonical',
          prifixName: 'legacy',
        },
      }),
    ),
    /css\.prefixName .* css\.prifixName/,
  )
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
    await createFixture('rspack22-options', {
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
  assert.equal(config.cache.maxVersions, undefined)
}

{
  const config = await loadConfigForFixture(
    await createFixture('rspack22-defaults', {
      appSrc: 'src',
      appEntry: 'index.ts',
    }),
  )

  assert.equal(config.module.parser.javascript.createRequire, true)
  assert.equal(config.cache.type, 'persistent')
  assert.equal(config.cache.maxAge, 7 * 24 * 60 * 60)
  assert.equal(config.cache.maxVersions, undefined)
  assert.equal(config.experiments.sourceImport, undefined)
}
