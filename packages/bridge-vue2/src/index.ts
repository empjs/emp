// Type definitions
export interface BridgeProviderReturn {
  render: (dom: HTMLElement, props?: Record<string, any>) => void
  destroy: (dom: HTMLElement) => void
}

export type BridgeProvider = () => BridgeProviderReturn
export type AsyncBridgeProvider = () => Promise<{default: BridgeProvider}>
export type ComponentProvider = BridgeProvider | AsyncBridgeProvider

interface Vue2Options {
  Vue: any
  plugin?: (vue: any) => void
  instance?: {[k: string]: any}
  safeDestroy?: boolean
  disableAutoCleanup?: boolean
  enableDebug?: boolean
}

// Vue2 类型定义
interface Vue2Instance {
  providerInfo: BridgeProvider
  isMounted: HTMLElement
  renderComponent(): unknown
  provider: any
  $props: Record<string, any>
  $set: (object: Record<string, any>, key: string, value: any) => void
  $el: HTMLElement
  $destroy: () => void
}

/**
 * Create bridge component - for producer to wrap application-level export modules
 */
// 添加调试日志函数
const DEBUG_PREFIX = '[bridge-vue2]'
function debug(...args: any[]) {
  console.log(DEBUG_PREFIX, ...args)
}

export function createBridgeComponent(Component: any, options: Vue2Options): BridgeProvider {
  const Vue = options.Vue

  return function (): BridgeProviderReturn {
    const instanceMap = new Map<HTMLElement, Vue2Instance>()

    const render = (dom: HTMLElement, props?: Record<string, any>): void => {
      if (options.enableDebug) debug('render called', dom, props)
      try {
        const existingInstance = instanceMap.get(dom)

        if (existingInstance) {
          // Update props for existing instance
          if (props) {
            Object.keys(props).forEach(key => {
              existingInstance.$set(existingInstance.$props, key, props[key])
            })
          }
        } else {
          // Create new Vue instance

          // 使用自定义插件（如果提供）
          if (options.plugin) {
            options.plugin(Vue)
            // console.log('options.plugin', options.plugin)
          }
          if (options.enableDebug) debug('render: creating new Vue instance', props)
          const instance = new Vue({
            ...(options.instance || {}),
            render: (h: any) => h(Component, {props: props || {}}),
            el: dom,
          }) as Vue2Instance
          if (options.enableDebug) debug('render: Vue instance created successfully')

          instanceMap.set(dom, instance)
          if (options.enableDebug) debug('render: instance added to instanceMap')
        }
      } catch (error) {
        console.error('[EMP-ERROR] Failed to render/update Vue component', error)
        throw error
      }
    }

    const destroy = (dom: HTMLElement): void => {
      if (options.enableDebug) debug('destroy called', dom)
      const instance = instanceMap.get(dom)
      if (!instance) {
        if (options.enableDebug) debug('destroy: no instance found for dom', dom)
        return
      }

      try {
        // 先销毁Vue实例
        if (options.enableDebug) debug('destroy: destroying Vue instance', instance)
        instance.$destroy()
        if (options.enableDebug) debug('destroy: Vue instance destroyed successfully')
        
        // 直接清空DOM内容，不检查innerHTML，避免与React DOM操作冲突
        try {
          if (options.enableDebug) debug('destroy: cleaning up DOM content')
          // 直接设置innerHTML为空字符串是最安全的方式
          if (!options.safeDestroy) {
            dom.innerHTML = ''
            if (options.enableDebug) debug('destroy: DOM cleanup completed')
          } else {
            if (options.enableDebug) debug('destroy: DOM cleanup skipped (safeDestroy=true)')
          }
        } catch (domError) {
          // 捕获可能的DOM操作错误，避免影响React卸载流程
          console.warn('[bridge-vue2] Error during component destroy:', domError)
          if (options.enableDebug) debug('destroy: error cleaning up DOM', domError)
        }

        instanceMap.delete(dom)
        if (options.enableDebug) debug('destroy: instance removed from instanceMap')
      } catch (error) {
        console.error('[EMP-ERROR] Failed to unmount Vue component', error)
        if (options.enableDebug) debug('destroy: error during component unmount', error)
      }
    }

    const unmountComponent = (dom: HTMLElement): void => {
      if (options.enableDebug) debug('unmountComponent called', dom)
      const instance = instanceMap.get(dom)
      if (!instance) {
        if (options.enableDebug) debug('unmountComponent: no instance found for dom', dom)
        return
      }
      
      try {
        if (options.enableDebug) debug('unmountComponent: destroying Vue instance', instance)
        instance.$destroy()
        if (options.enableDebug) debug('unmountComponent: Vue instance destroyed successfully')
      } catch (e) {
        console.error('Failed to destroy Vue instance', e)
        if (options.enableDebug) debug('unmountComponent: error destroying Vue instance', e)
      }
      
      instanceMap.delete(dom)
      if (options.enableDebug) debug('unmountComponent: instance removed from instanceMap')
      
      // 如果不禁用自动清理，则清空DOM
      if (!options.disableAutoCleanup) {
        if (options.enableDebug) debug('unmountComponent: cleaning up DOM children', dom.childNodes.length)
        try {
          let childCount = dom.childNodes.length;
          if (options.enableDebug) debug('unmountComponent: DOM children count before cleanup', childCount)
          
          while (dom.firstChild) {
            if (options.enableDebug) debug('unmountComponent: removing child', dom.firstChild.nodeName)
            dom.removeChild(dom.firstChild)
          }
          if (options.enableDebug) debug('unmountComponent: DOM cleanup completed')
        } catch (e) {
          console.error('Failed to clean up DOM', e)
          if (options.enableDebug) debug('unmountComponent: error cleaning up DOM', e, e.stack)
        }
      } else {
        if (options.enableDebug) debug('unmountComponent: DOM cleanup skipped (disableAutoCleanup=true)')
      }
    }

    return {render, destroy}
  }
}

