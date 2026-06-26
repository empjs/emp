import assert from 'node:assert/strict'
import Chain from '../../emp-chain/dist/index.js'
import pluginReact from '../dist/index.js'

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

const chain = new Chain()
chain.module.rule('javascript').use('swc').options({jsc: {transform: {}}})
chain.module.rule('typescript').use('swc').options({jsc: {transform: {}}})

const store = {
  chain,
  deepAssign,
  empConfig: {
    server: {
      hot: true,
      port: 8000,
    },
  },
  injectTags() {},
  isDev: true,
  pkg: {
    dependencies: {
      react: '19.2.0',
    },
    devDependencies: {},
  },
  uniqueName: 'demo',
  vCompare,
}

await pluginReact({reactCompiler: {target: '19'}}).rsConfig(store)

const plugins = chain.toConfig().plugins || []
const reactRefresh = plugins.find(plugin => plugin?.ReactRefreshRspackPlugin || plugin?.constructor?.name === 'ReactRefreshRspackPlugin')

assert.ok(reactRefresh, 'expected plugin-react-refresh to be registered')
assert.ok(
  typeof reactRefresh === 'function' || typeof reactRefresh.apply === 'function',
  `expected plugin-react-refresh to be a rspack plugin, got keys: ${Object.keys(reactRefresh).join(', ')}`,
)

const swcUses = chain
  .toConfig()
  .module.rules.flatMap(rule => rule.use ?? [])
  .filter(use => use.options?.jsc?.transform)

assert.ok(swcUses.length >= 2)
assert.ok(
  swcUses.every(use => use.options.jsc.transform.reactCompiler?.target === '19'),
  'expected plugin-react to apply reactCompiler options to every SWC rule',
)
