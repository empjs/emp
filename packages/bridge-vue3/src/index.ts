// Type definitions
export interface BridgeProviderReturn {
  render: (dom: HTMLElement, props?: Record<string, any>) => void
  destroy: (dom: HTMLElement) => void
}

export type BridgeProvider = () => BridgeProviderReturn
export type AsyncBridgeProvider = () => Promise<{default: BridgeProvider}>
export type ComponentProvider = BridgeProvider | AsyncBridgeProvider

interface Vue3Options {
  Vue?: any
  plugin?: (app: any) => void
}

/**
 * Create bridge component - for producer to wrap application-level export modules
 */
export function createBridgeComponent(Component: any, options: Vue3Options): BridgeProvider {
  const {createApp} = options.Vue

  return function (): BridgeProviderReturn {
    const appMap = new Map<HTMLElement, any>()

    const render = (dom: HTMLElement, props?: Record<string, any>): void => {
      try {
        const existingApp = appMap.get(dom)

        if (existingApp) {
          // Update props for existing app
          if (props) {
            Object.keys(props).forEach(key => {
              existingApp._instance.props[key] = props[key]
            })
          }
        } else {
          // Create new app instance
          const app = createApp(Component, props || {})

          // 使用自定义插件（如果提供）
          if (options.plugin) {
            options.plugin(app)
          }

          app.mount(dom)
          appMap.set(dom, app)
        }
      } catch (error) {
        console.error('[EMP-ERROR] Failed to render/update Vue component', error)
        throw error
      }
    }

    const destroy = (dom: HTMLElement): void => {
      const app = appMap.get(dom)
      if (!app) return

      try {
        app.unmount()
        appMap.delete(dom)
      } catch (error) {
        console.error('[EMP-ERROR] Failed to unmount Vue component', error)
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
  vueOptions: Vue3Options,
  options: {onError?: (error: Error) => void} = {},
): any {
  if (!component) {
    throw new Error('createRemoteAppComponent: component parameter cannot be empty')
  }

  const {Vue} = vueOptions

  return defineComponent({
    name: 'Vue3RemoteAppComponent',
    props: {},
    setup() {
      const provider = ref<BridgeProviderReturn | null>(null)
      const providerInfo = ref<BridgeProvider | null>(null)
      const isMounted = ref(false)
      const containerRef = ref<HTMLElement | null>(null)

      const loadComponent = async () => {
        try {
          if (typeof component === 'function') {
            const result = component()

            if (result instanceof Promise) {
              const module = await result
              providerInfo.value = module.default
            } else {
              providerInfo.value = component as BridgeProvider
            }
          }

          if (isMounted.value && containerRef.value) {
            renderComponent()
          }
        } catch (error) {
          if (options.onError) options.onError(error as Error)
          console.error('[EMP-ERROR] Failed to load component', error)
        }
      }

      const renderComponent = () => {
        if (!providerInfo.value || !containerRef.value) return

        try {
          if (!provider.value) {
            provider.value = providerInfo.value()
          }
          provider.value.render(containerRef.value, getCurrentInstance()?.props || {})
        } catch (error) {
          console.error('[EMP-ERROR] Failed to render component', error)
        }
      }

      const unmountComponent = () => {
        if (provider.value && containerRef.value) {
          try {
            provider.value.destroy(containerRef.value)
            provider.value = null
          } catch (error) {
            console.error('[EMP-ERROR] Failed to unmount component', error)
          }
        }
      }

      onMounted(() => {
        isMounted.value = true
        if (providerInfo.value) renderComponent()
      })

      onUpdated(() => {
        if (provider.value && containerRef.value) {
          provider.value.render(containerRef.value, getCurrentInstance()?.props || {})
        }
      })

      onBeforeUnmount(() => {
        isMounted.value = false
        const cleanup = () => unmountComponent()

        if (typeof window !== 'undefined' && window.requestAnimationFrame) {
          window.requestAnimationFrame(cleanup)
        } else {
          setTimeout(cleanup, 0)
        }
      })

      // 立即加载组件
      loadComponent()

      return {
        containerRef,
      }
    },
    render() {
      return Vue.h('div', {ref: 'containerRef'})
    },
  })
}

// 添加必要的导入声明
function defineComponent(options: any): any {
  return options
}

function ref<T>(initialValue?: T): {value: T | null} {
  return {value: initialValue || null}
}

function onMounted(fn: () => void): void {}
function onUpdated(fn: () => void): void {}
function onBeforeUnmount(fn: () => void): void {}
function getCurrentInstance(): {props: Record<string, any>} | null {
  return null
}

export default {
  createBridgeComponent,
  createRemoteAppComponent,
}
