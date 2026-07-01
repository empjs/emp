import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'

const packageJson = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'))
const packageName = packageJson.name

const nodeSafeExports = new Set(['.', './mfRuntime', './forceRemote', './rspack'])

function packageSpecifier(subpath) {
  return subpath === '.' ? packageName : `${packageName}/${subpath.slice(2)}`
}

function installBrowserGlobals() {
  const hadWindow = Object.hasOwn(globalThis, 'window')
  const hadSelf = Object.hasOwn(globalThis, 'self')
  const previousWindow = globalThis.window
  const previousSelf = globalThis.self
  globalThis.window = {
    EMPShareGlobalVal: {
      runtimeLib: 'EMP_SHARE_RUNTIME',
      frameworkLib: 'FRAMEWORK_GLOBAL',
    },
    EMP_SHARE_RUNTIME: {
      MFRuntime: {
        createInstance: () => ({}),
      },
      MFSDK: {},
    },
    FRAMEWORK_GLOBAL: {
      React: {
        version: '18.0.0',
      },
      ReactDOM: {
        version: '18.0.0',
      },
      Vue: {
        version: '3.0.0',
      },
      VueRouter: {
        version: '4.0.0',
      },
      scope: 'default',
    },
    React: {
      version: '18.0.0',
    },
    ReactDOM: {
      version: '18.0.0',
    },
    Vue: {
      defineComponent: component => component,
      h: (...args) => args,
      ref: value => ({value}),
      version: '3.0.0',
    },
    EMP_ADAPTER_VUE: {
      Vue: class Vue2 {
        $mount() {}
      },
    },
  }
  globalThis.self = globalThis.window
  return () => {
    if (hadWindow) {
      globalThis.window = previousWindow
    } else {
      delete globalThis.window
    }
    if (hadSelf) {
      globalThis.self = previousSelf
    } else {
      delete globalThis.self
    }
  }
}

const exportEntries = Object.entries(packageJson.exports)

for (const [subpath, config] of exportEntries) {
  assert.ok(config.default || config.import, `${subpath} should expose an importable default/import target`)
}

for (const subpath of nodeSafeExports) {
  const mod = await import(packageSpecifier(subpath))
  assert.ok(mod, `${subpath} should be importable through the package exports map without browser globals`)
}

{
  const restoreGlobals = installBrowserGlobals()
  try {
    for (const [subpath] of exportEntries.filter(([subpath]) => !nodeSafeExports.has(subpath))) {
      const mod = await import(packageSpecifier(subpath))
      assert.ok(mod, `${subpath} should be importable through the package exports map with browser globals`)
    }

    const adapterVue = await import(packageSpecifier('./adapterVue'))
    assert.ok(adapterVue.Vue2InVue3Adapter, 'adapterVue should export the current Vue adapter entrypoint')
    assert.equal(typeof adapterVue.external, 'undefined')
    assert.equal(typeof adapterVue.shared, 'undefined')
  } finally {
    restoreGlobals()
  }
}

{
  const libraryExport = packageJson.exports['./library']
  assert.equal(libraryExport.default, './output/sdk.js')

  const sdkContent = readFileSync(new URL('../../output/sdk.js', import.meta.url), 'utf8')
  assert.match(sdkContent, /EMP_SHARE_RUNTIME/)
  assert.match(sdkContent, /MFRuntime/)
  assert.match(sdkContent, /MFSDK/)
  assert.match(sdkContent, /reactAdapter/)
  assert.match(sdkContent, /runtime/)
}

{
  const typesVersions = packageJson.typesVersions?.['*'] ?? {}
  for (const [subpath, config] of exportEntries) {
    if (!config.types) continue
    const typesKey = subpath === '.' ? '.' : subpath.slice(2)
    assert.ok(typesVersions[typesKey], `typesVersions should include ${typesKey}`)
    assert.deepEqual(typesVersions[typesKey], [config.types])
  }
}
