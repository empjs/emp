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
      //   props = Vue.observable(props)
      console.log('props', props)
      const existingInstance = instanceMap.get(dom)
      console.log('existingInstance', existingInstance)
      if (existingInstance) {
        // 更新组件的渲染函数，使用新的props重新渲染组件
        existingInstance.$options.render = (h: any) => h(Component, {props: props || {}})

        // 更新propsData
        existingInstance.$options.propsData = props || {}

        // 强制更新组件
        existingInstance.$forceUpdate()
        return
      }

      // Create new Vue instance with correct props handling
      const instance = new Vue({
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

    const destroy = (dom: HTMLElement): void => {
      if (!dom || !(dom instanceof HTMLElement)) {
        console.error('[EMP-ERROR] Invalid DOM element provided to destroy')
        return
      }

      const instance = instanceMap.get(dom)
      if (!instance) return
    }

    return {render, destroy}
  }
}

export function createRemoteAppComponent(
  component: ComponentProvider,
  vueOptions: Vue2Options,
  options: {onError?: (error: Error) => void} = {},
): any {}

export default {
  createBridgeComponent,
  createRemoteAppComponent,
}
