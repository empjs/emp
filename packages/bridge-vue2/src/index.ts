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
  plugin?: (vue: any) => void
}

/**
 * Create bridge component - for producer to wrap application-level export modules
 */
export function createBridgeComponent(Component: any, options: Vue2Options): BridgeProvider {
  const Vue = options.Vue

  return function (): BridgeProviderReturn {
    const instanceMap = new Map<HTMLElement, any>()

    const render = (dom: HTMLElement, props?: Record<string, any>): void => {
      // 防御性检查：确保 DOM 元素存在
      if (!dom || !(dom instanceof HTMLElement)) {
        console.error('[EMP-ERROR] Invalid DOM element provided to render')
        return
      }

      try {
        const existingInstance = instanceMap.get(dom)

        if (existingInstance) {
          // Update props for existing instance
          if (props) {
            try {
              // 更新组件的渲染函数，使用新的props重新渲染组件
              existingInstance.$options.render = (h: any) => h(Component, {props: props || {}})

              // 更新propsData
              existingInstance.$options.propsData = props || {}

              // 强制更新组件
              existingInstance.$forceUpdate()
            } catch (error) {
              console.warn('[EMP-WARN] Failed to update props:', error)
            }
          }
        } else {
          // 创建一个额外的容器元素，作为Vue实例的挂载点
          const vueContainer = document.createElement('div')
          vueContainer.className = 'vue2-container'
          dom.appendChild(vueContainer)

          const instance = new Vue({
            propsData: props || {},
            render: (h: any) => h(Component, {props: props || {}}),
            el: vueContainer, // 使用新创建的容器元素
            beforeDestroy() {
              // 在销毁前清空容器内容，而不是直接操作React管理的DOM
              if (vueContainer && vueContainer.parentNode) {
                while (vueContainer.firstChild) {
                  vueContainer.removeChild(vueContainer.firstChild)
                }
                // 尝试从父元素中移除Vue容器，但保留React的容器
                try {
                  dom.removeChild(vueContainer)
                } catch (e) {
                  console.warn('[EMP-WARN] Failed to remove Vue container:', e)
                }
              }
            },
          })

          // 使用自定义插件（如果提供）
          if (options.plugin) {
            options.plugin(Vue)
          }
          instanceMap.set(dom, instance)
        }
      } catch (error) {
        console.error('[EMP-ERROR] Failed to render/update Vue component', error)
        throw error
      }
    }

    const destroy = (dom: HTMLElement): void => {
      // 防御性检查：确保 DOM 元素存在
      if (!dom || !(dom instanceof HTMLElement)) {
        console.error('[EMP-ERROR] Invalid DOM element provided to destroy')
        return
      }

      const instance = instanceMap.get(dom)

      if (!instance) return

      try {
        // 立即从映射中移除实例，防止重复销毁
        const vmToDestroy = instance
        instanceMap.delete(dom)

        // 在销毁前安全清空 DOM 内容，避免 React 移除时的冲突
        try {
          // 使用更安全的方式清空 DOM - 参考Vue3的实现
          if (dom) {
            // 清空DOM内容 - 使用多种方法确保清理成功
            try {
              // 方法1: 使用replaceChildren (现代浏览器)
              if (typeof dom.replaceChildren === 'function') {
                dom.replaceChildren()
              }
            } catch (replaceError) {
              console.warn('[EMP-WARN] destroy - replaceChildren failed:', replaceError)
            }

            // 方法2: 循环移除子节点 (最兼容)
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

        // 立即销毁Vue实例，不再延迟
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

  return {
    name: 'Vue2RemoteAppComponent',
    // 允许接收任意 props
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

          // 确保传递正确的 props，Vue2 中 $props 可能不存在
          const props = this.$props || this.$options.propsData || {}

          // 确保 props 是对象类型
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
            // 先清空 DOM 内容，避免 React 移除时的冲突
            try {
              while (this.$el.firstChild) {
                this.$el.removeChild(this.$el.firstChild)
              }
            } catch (clearError) {
              console.error('[EMP-ERROR] unmountComponent - Error during DOM clearing:', clearError)
            }

            // 然后销毁 Vue 组件
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
        // 获取 props 的安全方式
        const props = this.$props || this.$options.propsData || {}
        this.provider.render(this.$el, props)
      }
    },
    beforeDestroy() {
      this.isMounted = false
      this.unmountComponent()
    },
    created() {
      // 立即加载组件
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
