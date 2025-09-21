// Type definitions
export interface BridgeProviderReturn {
  render: (dom: HTMLElement, props?: Record<string, any>) => void
  destroy: (dom: HTMLElement) => void
}

export type BridgeProvider = () => BridgeProviderReturn
export type AsyncBridgeProvider = () => Promise<{default: BridgeProvider}>
export type ComponentProvider = BridgeProvider | AsyncBridgeProvider

interface Vue2Options {
  Vue?: any
  plugin?: (Vue: any) => void
}

/**
 * Create bridge component - for producer to wrap application-level export modules
 */
export function createBridgeComponent(Component: any, options: Vue2Options): BridgeProvider {
  const { Vue } = options

  return function (): BridgeProviderReturn {
    const vmMap = new Map<HTMLElement, any>()

    const render = (dom: HTMLElement, props?: Record<string, any>): void => {
      try {
        const existingVm = vmMap.get(dom)

        if (existingVm) {
          // Update props for existing instance
          Object.assign(existingVm.$props, props || {})
        } else {
          // Create new Vue instance
          const Ctor = Vue.extend(Component)
          const vm = new Ctor({
            propsData: props || {}
          })

          // Apply global plugins if provided
          if (options.plugin) {
            options.plugin(Vue)
          }

          vm.$mount(dom)
          vmMap.set(dom, vm)
        }
      } catch (error) {
        console.error('[EMP-ERROR] Failed to render/update Vue component', error)
        throw error
      }
    }

    const destroy = (dom: HTMLElement): void => {
      const vm = vmMap.get(dom)
      if (!vm) return

      try {
        vm.$destroy()
        vmMap.delete(dom)
      } catch (error) {
        console.error('[EMP-ERROR] Failed to destroy Vue component', error)
      }
    }

    return {render, destroy}
  }
}

/**
 * Create remote app component - for consumer to load application-level modules
 */
export function createRemoteAppComponent(
  component: ComponentProvider,
  vueOptions: Vue2Options,
  options: {onError?: (error: Error) => void} = {},
): any {
  if (!component) {
    throw new Error('createRemoteAppComponent: component parameter cannot be empty')
  }

  const { Vue } = vueOptions

  return Vue.extend({
    name: 'RemoteAppComponent',
    props: {},
    data() {
      return {
        provider: null as BridgeProviderReturn | null,
        providerInfo: null as BridgeProvider | null,
        isMounted: false
      }
    },
    mounted() {
      this.isMounted = true
      this.loadComponent()
    },
    updated() {
      if (this.provider && this.$refs.container) {
        this.provider.render(this.$refs.container, this.$props)
      }
    },
    beforeDestroy() {
      this.isMounted = false
      const cleanup = () => this.unmountComponent()

      if (typeof window !== 'undefined' && window.requestAnimationFrame) {
        window.requestAnimationFrame(cleanup)
      } else {
        setTimeout(cleanup, 0)
      }
    },
    methods: {
      async loadComponent() {
        try {
          if (typeof component === 'function') {
            const result = component()

            if (result instanceof Promise) {
              const module = await result
              this.providerInfo = module.default
            } else {
              this.providerInfo = component as BridgeProvider
            }
          }

          if (this.isMounted && this.$refs.container) {
            this.renderComponent()
          }
        } catch (error) {
          if (options.onError) options.onError(error as Error)
          console.error('[EMP-ERROR] Failed to load component', error)
        }
      },
      renderComponent() {
        if (!this.providerInfo || !this.$refs.container) return

        try {
          if (!this.provider) {
            this.provider = this.providerInfo()
          }
          this.provider.render(this.$refs.container, this.$props)
        } catch (error) {
          console.error('[EMP-ERROR] Failed to render component', error)
        }
      },
      unmountComponent() {
        if (this.provider && this.$refs.container) {
          try {
            this.provider.destroy(this.$refs.container)
            this.provider = null
          } catch (error) {
            console.error('[EMP-ERROR] Failed to unmount component', error)
          }
        }
      }
    },
    render(h: any) {
      return h('div', { ref: 'container' })
    }
  })
}

export default {
  createBridgeComponent,
  createRemoteAppComponent,
}