// Vue2 组件类型定义
interface Vue2Component {
  isMounted: boolean
  providerInfo: any
  renderComponent(): unknown
  provider: any
  unmountComponent(): unknown
  loadComponent(): unknown
  name?: string
  props?: Record<string, any>
  data?: () => Record<string, any>
  methods?: Record<string, (this: Vue2Instance, ...args: any[]) => any>
  mounted?: () => void
  updated?: () => void
  beforeDestroy?: () => void
  created?: () => void
  render?: (h: any) => any
  $el?: HTMLElement
  $props?: Record<string, any>
}

/**
 * Create remote app component - for consumer to load application-level modules
 */
export function createRemoteAppComponent(
  component: ComponentProvider,
  vueOptions: Vue2Options,
  options: {onError?: (error: Error) => void} = {},
): Vue2Component {
  if (!component) {
    throw new Error('createRemoteAppComponent: component parameter cannot be empty')
  }

  return {
    name: 'RemoteAppComponent',
    props: {},
    data() {
      return {
        provider: null as BridgeProviderReturn | null,
        providerInfo: null as BridgeProvider | null,
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
          if (!this.provider) {
            this.provider = this.providerInfo()
          }
          this.provider.render(this.$el, this.$props || {})
        } catch (error) {
          console.error('[EMP-ERROR] Failed to render component', error)
        }
      },
      unmountComponent() {
        // 只检查provider是否存在，不再依赖DOM节点关系
        if (this.provider) {
          try {
            // 如果$el存在，尝试销毁，但捕获任何可能的错误
            if (this.$el) {
              try {
                // 调用destroy方法，该方法已经增强了错误处理
                this.provider.destroy(this.$el)
              } catch (destroyError) {
                console.warn('[EMP-WARN] Could not clear DOM content safely', destroyError)
              }
            }
            // 无论如何都清理provider引用
            this.provider = null
            
            // 检查是否禁用自动清理
            if (!vueOptions.disableAutoCleanup && this.$el) {
              try {
                // 使用安全的方式清空DOM内容
                this.$el.innerHTML = ''
              } catch (domError) {
                console.warn('[EMP-WARN] Could not clear DOM content safely', domError)
              }
            }
          } catch (error) {
            console.error('[EMP-ERROR] Failed to unmount component', error)
            console.warn('[bridge-vue2] Error during component unmount:', error)
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
        this.provider.render(this.$el, this.$props || {})
      }
    },
    beforeDestroy() {
      this.isMounted = false

      // 直接调用清理函数，避免异步操作可能导致的DOM节点关系变化
      this.unmountComponent()
    },
    created() {
      // 立即加载组件
      this.loadComponent()
    },
    render(h: any) {
      return h('div')
    },
    isMounted: false,
    providerInfo: undefined,
    renderComponent: function (): unknown {
      throw new Error('Function not implemented.')
    },
    provider: undefined,
    unmountComponent: function (): unknown {
      throw new Error('Function not implemented.')
    },
    loadComponent: function (): unknown {
      throw new Error('Function not implemented.')
    },
  }
}

export default {
  createBridgeComponent,
  createRemoteAppComponent,
}
