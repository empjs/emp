import {expect, test} from '@rstest/core'

type VueInstance = {
  $el: Element
  $store: {state: Record<string, number>}
  $mount: (element?: Element) => VueInstance
  $destroy: () => void
}

type VueConstructor = {
  version: string
  extend: (options: unknown) => unknown
  observable: (value: unknown) => unknown
  nextTick: (callback?: () => void) => Promise<void>
  use: (plugin: unknown) => void
  new (options: Record<string, unknown>): VueInstance
}

type VuexStore = {
  state: Record<string, number>
  getters: Record<string, number>
  commit: (type: string) => void
}

type VuexGlobal = {
  version?: string
  default?: {version?: string}
  install: (vue: unknown) => void
  mapState: (...args: unknown[]) => unknown
  Store: new (options: Record<string, unknown>) => VuexStore
}

type VueAdapterGlobal = {
  Vue: VueConstructor
  Vuex: VuexGlobal
}

type RenderFunction = (type: unknown, props: unknown, children: unknown) => unknown

const adapterGlobalName = 'EMP_ADAPTER_VUE'
const runtimeAsset = '/container-static/lib-vue-2/runtime.umd.js'

let adapterLoad: Promise<HTMLScriptElement> | undefined

async function loadScript(src: string) {
  const script = document.createElement('script')
  await new Promise<void>((resolve, reject) => {
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.append(script)
  })
  return script
}

async function loadAdapter() {
  const win = window as typeof window & Record<string, unknown>
  if (!win[adapterGlobalName]) {
    adapterLoad ??= loadScript(runtimeAsset)
    await adapterLoad
  }
  return win[adapterGlobalName] as VueAdapterGlobal
}

function createContainer() {
  const container = document.createElement('div')
  document.body.append(container)
  return container
}

test('Vue 2 adapter bundle self-bootstraps the EMP_ADAPTER_VUE global', async () => {
  const win = window as typeof window & Record<string, unknown>
  delete win[adapterGlobalName]
  adapterLoad = undefined

  const adapter = await loadAdapter()

  expect(adapter).toBeTruthy()
  expect(adapter.Vue.version).toBe('2.7.14')
  expect(typeof adapter.Vue.extend).toBe('function')
  expect(typeof adapter.Vue.observable).toBe('function')
  expect(typeof adapter.Vue.nextTick).toBe('function')
  // webpack 的 CJS->ESM interop 不会把非静态可分析的 version 提升为具名导出，
  // 真实版本号落在命名空间的 default 上；两处都接受，保持断言对打包细节稳定。
  expect(adapter.Vuex.version ?? adapter.Vuex.default?.version).toBe('3.6.2')
  expect(typeof adapter.Vuex.Store).toBe('function')
  expect(typeof adapter.Vuex.install).toBe('function')
  expect(typeof adapter.Vuex.mapState).toBe('function')
})

test('Vue 2 adapter mounts a rendered component into the document', async () => {
  const {Vue} = await loadAdapter()
  const host = createContainer()
  const render: RenderFunction = h => h('span', {attrs: {id: 'e2e-vue-2'}}, 'vue2-e2e')

  const vm = new Vue({render: h => render(h as RenderFunction, null, null)})

  try {
    vm.$mount(host)

    expect(vm.$el.textContent).toBe('vue2-e2e')
    expect(document.getElementById('e2e-vue-2')?.textContent).toBe('vue2-e2e')
  } finally {
    vm.$destroy()
    vm.$el.remove()
    host.remove()
  }
})

test('Vue 2 adapter Vuex store drives reactive DOM updates', async () => {
  const {Vue, Vuex} = await loadAdapter()
  Vue.use(Vuex)

  const store = new Vuex.Store({
    state: {count: 1},
    getters: {
      double: (state: Record<string, number>) => state.count * 2,
    },
    mutations: {
      increment: (state: Record<string, number>) => {
        state.count += 1
      },
    },
  })

  const host = createContainer()
  const vm = new Vue({
    store,
    render: h => (h as RenderFunction)('span', null, String(store.state.count)),
  })

  try {
    vm.$mount(host)

    expect(store.getters.double).toBe(2)
    expect(vm.$el.textContent).toBe('1')

    store.commit('increment')
    await Vue.nextTick()

    expect(store.state.count).toBe(2)
    expect(store.getters.double).toBe(4)
    expect(vm.$el.textContent).toBe('2')
  } finally {
    vm.$destroy()
    vm.$el.remove()
    host.remove()
  }
})
