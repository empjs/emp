export interface BridgeProviderReturn {
  render: (dom: HTMLElement, props?: Record<string, any>) => void
  destroy: (dom: HTMLElement) => void
}
export type BridgeProvider = () => BridgeProviderReturn
export type AsyncBridgeProvider = () => Promise<{default: BridgeProvider}>
export type ComponentProvider = BridgeProvider | AsyncBridgeProvider

interface Vue2Options {
  Vue?: any
  plugin?: (vue: any) => void
  instanceOptions?: Record<string, any>
}

export function createBridgeComponent(Component: any, options: Vue2Options): BridgeProvider {
  const {Vue, instanceOptions = {}} = options
  return () => {
    const instances = new Map<HTMLElement, any>()
    return {
      render(dom, props = {}) {
        if (!dom || !(dom instanceof HTMLElement)) throw new Error('Invalid bridge container')
        const existing = instances.get(dom)
        if (existing) {
          existing.$options.render = (h: any) => h(Component, {props: {...props}})
          existing.$forceUpdate()
          return
        }
        options.plugin?.(Vue)
        const mount = document.createElement('div')
        dom.appendChild(mount)
        const instance = new Vue({
          ...instanceOptions,
          render: (h: any) => h(Component, {props: {...props}}),
        })
        instance.$mount(mount)
        instances.set(dom, instance)
      },
      destroy(dom) {
        const instance = instances.get(dom)
        if (!instance) return
        instances.delete(dom)
        // Run lifecycle cleanup while the component's DOM still exists.
        const el = instance.$el
        instance.$destroy()
        if (el?.parentNode === dom) dom.removeChild(el)
      },
    }
  }
}

export function createRemoteAppComponent(
  component: ComponentProvider,
  _vueOptions: Vue2Options,
  options: {onError?: (error: Error) => void} = {},
): any {
  if (!component) throw new Error('createRemoteAppComponent: component parameter cannot be empty')
  const report = (error: unknown) => {
    console.error('[EMP-ERROR] Vue2 bridge', error)
    options.onError?.(error as Error)
  }
  return {
    name: 'Vue2RemoteAppComponent',
    inheritAttrs: false,
    props: {name: String},
    data() {
      return {provider: null, isMounted: false, disposed: false}
    },
    methods: {
      renderComponent(this: any) {
        if (!this.isMounted || !this.provider) return
        try {
          // Undeclared props (including callbacks) are carried in $attrs.
          this.provider.render(this.$el, {...this.$attrs, ...this.$props})
        } catch (error) {
          report(error)
        }
      },
    },
    created(this: any) {
      // This wrapper renders only a container. Reading $attrs/$props in a
      // watcher ensures prop-only changes update the foreign root as well.
      this.$watch(
        () => ({...this.$attrs, ...this.$props}),
        () => this.renderComponent(),
      )
      Promise.resolve()
        .then(async () => await component())
        .then(result => {
          if (this.disposed) return
          this.provider = 'default' in result ? result.default() : result
          this.renderComponent()
        })
        .catch(report)
    },
    mounted(this: any) {
      this.isMounted = true
      this.renderComponent()
    },
    updated(this: any) {
      this.renderComponent()
    },
    beforeDestroy(this: any) {
      this.disposed = true
      this.isMounted = false
      const provider = this.provider
      this.provider = null
      if (provider) {
        try {
          provider.destroy(this.$el)
        } catch (error) {
          report(error)
        }
      }
    },
    render(h: any) {
      return h('div')
    },
  }
}

export default {createBridgeComponent, createRemoteAppComponent}
