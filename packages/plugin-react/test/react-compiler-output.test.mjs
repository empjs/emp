import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs'
import {mkdir} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import Chain from '../../emp-chain/dist/index.js'
import pluginReact from '../dist/index.js'

const requireFromCli = createRequire(new URL('../../cli/package.json', import.meta.url))
const rspack = requireFromCli('@rspack/core')

function deepAssign(target, ...sources) {
  for (const source of sources) {
    for (const key in source) {
      const sourceValue = source[key]
      const targetValue = target[key]
      if (Object(sourceValue) === sourceValue && Object(targetValue) === targetValue) {
        target[key] = deepAssign(targetValue, sourceValue)
        continue
      }
      target[key] = sourceValue
    }
  }
  return target
}

function vCompare(preVersion = '', lastVersion = '') {
  const sources = preVersion.replace('^', '').split('.')
  const dests = lastVersion.replace('^', '').split('.')
  const maxLength = Math.max(sources.length, dests.length)

  for (let index = 0; index < maxLength; index++) {
    const source = Number(sources[index] ?? 0)
    const dest = Number(dests[index] ?? 0)
    if (source < dest) return -1
    if (source > dest) return 1
  }
  return 0
}

function createStore() {
  const chain = new Chain()
  const swcOptions = {
    jsc: {
      parser: {
        syntax: 'typescript',
        tsx: true,
      },
      transform: {},
    },
  }
  chain.module.rule('javascript').test(/\.[jt]sx?$/).use('swc').loader('builtin:swc-loader').options(swcOptions)
  chain.module.rule('typescript').test(/\.[jt]sx?$/).use('swc').loader('builtin:swc-loader').options(swcOptions)

  return {
    chain,
    deepAssign,
    empConfig: {
      server: {
        hot: false,
        port: 8000,
      },
    },
    injectTags() {},
    isDev: false,
    pkg: {
      dependencies: {
        react: '19.2.0',
      },
      devDependencies: {},
    },
    uniqueName: 'compiler_probe',
    vCompare,
  }
}

async function compileWithReactPlugin(pluginOptions) {
  const tempDir = mkdtempSync(join(tmpdir(), 'emp-react-compiler-output-'))
  const sourceDir = join(tempDir, 'src')
  const outputDir = join(tempDir, 'dist')

  try {
    await mkdir(sourceDir, {recursive: true})
    writeFileSync(
      join(sourceDir, 'index.tsx'),
      [
        "import React from 'react'",
        '',
        'export function Probe({count}: {count: number}) {',
        "  const label = 'count:' + count",
        '  return <section className="probe"><span>{label}</span></section>',
        '}',
        '',
        'console.log(<Probe count={1} />)',
        '',
      ].join('\n'),
    )

    const store = createStore()
    await pluginReact(pluginOptions).rsConfig(store)

    const compiler = rspack({
      context: tempDir,
      devtool: false,
      entry: './src/index.tsx',
      externals: {
        react: 'React',
        'react/compiler-runtime': 'ReactCompilerRuntime',
        'react/jsx-runtime': 'ReactJSXRuntime',
      },
      mode: 'development',
      module: {
        rules: store.chain.toConfig().module.rules,
      },
      output: {
        filename: 'bundle.js',
        path: outputDir,
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
      },
    })

    const stats = await new Promise((resolve, reject) => {
      compiler.run((error, stats) => {
        compiler.close(closeError => {
          if (closeError && !error) reject(closeError)
        })
        if (error) reject(error)
        else resolve(stats)
      })
    })

    assert.equal(stats.hasErrors(), false, stats.toString({all: false, errors: true, warnings: true}))
    return readFileSync(join(outputDir, 'bundle.js'), 'utf8')
  } finally {
    rmSync(tempDir, {force: true, recursive: true})
  }
}

const disabledBundle = await compileWithReactPlugin({})
assert.equal(disabledBundle.includes('react/compiler-runtime'), false)
assert.equal(disabledBundle.includes('_c('), false)

const enabledBundle = await compileWithReactPlugin({reactCompiler: true})
assert.ok(enabledBundle.includes('react/compiler-runtime'), 'expected compiled output to import react/compiler-runtime')
assert.ok(
  /react_compiler_runtime[\s\S]*\.c\)\(\d+\)/.test(enabledBundle),
  'expected compiled output to use React Compiler memo cache helper',
)
