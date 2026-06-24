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

function createStore(overrides = {}) {
  const registeredPlugins = []
  const outputSets = []
  const merges = []

  const store = {
    chain: {
      merge(value) {
        merges.push(value)
      },
      output: {
        set(key, value) {
          outputSets.push([key, value])
        },
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
      css: {},
      output: {
        uniqueName: 'legacy_unique_name',
      },
    },
    encodeVarName(value) {
      return value.replace(/@/g, '').replace(/[^\w_]/g, '_')
    },
    injectTags() {},
    isDev: false,
    mode: 'production',
    pkg: {
      name: '@nova/bigolive-common',
      version: '3.88.0',
    },
    ...overrides,
  }

  return {store, registeredPlugins, outputSets, merges}
}

async function runSharePlugin(options, storeOverrides) {
  const ctx = createStore(storeOverrides)
  await pluginRspackEmpShare(options).rsConfig(ctx.store)
  const mfPlugin = ctx.registeredPlugins.find(plugin => plugin.name === 'plugin-emp-share')
  assert.ok(mfPlugin, 'expected ModuleFederationPlugin to be registered')
  const [mfOptions] = mfPlugin.args
  return {...ctx, mfOptions}
}

{
  const {mfOptions, outputSets, merges} = await runSharePlugin({
    name: 'legacy-share',
    empRuntime: {
      runtime: {
        lib: 'http://localhost:2100/sdk.js',
      },
    },
  })

  assert.equal(mfOptions.name, 'legacy_share')
  assert.equal(mfOptions.filename, 'emp.js')
  assert.deepEqual(outputSets, [['uniqueName', 'legacy_share']])
  assert.equal(merges.find(value => value.module?.generator?.['css/module']?.localIdentName), undefined)
}

{
  const {mfOptions, outputSets, merges} = await runSharePlugin({
    name: 'legacy-share',
    empRuntime: {
      version: true,
      runtime: {
        lib: 'http://localhost:2100/sdk.js',
      },
    },
  })

  assert.equal(mfOptions.name, 'nova_bigolive_common_3_88_0')
  assert.equal(mfOptions.filename, 'emp.js')
  assert.deepEqual(outputSets, [['uniqueName', 'nova_bigolive_common_3_88_0']])
  assert.equal(
    merges.find(value => value.module?.generator?.['css/module']?.localIdentName)?.module.generator['css/module']
      .localIdentName,
    'nova_bigolive_common_3_88_0-[local]-[hash:5]',
  )
  assert.equal(
    merges.find(value => value.module?.generator?.['css/auto']?.localIdentName)?.module.generator['css/auto']
      .localIdentName,
    'nova_bigolive_common_3_88_0-[local]-[hash:5]',
  )
}

{
  const {mfOptions, outputSets, merges} = await runSharePlugin(
    {
      name: 'legacy-share',
      empRuntime: {
        version: true,
        runtime: {
          lib: 'http://localhost:2100/sdk.js',
        },
      },
    },
    {isDev: true},
  )

  assert.equal(mfOptions.name, 'nova_bigolive_common_3_88_0')
  assert.deepEqual(outputSets, [['uniqueName', 'nova_bigolive_common_3_88_0']])
  assert.equal(
    merges.find(value => value.module?.generator?.['css/module']?.localIdentName)?.module.generator['css/module']
      .localIdentName,
    'nova_bigolive_common_3_88_0-[id]-[local]-[hash:base64:8]',
  )
}

{
  const {mfOptions, outputSets, merges} = await runSharePlugin({
    name: 'legacy-share',
    empRuntime: {
      version: false,
      runtime: {
        lib: 'http://localhost:2100/sdk.js',
      },
    },
  })

  assert.equal(mfOptions.name, 'legacy_share')
  assert.equal(mfOptions.filename, 'emp.js')
  assert.deepEqual(outputSets, [['uniqueName', 'legacy_share']])
  assert.equal(merges.find(value => value.module?.generator?.['css/module']?.localIdentName), undefined)
}

{
  const {mfOptions, outputSets, merges} = await runSharePlugin(
    {
      name: 'legacy-share',
      empRuntime: {
        version: true,
        runtime: {
          lib: 'http://localhost:2100/sdk.js',
        },
      },
    },
    {
      empConfig: {
        css: {
          prifixName: 'custom_css',
        },
        output: {
          uniqueName: 'legacy_unique_name',
        },
      },
    },
  )

  assert.equal(mfOptions.name, 'nova_bigolive_common_3_88_0')
  assert.deepEqual(outputSets, [['uniqueName', 'nova_bigolive_common_3_88_0']])
  assert.equal(merges.find(value => value.module?.generator?.['css/module']?.localIdentName), undefined)
}

{
  const {mfOptions, outputSets, merges} = await runSharePlugin(
    {
      name: 'legacy-share',
      empRuntime: {
        version: true,
        runtime: {
          lib: 'http://localhost:2100/sdk.js',
        },
      },
    },
    {
      pkg: {
        name: '@nova/bigolive-common',
      },
    },
  )

  assert.equal(mfOptions.name, 'legacy_share')
  assert.deepEqual(outputSets, [['uniqueName', 'legacy_share']])
  assert.equal(merges.find(value => value.module?.generator?.['css/module']?.localIdentName), undefined)
}
