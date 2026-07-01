export class MockRspackChain {
  constructor() {
    this.merges = []
    this.plugins = []
    this.outputValues = {}
  }

  merge(value) {
    this.merges.push(value)
    return this
  }

  output = {
    set: (key, value) => {
      this.outputValues[key] = value
      return this
    },
  }

  plugin(name) {
    return {
      use: (plugin, args = []) => {
        this.plugins.push({name, plugin, args})
        return this
      },
    }
  }
}

function deepAssign(target, ...sources) {
  const output = {...target}
  for (const source of sources) {
    if (!source || typeof source !== 'object') continue
    for (const [key, value] of Object.entries(source)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        output[key] = deepAssign(output[key] ?? {}, value)
      } else {
        output[key] = value
      }
    }
  }
  return output
}

function encodeVarName(name) {
  return String(name).replace(/@/g, '').replace(/[^\w_]/g, '_')
}

export function createMockRspackStore(overrides = {}) {
  const chain = overrides.chain ?? new MockRspackChain()
  const injectedTags = []
  return {
    mode: 'production',
    isDev: false,
    chain,
    injectedTags,
    empConfig: {
      output: {uniqueName: 'mockEmpShare'},
      css: {},
    },
    pkg: {
      name: '@empjs/mock-share',
      version: '1.2.3',
    },
    deepAssign,
    encodeVarName,
    injectTags(tags, name) {
      injectedTags.push({name, tags})
    },
    ...overrides,
    chain,
    injectedTags,
  }
}
