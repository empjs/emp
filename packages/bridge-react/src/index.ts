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
      if (this.provider && this.containerRef.current) {
        try {
          this.provider.destroy(this.containerRef.current)
          this.provider = null
        } catch (error) {
          console.error('[EMP-ERROR] Failed to unmount component', error)
        }
      }
    }

    componentDidMount() {
      this.isMounted = true
      if (this.providerInfo) this.renderComponent()
    }

    componentDidUpdate() {
      if (this.provider && this.containerRef.current) {
        this.provider.render(this.containerRef.current, this.props)
      }
    }

    componentWillUnmount() {
      this.isMounted = false
      const cleanup = () => this.unmountComponent()

      if (typeof window !== 'undefined' && window.requestAnimationFrame) {
        window.requestAnimationFrame(cleanup)
      } else {
        setTimeout(cleanup, 0)
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
