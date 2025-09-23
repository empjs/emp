// Type definitions
export interface BridgeProviderReturn {
  render: (dom: HTMLElement, props?: Record<string, any>) => void
  destroy: (dom: HTMLElement) => void
}

export type BridgeProvider = () => BridgeProviderReturn
export type AsyncBridgeProvider = () => Promise<{default: BridgeProvider}>
export type ComponentProvider = BridgeProvider | AsyncBridgeProvider

interface ReactOptions {
  React?: any
  ReactDOM?: any
  createRoot?: any
  syncUnmount?: boolean
  errorBoundary?: boolean
}

/**
 * Create bridge component - for producer to wrap application-level export modules
 */
export function createBridgeComponent(Component: any, options: ReactOptions): BridgeProvider {
  const {React, ReactDOM, createRoot} = options
  const hasCreateRoot = typeof createRoot === 'function'

  return function (): BridgeProviderReturn {
    const rootMap = new Map<HTMLElement, any>()

    const render = (dom: HTMLElement, props?: Record<string, any>): void => {
      try {
        const element = React.createElement(Component, props || {})
        const existingRoot = rootMap.get(dom)

        if (existingRoot) {
          if (hasCreateRoot && 'render' in existingRoot) {
            existingRoot.render(element)
          } else if (ReactDOM.render) {
            ReactDOM.render(element, dom)
          }
        } else {
          if (hasCreateRoot && createRoot) {
            const root = createRoot(dom)
            root.render(element)
            rootMap.set(dom, root)
          } else if (ReactDOM.render) {
            ReactDOM.render(element, dom)
            rootMap.set(dom, dom)
          }
        }
      } catch (error) {
        console.error('[EMP-ERROR] Failed to render/update component', error)
        throw error
      }
    }

    const destroy = (dom: HTMLElement): void => {
      const root = rootMap.get(dom)
      if (!root) return

      try {
        if (hasCreateRoot && 'unmount' in root) {
          root.unmount()
        } else if (ReactDOM.unmountComponentAtNode) {
          ReactDOM.unmountComponentAtNode(dom)
        }
        rootMap.delete(dom)
      } catch (error) {
        console.error('[EMP-ERROR] Failed to unmount component', error)
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
  reactOptions: ReactOptions,
  options: {onError?: (error: Error) => void} = {},
): any {
  if (!component) {
    throw new Error('createRemoteAppComponent: component parameter cannot be empty')
  }

  const {React} = reactOptions

  class RemoteAppComponent extends React.Component {
    containerRef = React.createRef()
    provider: BridgeProviderReturn | null = null
    providerInfo: BridgeProvider | null = null
    isMounted = false

    constructor(props: any) {
      super(props)
      this.loadComponent()
    }

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

        if (this.isMounted && this.containerRef.current) {
          this.renderComponent()
        }
      } catch (error) {
        if (options.onError) options.onError(error as Error)
        console.error('[EMP-ERROR] Failed to load component', error)
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
        console.error('[EMP-ERROR] Failed to render component', error)
      }
    }

    unmountComponent() {
      console.log('unmountComponent')
      try {
        // 不强依赖containerRef.current存在，避免可能的null引用
        if (this.provider) {
          if (this.containerRef && this.containerRef.current) {
            try {
              this.provider.destroy(this.containerRef.current)
            } catch (destroyError) {
              console.warn('[bridge-react] Error during provider unmount:', destroyError)
            }
          }

          // 确保清理provider引用
          this.provider = null
        }
      } catch (error) {
        console.error('[EMP-ERROR] Failed to unmount component', error)
      }
    }

    componentDidMount() {
      console.log('componentDidMount')
      this.isMounted = true
      if (this.providerInfo) this.renderComponent()
    }

    componentDidUpdate() {
      console.log('componentDidUpdate')
      if (this.provider && this.containerRef.current) {
        this.provider.render(this.containerRef.current, this.props)
      }
    }

    componentWillUnmount() {
      console.log('componentWillUnmount', reactOptions?.syncUnmount)
      this.isMounted = false

      // 检查是否使用同步卸载
      if (reactOptions?.syncUnmount) {
        // 直接同步卸载组件，避免异步操作导致的DOM节点关系变化
        this.unmountComponent()
      } else {
        console.log('componentWillUnmount async', this.containerRef, this.containerRef.current)
        // 使用微任务队列，比setTimeout更快但仍然异步
        Promise.resolve().then(() => {
          if (this.containerRef && this.containerRef.current) {
            this.unmountComponent()
          }
        })
      }
    }

    render() {
      return React.createElement('div', {ref: this.containerRef})
    }
  }

  return RemoteAppComponent
}

export default {
  createBridgeComponent,
  createRemoteAppComponent,
}
