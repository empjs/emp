import assert from 'node:assert/strict'
import {pluginRspackEmpShare} from '../../dist/rspack.js'
import {createMockRspackStore} from '../support/mock-rspack-store.mjs'

function findPlugin(store, name) {
  return store.chain.plugins.find(plugin => plugin.name === name)
}

function findMerge(store, predicate) {
  return store.chain.merges.find(predicate)
}

async function runSharePlugin(options, overrides = {}) {
  const store = createMockRspackStore(overrides)
  await pluginRspackEmpShare(options).rsConfig(store)
  return {
    store,
    mfPlugin: findPlugin(store, 'plugin-emp-share'),
    frameworkPlugin: findPlugin(store, 'plugin-emp-share-framework'),
  }
}

{
  const {frameworkPlugin} = await runSharePlugin({
    name: 'demo-share',
    empRuntime: {},
  })

  assert.ok(frameworkPlugin, 'runtimeLib omitted should mount EmpShareRemoteLibPlugin')
  assert.match(String(frameworkPlugin.plugin), /@empjs\/share\/library/)
  assert.deepEqual(frameworkPlugin.args[0], {})
}

{
  const {store} = await runSharePlugin({
    name: 'demo-share',
    empRuntime: {
      runtime: {
        lib: 'https://cdn.example.test/runtime.js',
        global: 'RUNTIME_FROM_OBJECT',
      },
    },
  })

  const injected = store.injectedTags.at(-1)
  assert.ok(injected, 'runtimeLib should inject tags')
  assert.equal(injected.name, 'EMPShare')
  assert.equal(injected.tags[0].tagName, 'script')
  assert.match(injected.tags[0].innerHTML, /window\.EMPShareGlobalVal/)
  assert.equal(injected.tags[0].attributes, undefined)
  assert.equal(injected.tags[1].tagName, 'script')
  assert.equal(injected.tags[1].pos, 'head')
  assert.equal(injected.tags[1].attributes.src, 'https://cdn.example.test/runtime.js')

  const externals = findMerge(store, value => Boolean(value.externals))?.externals
  assert.deepEqual(externals, {
    '@module-federation/runtime': 'RUNTIME_FROM_OBJECT.MFRuntime',
    '@module-federation/sdk': 'RUNTIME_FROM_OBJECT.MFSDK',
  })
}

{
  const {store} = await runSharePlugin({
    name: 'demo-share',
    empRuntime: {
      runtimeGlobal: 'RUNTIME_FROM_OPTION',
      runtime: {
        lib: 'https://cdn.example.test/runtime.js',
        global: 'RUNTIME_FROM_OBJECT',
      },
    },
  })

  const externals = findMerge(store, value => Boolean(value.externals))?.externals
  assert.deepEqual(externals, {
    '@module-federation/runtime': 'RUNTIME_FROM_OPTION.MFRuntime',
    '@module-federation/sdk': 'RUNTIME_FROM_OPTION.MFSDK',
  })
}

{
  const {store} = await runSharePlugin({
    name: 'demo-share',
    empRuntime: {
      runtime: {
        lib: 'https://cdn.example.test/runtime.js',
      },
      framework: 'react',
      frameworkGlobal: 'REACT_GLOBAL',
    },
  })

  const externals = findMerge(store, value => Boolean(value.externals))?.externals
  assert.equal(externals.react, 'REACT_GLOBAL.React')
  assert.equal(externals['react-dom'], 'REACT_GLOBAL.ReactDOM')
  assert.equal(externals['react-dom/client'], 'REACT_GLOBAL')
  assert.equal(externals['react/jsx-runtime'], 'REACT_GLOBAL')
  assert.equal(externals['react/jsx-dev-runtime'], 'REACT_GLOBAL')
}

{
  const {store} = await runSharePlugin({
    name: 'demo-share',
    empRuntime: {
      runtime: {
        lib: 'https://cdn.example.test/runtime.js',
      },
      framework: {
        name: 'react',
        global: 'FRAMEWORK_GLOBAL',
        libs: [
          'https://cdn.example.test/ui-a.js',
          'https://cdn.example.test/ui-b.css',
          'https://cdn.example.test/ui-c.js',
        ],
      },
    },
  })

  const injected = store.injectedTags.at(-1)
  assert.ok(injected)
  assert.deepEqual(
    injected.tags.map(tag => tag.tagName === 'link' ? `${tag.tagName}:${tag.attributes?.href}` : `${tag.tagName}:${tag.attributes?.src}`),
    [
      'script:undefined',
      'script:https://cdn.example.test/ui-a.js',
      'link:https://cdn.example.test/ui-b.css',
      'script:https://cdn.example.test/ui-c.js',
      'script:https://cdn.example.test/runtime.js',
    ],
  )
}

