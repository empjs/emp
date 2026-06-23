import assert from 'node:assert/strict'
import {pluginRspackEmpShare} from '../dist/rspack.js'

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

const registeredPlugins = []
const store = {
  chain: {
    merge() {},
    output: {
      set() {},
    },
    plugin(name) {
      return {
        use(Plugin, args) {
          registeredPlugins.push({name, Plugin, args})
        },
      }
    },
  },
  deepAssign,
  empConfig: {
    output: {
      uniqueName: 'demo',
    },
  },
  encodeVarName(value) {
    return value
  },
  injectTags() {},
  mode: 'development',
}

await pluginRspackEmpShare({
  name: 'demo',
  remotes: {
    app: 'app@http://localhost:3001/emp.json',
  },
  forceRemotes: {
    app: {
      entry: 'http://localhost:3002/emp.json',
    },
  },
  dts: {
    consumeTypes: true,
  },
  empRuntime: {
    runtime: {
      lib: 'http://localhost:2100/sdk.js',
    },
  },
}).rsConfig(store)

const mfPlugin = registeredPlugins.find(plugin => plugin.name === 'plugin-emp-share')
assert.ok(mfPlugin, 'expected ModuleFederationPlugin to be registered')

const [mfOptions] = mfPlugin.args
assert.deepEqual(mfOptions.dts.consumeTypes.runtimePkgs, ['@empjs/share/sdk'])
assert.equal(mfOptions.runtimePlugins.length, 1)
assert.match(mfOptions.runtimePlugins[0], /dist\/forceRemote\.js$/)
