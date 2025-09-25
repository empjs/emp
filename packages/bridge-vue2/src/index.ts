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
  const Vue = options.Vue
  const instanceOptions = options.instanceOptions || {}

  return function (): BridgeProviderReturn {
    const instanceMap = new Map<HTMLElement, any>()

    const render = (dom: HTMLElement, props?: Record<string, any>): void => {
      if (!dom || !(dom instanceof HTMLElement)) {
        console.error('[EMP-ERROR] Invalid DOM element provided to render')
        return
      }

      try {
        const existingInstance = instanceMap.get(dom)

        if (existingInstance) {
          if (props) {
            try {
              existingInstance.$options.render = (h: any) => h(Component, {props: props || {}})
              existingInstance.$options.propsData = props || {}
              existingInstance.$forceUpdate()
            } catch (error) {
              console.warn('[EMP-WARN] Failed to update props:', error)
            }
          }
        } else {
          const vueContainer = document.createElement('div')
          vueContainer.className = 'vue2-container'
          dom.appendChild(vueContainer)
          if (options.plugin) {
            options.plugin(Vue)
          }
          const instance = new Vue({
            propsData: props || {},
            render: (h: any) => h(Component, {props: props || {}}),
            el: vueContainer,
            beforeDestroy() {
              if (vueContainer && vueContainer.parentNode) {
                while (vueContainer.firstChild) {
                  vueContainer.removeChild(vueContainer.firstChild)
                }
                try {
                  dom.removeChild(vueContainer)
                } catch (e) {
                  console.warn('[EMP-WARN] Failed to remove Vue container:', e)
                }
              }
            },
            ...instanceOptions,
          })

          instanceMap.set(dom, instance)
        }
      } catch (error) {
        console.error('[EMP-ERROR] Failed to render/update Vue component', error)
        throw error
      }
    }

    const destroy = (dom: HTMLElement): void => {
      if (!dom || !(dom instanceof HTMLElement)) {
        console.error('[EMP-ERROR] Invalid DOM element provided to destroy')
        return
      }

      const instance = instanceMap.get(dom)

      if (!instance) return

      try {
        const vmToDestroy = instance
        instanceMap.delete(dom)

        try {
          if (dom) {
            try {
              if (typeof dom.replaceChildren === 'function') {
                dom.replaceChildren()
              }
            } catch (replaceError) {
              console.warn('[EMP-WARN] destroy - replaceChildren failed:', replaceError)
            }

            try {
              while (dom.firstChild) {
                dom.removeChild(dom.firstChild)
              }
            } catch (removeError) {
              console.warn('[EMP-WARN] destroy - removeChild failed:', removeError)
            }
          }
        } catch (domError) {
          console.warn('[EMP-WARN] Error clearing DOM before destroy:', domError)
        }

        try {
          vmToDestroy.$destroy()
        } catch (destroyError) {
          console.error('[EMP-ERROR] Error during Vue instance destroy:', destroyError)
        }
      } catch (error) {
        console.error('[EMP-ERROR] Failed to unmount Vue component', error)
      }
    }

    return {render, destroy}
  }
}

export function createRemoteAppComponent(
  component: ComponentProvider,
  vueOptions: Vue2Options,
  options: {onError?: (error: Error) => void} = {},
): any {
  if (!component) {
    throw new Error('createRemoteAppComponent: component parameter cannot be empty')
  }

  return {
    name: 'Vue2RemoteAppComponent',
    props: {
      name: String,
      [Symbol.toPrimitive]: Function,
    },
    data() {
      return {
        provider: null,
        providerInfo: null,
        isMounted: false,
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

          if (this.isMounted && this.$el) {
            this.renderComponent()
          }
        } catch (error) {
          if (options.onError) options.onError(error as Error)
          console.error('[EMP-ERROR] Failed to load component', error)
        }
      },
      renderComponent() {
        if (!this.providerInfo || !this.$el) return

        try {
          if (!this.provider && this.providerInfo) {
            this.provider = this.providerInfo()
          }

          if (!this.provider) {
            console.warn('[EMP-WARN] Provider not available yet')
            return
          }

          const props = this.$props || this.$options.propsData || {}

          if (props && typeof props === 'object') {
            this.provider.render(this.$el, props)
          } else {
            this.provider.render(this.$el, {})
          }
        } catch (error) {
          console.error('[EMP-ERROR] Failed to render component', error)
          if (options.onError) options.onError(error as Error)
        }
      },
      unmountComponent() {
        if (this.provider && this.$el) {
          try {
            try {
              while (this.$el.firstChild) {
                this.$el.removeChild(this.$el.firstChild)
              }
            } catch (clearError) {
              console.error('[EMP-ERROR] unmountComponent - Error during DOM clearing:', clearError)
            }

            this.provider.destroy(this.$el)
            this.provider = null
          } catch (error) {
            console.error('[EMP-ERROR] Failed to unmount component', error)
          }
        }
      },
    },
    mounted() {
      this.isMounted = true
      if (this.providerInfo) this.renderComponent()
    },
    updated() {
      if (this.provider && this.$el) {
        const props = this.$props || this.$options.propsData || {}
        this.provider.render(this.$el, props)
      }
    },
    beforeDestroy() {
      this.isMounted = false
      this.unmountComponent()
    },
    created() {
      this.loadComponent()
    },
    render(h: any) {
      return h('div')
    },
  }
}

export default {
  createBridgeComponent,
  createRemoteAppComponent,
}
