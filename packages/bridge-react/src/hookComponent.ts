import {BridgeProvider, BridgeProviderReturn, ComponentProvider, ReactOptions} from './types'
import {getReactVersion, handleError} from './utils'

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
 * Create remote app component - for consumer to load application-level modules using hooks
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

  const reactVersion = getReactVersion(React)
  const isReact18OrAbove = reactVersion >= 18

  // 使用函数组件和Hooks替代类组件
  return function ReactRemoteAppHookComponent(props: any) {
    const containerRef = React.useRef(null)
    const providerRef = React.useRef(null)
    const providerInfoRef = React.useRef(null)
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [error, setError] = React.useState(null)

    // React 18+ 使用 useSyncExternalStore 来处理外部状态更新
    const forceUpdate =
      isReact18OrAbove && React.useSyncExternalStore
        ? React.useSyncExternalStore(
            (callback: any) => {
              const id = Math.random().toString(36)
              const listeners = providerRef.current?.['_listeners'] || new Map()
              listeners.set(id, callback)
              if (providerRef.current) providerRef.current['_listeners'] = listeners
              return () => {
                if (providerRef.current?.['_listeners']) {
                  providerRef.current['_listeners'].delete(id)
                }
              }
            },
            () => props,
            () => props,
          )
        : props

    // 加载组件
    const loadComponent = React.useCallback(async () => {
      try {
        if (typeof component === 'function') {
          const result = component()

          if (result instanceof Promise) {
            const module = await result
            providerInfoRef.current = module.default
          } else {
            providerInfoRef.current = component as BridgeProvider
          }

          setIsLoaded(true)
        }
      } catch (err) {
        const error = err as Error
        setError(error)
        handleError(error, 'Failed to load component', options.onError)
      }
    }, [])

    // 渲染组件
    const renderComponent = React.useCallback(() => {
      if (!providerInfoRef.current || !containerRef.current) return

      try {
        if (!providerRef.current) {
          providerRef.current = providerInfoRef.current()
        }
        providerRef.current.render(containerRef.current, props)
      } catch (error) {
        handleError(error as Error, 'Failed to render component')
      }
    }, [props])

    // 卸载组件
    const unmountComponent = React.useCallback(() => {
      try {
        if (providerRef.current) {
          if (containerRef.current) {
            try {
              providerRef.current.destroy(containerRef.current)
            } catch (destroyError) {
              handleError(destroyError as Error, 'Error during provider unmount')
            }
          }
          providerRef.current = null
        }
      } catch (error) {
        console.error('[EMP-ERROR] Failed to unmount component', error)
      }
    }, [])

    // 组件加载
    React.useEffect(() => {
      loadComponent()
    }, [loadComponent])

    // 组件渲染
    React.useEffect(() => {
      if (isLoaded && containerRef.current) {
        renderComponent()
      }
    }, [isLoaded, renderComponent])

    // 组件更新 - 根据 React 版本使用不同的更新策略
    React.useEffect(() => {
      if (isLoaded && providerRef.current && containerRef.current) {
        // React 18+ 使用 forceUpdate 触发更新
        if (isReact18OrAbove) {
          // forceUpdate 已经在 useSyncExternalStore 中处理
          providerRef.current.render(containerRef.current, props)
        } else {
          // React 16/17 直接更新
          providerRef.current.render(containerRef.current, props)
        }
      }
    }, [props, isLoaded, forceUpdate])

    // 组件卸载
    React.useEffect(() => {
      return () => {
        if (reactOptions?.syncUnmount) {
          // 同步卸载
          unmountComponent()
        } else {
          // 使用微任务队列，比setTimeout更快但仍然异步
          Promise.resolve().then(() => {
            if (containerRef.current) {
              unmountComponent()
            }
          })
        }
      }
    }, [unmountComponent])

    // 处理错误边界
    if (error && reactOptions.errorBoundary) {
      return React.createElement(
        'div',
        {
          className: 'emp-error-boundary',
          style: {
            color: 'red',
            padding: '10px',
            border: '1px solid red',
            borderRadius: '4px',
            margin: '10px 0',
          },
        },
        `Error loading component: ${error.message}`,
      )
    }

    return React.createElement('div', {
      ref: (node: HTMLElement | null) => {
        containerRef.current = node
      },
    })
  }
}

export default {
  createBridgeComponent,
  createRemoteAppComponent,
}
