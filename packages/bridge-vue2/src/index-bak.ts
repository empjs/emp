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
            // 参考 adapter/vue.ts 中的实现，合并 props 和 attrs
            const mergedProps = {...existingInstance.$props, ...props}

            // 不直接修改 props，而是通过重新渲染组件来更新
            // Vue props 是只读的，不应该尝试直接修改它们
            try {
              // 强制重新渲染组件，让 Vue 内部处理 props 更新
              existingInstance.$forceUpdate()

              // 如果需要更新 data 中的属性（非 props）
              Object.keys(mergedProps).forEach(key => {
                if (key in existingInstance.$data && !(existingInstance.$props && key in existingInstance.$props)) {
                  // 只更新不是 props 的 data 属性
                  existingInstance.$set(existingInstance.$data, key, mergedProps[key])
                }
              })
            } catch (error) {
              console.warn('[EMP-WARN] Failed to update props:', error)
            }

            // 触发组件更新
            existingInstance.$forceUpdate()
          }
        } else {
          // Create new Vue instance with correct props handling
          const instance = new Vue({
            data() {
              // 只在data中存储非props的数据
              return {}
            },
            // 使用propsData选项正确传递props
            propsData: props || {},
            render: (h: any) => h(Component, {props: props || {}}),
            el: dom,
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
        // 在销毁前安全清空 DOM 内容，避免 React 移除时的冲突
        if (dom && dom.parentNode) {
          while (dom.firstChild) {
            dom.removeChild(dom.firstChild)
          }
        }

        // 先解除引用，再销毁 Vue 实例
        const vmToDestroy = instance
        instanceMap.delete(dom)

        // 确保在下一个事件循环中销毁，避免与React卸载冲突
        setTimeout(() => {
          vmToDestroy.$destroy()
        }, 0)
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
    name: 'RemoteAppComponent',
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
            while (this.$el.firstChild) {
              this.$el.removeChild(this.$el.firstChild)
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
