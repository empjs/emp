import type {BridgeProvider, BridgeProviderReturn, ComponentProvider, ReactOptions} from './types'
import {handleError} from './utils'

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
        handleError(error as Error, 'Failed to render/update component')
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
        handleError(error as Error, 'Failed to unmount component')
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

  class ReactRemoteAppComponent extends React.Component {
    containerRef = React.createRef()
    provider: BridgeProviderReturn | null = null
    providerInfo: BridgeProvider | null = null
    isMounted = false
    disposed = false
    loadRevision = 0

    async loadComponent() {
      const revision = ++this.loadRevision
      try {
        const result = await component()
        if (this.disposed || revision !== this.loadRevision) return
        if ('default' in result) {
          this.providerInfo = result.default
        } else {
          this.provider = result
          this.providerInfo = component as BridgeProvider
        }

        if (this.isMounted && this.containerRef.current) {
          this.renderComponent()
        }
      } catch (error) {
        if (!this.disposed && revision === this.loadRevision) {
          handleError(error as Error, 'Failed to load component', options.onError)
        }
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
        handleError(error as Error, 'Failed to render component', options.onError)
      }
    }

    componentDidMount() {
      this.isMounted = true
      this.disposed = false
      this.loadComponent()
    }

    componentDidUpdate() {
      this.renderComponent()
    }

    componentWillUnmount() {
      this.isMounted = false
      this.disposed = true
      this.loadRevision++
      this.providerInfo = null
      // Capture the container before React clears its ref. Deferred cleanup must
      // destroy this instance even after the wrapper has left the document.
      const dom = this.containerRef.current
      const provider = this.provider
      this.provider = null
      const cleanup = () => {
        if (!provider || !dom) return
        try {
          provider.destroy(dom)
        } catch (error) {
          handleError(error as Error, 'Failed to unmount component', options.onError)
        }
      }
      if (reactOptions.syncUnmount) cleanup()
      else Promise.resolve().then(cleanup)
    }

    render() {
      return React.createElement('div', {ref: this.containerRef})
    }
  }

  return ReactRemoteAppComponent
}

export default {
  createBridgeComponent,
  createRemoteAppComponent,
}
