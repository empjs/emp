import assert from 'node:assert/strict'
import {pluginRspackEmpShare} from '../../dist/rspack.js'
import {createMockRspackStore} from '../support/mock-rspack-store.mjs'

const shareForceRemote = 'EMP_FORCE_REMOTES'

function findPlugin(store, name) {
  return store.chain.plugins.find(plugin => plugin.name === name)
}

{
  const store = createMockRspackStore()
  await pluginRspackEmpShare({
    name: 'demo-share',
    forceRemotes: {
      app: {
        entry: 'https://cdn.example.test/app/emp.js',
      },
    },
    empRuntime: {
      runtime: {
        lib: 'https://cdn.example.test/runtime.js',
      },
    },
  }).rsConfig(store)

  assert.ok(
    store.injectedTags.some(entry => entry.tags.some(tag => tag.innerHTML?.includes(`window.${shareForceRemote}`))),
    'non-empty forceRemotes should inject the browser override payload',
  )

  const mfPlugin = findPlugin(store, 'plugin-emp-share')
  assert.ok(mfPlugin)
  assert.equal(mfPlugin.args[0].forceRemotes, undefined)
  assert.ok(Array.isArray(mfPlugin.args[0].runtimePlugins))
  assert.equal(mfPlugin.args[0].runtimePlugins.length, 1)
  assert.match(mfPlugin.args[0].runtimePlugins[0], /dist\/forceRemote\.js$/)
}

{
  const store = createMockRspackStore()
  await pluginRspackEmpShare({
    name: 'demo-share',
    forceRemotes: {},
    empRuntime: {
      runtime: {
        lib: 'https://cdn.example.test/runtime.js',
      },
    },
  }).rsConfig(store)

  assert.ok(
    !store.injectedTags.some(entry => entry.tags.some(tag => tag.innerHTML?.includes(`window.${shareForceRemote}`))),
    'empty forceRemotes should not inject browser HTML',
  )

  const mfPlugin = findPlugin(store, 'plugin-emp-share')
  assert.ok(mfPlugin)
  assert.deepEqual(mfPlugin.args[0].runtimePlugins, undefined)
  assert.equal(mfPlugin.args[0].forceRemotes, undefined)
}
