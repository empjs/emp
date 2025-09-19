// 简化类型定义
export interface BridgeProviderReturn {
  render: (dom: HTMLElement, props?: any) => void
  destroy: (dom: HTMLElement) => void
}

export type BridgeProvider = () => BridgeProviderReturn
export type AsyncBridgeProvider = () => Promise<{default: BridgeProvider}>
export type ComponentProvider = BridgeProvider | AsyncBridgeProvider

/**
 * 创建桥接组件 - 用于生产者包装应用级别导出模块
 */
export function createBridgeComponent(Component: any, options: any): BridgeProvider {
  const {React, ReactDOM, createRoot} = options
  const hasCreateRoot = typeof createRoot === 'function'

  return function (): BridgeProviderReturn {
    const rootMap = new Map()

    // 渲染或更新组件
    const render = (dom: HTMLElement, props?: any): void => {
      try {
        const element = React.createElement(Component, props || {})
        const existingRoot = rootMap.get(dom)

        if (existingRoot) {
          // 更新已存在的组件
          if (hasCreateRoot && 'render' in existingRoot && typeof existingRoot.render === 'function') {
            existingRoot.render(element)
          } else {
            ReactDOM.render(element, dom)
          }
        } else {
          // 首次渲染组件
          let root: any
          if (hasCreateRoot && createRoot) {
            root = createRoot(dom)
            root.render(element)
          } else {
            ReactDOM.render(element, dom)
            root = dom
          }
          rootMap.set(dom, root)
        }
      } catch (error) {
        console.error('[EMP-ERROR] 渲染/更新失败', error)
        throw error
      }
    }

    // 卸载组件
    const destroy = (dom: HTMLElement): void => {
      const root = rootMap.get(dom)
      if (!root) return

      try {
        if (hasCreateRoot && 'unmount' in root && typeof root.unmount === 'function') {
          root.unmount()
        } else if (typeof ReactDOM.unmountComponentAtNode === 'function') {
          ReactDOM.unmountComponentAtNode(dom)
        }
        rootMap.delete(dom)
      } catch (error) {
        console.error('[EMP-ERROR] 卸载失败', error)
      }
    }

    return {render, destroy}
  }
}

/**
 * 创建远程应用组件 - 用于消费者加载应用级别模块
 */
export function createRemoteAppComponent(component: ComponentProvider, reactOptions: any, options: any = {}): any {
  if (!component) {
    throw new Error('createRemoteAppComponent: component参数不能为空')
  }

  const {React} = reactOptions

  class RemoteAppComponent extends React.Component {
    containerRef = React.createRef()
    provider: any = null
    providerInfo: any = null
    isMounted = false

    constructor(props: any) {
      super(props)
      this.loadComponent()
    }

    async loadComponent() {
      try {
        if (typeof component === 'function') {
          try {
            const result = component()

            if (result instanceof Promise) {
              const module = await result
              this.providerInfo = module.default
            } else {
              this.providerInfo = component
            }
          } catch (error) {
            this.providerInfo = component
          }
        }

        if (this.isMounted && this.containerRef.current) {
          this.renderComponent()
        }
      } catch (error) {
        if (options.onError) options.onError(error)
        console.error('[EMP-ERROR] 加载组件失败', error)
      }
    }

    renderComponent() {
      if (!this.providerInfo || !this.containerRef.current) return

      try {
        if (!this.provider) {
          this.provider = this.providerInfo()
        }
        this.provider.render(this.containerRef.current, this.props)
      } catch (error) {
        console.error('[EMP-ERROR] 渲染组件失败', error)
      }
    }

    unmountComponent() {
      if (this.provider && this.containerRef.current) {
        try {
          this.provider.destroy(this.containerRef.current)
          this.provider = null
        } catch (error) {
          console.error('[EMP-ERROR] 卸载组件失败', error)
        }
      }
    }

    componentDidMount() {
      this.isMounted = true
      if (this.providerInfo) this.renderComponent()
    }

    componentDidUpdate() {
      if (this.isMounted && this.provider && this.containerRef.current) {
        try {
          this.provider.render(this.containerRef.current, this.props)
        } catch (error) {
          console.error('[EMP-ERROR] 更新组件失败', error)
        }
      }
    }

    componentWillUnmount() {
      this.isMounted = false

      if (typeof window !== 'undefined' && window.requestAnimationFrame) {
        window.requestAnimationFrame(() => {
          this.unmountComponent()
        })
      } else {
        setTimeout(() => {
          this.unmountComponent()
        }, 0)
      }
    }

    render() {
      return React.createElement('div', {ref: this.containerRef})
    }
  }

  return RemoteAppComponent
}

// 导出默认模块
export default {
  createBridgeComponent,
  createRemoteAppComponent,
}