{
  const {store} = await runSharePlugin({
    name: 'demo-share',
    empRuntime: {
      runtime: {
        lib: 'https://cdn.example.test/runtime.js',
      },
      frameworkGlobal: 'SHARE_GLOBAL',
      shareLib: {
        alpha: 'Alpha@https://cdn.example.test/alpha.js',
        beta: [
          'https://cdn.example.test/beta.js',
          'https://cdn.example.test/beta.css',
        ],
        gamma: {
          entry: 'https://cdn.example.test/gamma.js',
          global: 'Gamma',
          type: 'js',
        },
      },
    },
  })

  const injected = store.injectedTags.at(-1)
  assert.ok(injected)
  assert.deepEqual(
    injected.tags.map(tag => tag.tagName === 'link' ? `${tag.tagName}:${tag.attributes?.href}` : `${tag.tagName}:${tag.attributes?.src}`),
    [
      'script:undefined',
      'script:https://cdn.example.test/alpha.js',
      'script:https://cdn.example.test/beta.js',
      'link:https://cdn.example.test/beta.css',
      'script:https://cdn.example.test/gamma.js',
      'script:https://cdn.example.test/runtime.js',
    ],
  )

  const externals = findMerge(store, value => Boolean(value.externals))?.externals
  assert.equal(externals.alpha, 'SHARE_GLOBAL.Alpha')
  assert.equal(externals.gamma, 'SHARE_GLOBAL.Gamma')
  assert.equal(externals.beta, undefined)
}

{
  let receivedExternals
  const {store} = await runSharePlugin({
    name: 'demo-share',
    empRuntime: {
      runtime: {
        lib: 'https://cdn.example.test/runtime.js',
      },
      setExternals(externals, frameworkGlobal, runtimeGlobal) {
        receivedExternals = {externals, frameworkGlobal, runtimeGlobal}
        externals.custom = 'CustomGlobal.CustomLib'
      },
    },
  })

  assert.ok(receivedExternals)
  assert.equal(receivedExternals.frameworkGlobal, '')
  assert.equal(receivedExternals.runtimeGlobal, 'EMP_SHARE_RUNTIME')
  assert.equal(receivedExternals.externals.custom, 'CustomGlobal.CustomLib')
  const externals = findMerge(store, value => Boolean(value.externals))?.externals
  assert.equal(externals.custom, 'CustomGlobal.CustomLib')
}

{
  const {store, mfPlugin} = await runSharePlugin(
    {
      name: 'demo-share',
      empRuntime: {
        version: true,
        runtime: {
          lib: 'https://cdn.example.test/runtime.js',
        },
      },
    },
    {
      pkg: {
        name: '@empjs/demo-app',
        version: '1.2.3',
      },
    },
  )

  assert.equal(mfPlugin.args[0].name, 'empjs_demo_app_1_2_3')
  assert.equal(store.chain.outputValues.uniqueName, 'empjs_demo_app_1_2_3')
  assert.equal(
    findMerge(store, value => value.module?.generator?.['css/module'])?.module.generator['css/module'].localIdentName,
    'empjs_demo_app_1_2_3-[local]-[hash:5]',
  )
}

{
  const {store} = await runSharePlugin(
    {
      name: 'demo-share',
      empRuntime: {
        version: true,
        runtime: {
          lib: 'https://cdn.example.test/runtime.js',
        },
      },
    },
    {
      isDev: true,
      pkg: {
        name: '@empjs/demo-app',
        version: '1.2.3',
      },
    },
  )

  assert.equal(
    findMerge(store, value => value.module?.generator?.['css/module'])?.module.generator['css/module'].localIdentName,
    'empjs_demo_app_1_2_3-[id]-[local]-[hash:base64:8]',
  )
}

{
  const {mfPlugin} = await runSharePlugin({
    name: 'demo-share',
    dts: {
      consumeTypes: {
        runtimePkgs: ['@empjs/share/sdk', '@empjs/share/sdk', '@empjs/share/runtime'],
      },
    },
    empRuntime: {
      runtime: {
        lib: 'https://cdn.example.test/runtime.js',
      },
    },
  })

  assert.deepEqual(mfPlugin.args[0].dts.consumeTypes.runtimePkgs, ['@empjs/share/sdk', '@empjs/share/runtime'])
}

{
  const {mfPlugin} = await runSharePlugin({
    name: 'demo-share',
    dts: {
      consumeTypes: false,
    },
    empRuntime: {
      runtime: {
        lib: 'https://cdn.example.test/runtime.js',
      },
    },
  })

  assert.equal(mfPlugin.args[0].dts.consumeTypes, false)
}

{
  const {mfPlugin} = await runSharePlugin({
    name: 'demo-share',
    runtimePlugins: ['/project/runtime/custom-runtime-plugin.js'],
    empRuntime: {
      runtime: {
        lib: 'https://cdn.example.test/runtime.js',
      },
    },
  })

  assert.deepEqual(mfPlugin.args[0].runtimePlugins, ['/project/runtime/custom-runtime-plugin.js'])
}

{
  const {mfPlugin} = await runSharePlugin({
    name: 'demo-share',
    runtimePlugins: ['/project/runtime/custom-runtime-plugin.js'],
    forceRemotes: {
      mfHost: {
        entry: 'https://cdn.example.test/mfHost/emp.js',
      },
    },
    empRuntime: {
      runtime: {
        lib: 'https://cdn.example.test/runtime.js',
      },
    },
  })

  assert.equal(mfPlugin.args[0].runtimePlugins.length, 2)
  assert.equal(mfPlugin.args[0].runtimePlugins[0], '/project/runtime/custom-runtime-plugin.js')
  assert.match(mfPlugin.args[0].runtimePlugins[1], /dist\/forceRemote\.js$/)
}
