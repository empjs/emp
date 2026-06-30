import assert from 'node:assert/strict'
import {mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs'
import {mkdir} from 'node:fs/promises'
import {createRequire} from 'node:module'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import Chain from '../../emp-chain/dist/index.js'
import pluginReact from '../dist/index.js'

const requireFromCli = createRequire(new URL('../../cli/package.json', import.meta.url))
const rspack = requireFromCli('@rspack/core')
const iterations = 5000

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
    uniqueName: 'compiler_performance_probe',
    vCompare,
  }
}

async function compileAndBenchmark(pluginOptions) {
  const tempDir = mkdtempSync(join(tmpdir(), 'emp-react-compiler-performance-'))
  const runtimeDir = join(tempDir, 'runtime')
  const sourceDir = join(tempDir, 'src')
  const outputDir = join(tempDir, 'dist')
  const bundlePath = join(outputDir, 'bundle.cjs')

  try {
    await mkdir(runtimeDir, {recursive: true})
    await mkdir(sourceDir, {recursive: true})
    writeFileSync(
      join(runtimeDir, 'compiler-runtime.js'),
      [
        "const sentinel = Symbol.for('react.memo_cache_sentinel')",
        'const cache = []',
        'export function c(size) {',
        '  if (cache.length !== size) {',
        '    cache.length = size',
        '    cache.fill(sentinel)',
        '  }',
        '  return cache',
        '}',
        '',
      ].join('\n'),
    )
    writeFileSync(
      join(runtimeDir, 'jsx-runtime.js'),
      [
        'let jsxCalls = 0',
        '',
        'export function resetJSXCalls() {',
        '  jsxCalls = 0',
        '}',
        '',
        'export function getJSXCalls() {',
        '  return jsxCalls',
        '}',
        '',
        'export function jsx(type, props) {',
        '  jsxCalls += 1',
        '  return {type, props}',
        '}',
        'export const jsxs = jsx',
        "export const Fragment = Symbol.for('react.fragment')",
        '',
      ].join('\n'),
    )
    writeFileSync(
      join(sourceDir, 'index.tsx'),
      [
        "import {getJSXCalls, resetJSXCalls} from 'react/jsx-runtime'",
        '',
        'export function Probe({count}: {count: number}) {',
        "  const label = 'count:' + count",
        '  return <section className="probe"><span>{label}</span></section>',
        '}',
        '',
        'export function runBenchmark(iterations: number) {',
        '  resetJSXCalls()',
        '  const startedAt = globalThis.performance.now()',
        '  let last: any',
        '  for (let index = 0; index < iterations; index += 1) {',
        '    last = Probe({count: 7})',
        '  }',
        '  const elapsedMs = globalThis.performance.now() - startedAt',
        '  return {',
        '    elapsedMs,',
        '    jsxCalls: getJSXCalls(),',
        '    lastText: last.props.children.props.children,',
        '  }',
        '}',
        '',
      ].join('\n'),
    )

    const store = createStore()
    await pluginReact(pluginOptions).rsConfig(store)

    const compiler = rspack({
      context: tempDir,
      devtool: false,
      entry: './src/index.tsx',
      mode: 'development',
      module: {
        rules: store.chain.toConfig().module.rules,
      },
      output: {
        filename: 'bundle.cjs',
        library: {
          type: 'commonjs2',
        },
        path: outputDir,
      },
      optimization: {
        minimize: false,
      },
      resolve: {
        alias: {
          'react/compiler-runtime': join(runtimeDir, 'compiler-runtime.js'),
          'react/jsx-runtime': join(runtimeDir, 'jsx-runtime.js'),
        },
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
      },
      target: 'node',
    })

    const stats = await new Promise((resolve, reject) => {
      compiler.run((error, stats) => {
        compiler.close(closeError => {
          if (error) {
            reject(error)
          } else if (closeError) {
            reject(closeError)
          } else {
            resolve(stats)
          }
        })
      })
    })

    assert.equal(stats.hasErrors(), false, stats.toString({all: false, errors: true, warnings: true}))

    const bundleSource = readFileSync(bundlePath, 'utf8')
    const requireBundle = createRequire(bundlePath)
    const benchmark = requireBundle(bundlePath).runBenchmark(iterations)

    return {
      benchmark,
      bundleSource,
    }
  } finally {
    rmSync(tempDir, {force: true, recursive: true})
  }
}

const disabled = await compileAndBenchmark({})
assert.equal(disabled.bundleSource.includes('react.memo_cache_sentinel'), false)
assert.equal(disabled.benchmark.jsxCalls, iterations * 2)

const enabled = await compileAndBenchmark({reactCompiler: true})
assert.ok(enabled.bundleSource.includes('react.memo_cache_sentinel'), 'expected enabled output to bundle memo cache runtime')
assert.equal(enabled.benchmark.lastText, disabled.benchmark.lastText)
assert.ok(
  enabled.benchmark.jsxCalls <= 2,
  `expected React Compiler to cache repeated JSX work, got ${enabled.benchmark.jsxCalls} JSX calls`,
)

const avoidedJSXCalls = disabled.benchmark.jsxCalls - enabled.benchmark.jsxCalls
const jsxCallReductionPercent = Number(((avoidedJSXCalls / disabled.benchmark.jsxCalls) * 100).toFixed(2))
assert.ok(jsxCallReductionPercent >= 99, `expected at least 99% JSX-call reduction, got ${jsxCallReductionPercent}%`)

const elapsedReductionPercent =
  disabled.benchmark.elapsedMs > 0
    ? Number((((disabled.benchmark.elapsedMs - enabled.benchmark.elapsedMs) / disabled.benchmark.elapsedMs) * 100).toFixed(2))
    : 0

console.log(
  JSON.stringify(
    {
      reactCompilerBenchmark: {
        iterations,
        disabledJSXCalls: disabled.benchmark.jsxCalls,
        enabledJSXCalls: enabled.benchmark.jsxCalls,
        avoidedJSXCalls,
        jsxCallReductionPercent,
        disabledElapsedMs: Number(disabled.benchmark.elapsedMs.toFixed(3)),
        enabledElapsedMs: Number(enabled.benchmark.elapsedMs.toFixed(3)),
        elapsedReductionPercent,
      },
    },
    null,
    2,
  ),
)
