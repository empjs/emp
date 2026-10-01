export interface BridgeProviderReturn {
  render: (dom: HTMLElement, props?: Record<string, any>) => void
  destroy: (dom: HTMLElement) => void
}
export type BridgeProvider = () => BridgeProviderReturn
export type AsyncBridgeProvider = () => Promise<{default: BridgeProvider}>
export type ComponentProvider = BridgeProvider | AsyncBridgeProvider

interface Vue3Options {
  Vue: any
  plugin?: (app: any) => void
}

export function createBridgeComponent(Component: any, options: Vue3Options): BridgeProvider {
  const {createApp, shallowReactive, h} = options.Vue
  return () => {
    const apps = new Map<HTMLElement, {app: any; props: Record<string, any>}>()
    return {
      render(dom, props = {}) {
        const existing = apps.get(dom)
        if (existing) {
          for (const key of Object.keys(existing.props)) {
            if (!(key in props)) delete existing.props[key]
          }
          Object.assign(existing.props, props)
          return
        }
        const state = shallowReactive({...props})
        const app = createApp({render: () => h(Component, {...state})})
        options.plugin?.(app)
        app.mount(dom)
        apps.set(dom, {app, props: state})
      },
      destroy(dom) {
        const existing = apps.get(dom)
        if (!existing) return
        apps.delete(dom)
        existing.app.unmount()
      },
    }
  }
}

export function createRemoteAppComponent(
  component: ComponentProvider,
  {Vue}: Vue3Options,
  options: {onError?: (error: Error) => void} = {},
): any {
  if (!component) throw new Error('createRemoteAppComponent: component parameter cannot be empty')
  const {defineComponent, h, shallowRef, onMounted, onUpdated, onBeforeUnmount} = Vue
  return defineComponent({
    name: 'Vue3RemoteAppComponent',
    inheritAttrs: false,
    setup(_props: any, {attrs}: any) {
      const container = shallowRef(null)
      let provider: BridgeProviderReturn | null = null
      let mounted = false
      let disposed = false
      const report = (error: unknown) => {
        console.error('[EMP-ERROR] Vue3 bridge', error)
        options.onError?.(error as Error)
      }
      const render = () => {
        if (!mounted || !container.value || !provider) return
        try {
          provider.render(container.value, {...attrs})
        } catch (error) {
          report(error)
        }
      }
      // Promise.resolve also handles thenables from remote loaders.
      Promise.resolve()
        .then(async () => await component())
        .then(result => {
          if (disposed) return
          provider = 'default' in result ? result.default() : result
          render()
        })
        .catch(report)
      onMounted(() => {
        mounted = true
        render()
      })
      onUpdated(render)
      onBeforeUnmount(() => {
        disposed = true
        mounted = false
        const current = provider
        const dom = container.value
        provider = null
        if (current && dom) {
          try {
            current.destroy(dom)
          } catch (error) {
            report(error)
          }
        }
      })
      return () => h('div', {ref: container})
    },
  })
}

export default {createBridgeComponent, createRemoteAppComponent}
