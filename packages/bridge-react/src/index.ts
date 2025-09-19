// import type {ReactNode} from 'react'
// import React, {useEffect, useRef} from 'react'
type ReactNode = any

// 定义应用提供者返回的接口
export interface BridgeProviderReturn {
  render: (dom: HTMLElement, props: any) => void
  destroy: (dom: HTMLElement) => void
}

// 定义应用提供者函数类型
export type BridgeProvider = () => BridgeProviderReturn

/**
 * createBridgeComponent - 用于生产者包装应用级别导出模块
 *
 * 这个函数用于创建一个桥接组件，使React应用可以被远程加载和渲染
 * 支持 React 16 到 19 版本
 *
 * @param Component 要导出的React组件
 * @returns 返回一个符合BridgeProvider接口的函数
 */
export function createBridgeComponent(Component: React.ComponentType<any>, {React, ReactDOM, createRoot}: any) {
  return function (): BridgeProviderReturn {
    const rootMap = new Map<HTMLElement, any>()

    // 检测 React 版本并返回对应的渲染和卸载方法
    const getReactAPI = () => {
      // 检查是否存在 ReactDOM.createRoot 方法 (React 18+)
      if (createRoot) {
        return {
          createRoot: (dom: HTMLElement) => {
            const root = createRoot(dom)
            return {
              render: (element: React.ReactElement) => root.render(element),
              unmount: () => root.unmount(),
            }
          },
        }
      }

      // 检查是否存在 ReactDOM (React 16/17)
      if (ReactDOM) {
        return {
          createRoot: (dom: HTMLElement) => {
            return {
              render: (element: React.ReactElement) => {
                ReactDOM.render(element, dom)
                return dom
              },
              unmount: () => ReactDOM.unmountComponentAtNode(dom),
            }
          },
        }
      }

      // 如果无法确定版本，抛出错误
      throw new Error('无法检测 React 版本，请确保正确引入 React')
    }

    return {
      render(dom: HTMLElement, props: any) {
        // 获取对应版本的 React API
        const reactAPI = getReactAPI()

        // 创建 React 根元素
        const root = reactAPI.createRoot(dom)
        rootMap.set(dom, root)

        // 渲染组件
        root.render(React.createElement(Component, props))
      },

      destroy(dom: HTMLElement) {
        // 获取并卸载React根
        const root = rootMap.get(dom)
        if (root) {
          root.unmount()
          rootMap.delete(dom)
        }
      },
    }
  }
}

/**
 * createRemoteAppComponent - 用于消费者加载应用级别模块
 *
 * 这个函数用于创建一个组件，该组件可以加载并渲染远程应用
 *
 * @param options 配置选项，包含loader或component
 * @returns 返回一个React组件
 */
export function createRemoteAppComponent(
  options: {
    // 加载远程模块的函数，与component二选一
    loader?: () => Promise<{default: BridgeProvider}>
    // 直接传入已加载好的组件，与loader二选一
    component?: BridgeProvider
    // 加载失败时显示的组件
    fallback?: ReactNode
    // 加载中显示的组件
    loading?: ReactNode
    // 错误处理函数
    onError?: (error: Error) => void
  },
  {React}: any,
) {
  if (!options.loader && !options.component) {
    throw new Error('createRemoteAppComponent: 必须提供 loader 或 component 参数')
  }

  // 创建一个懒加载组件
  const LazyComponent = React.lazy(async () => {
    try {
      // 获取提供者信息，可以是通过loader加载或直接使用传入的component
      let providerInfo: BridgeProvider

      if (options.component) {
        // 直接使用传入的组件
        providerInfo = options.component
      } else if (options.loader) {
        // 通过loader加载远程模块
        const module = await options.loader()
        providerInfo = module.default
      } else {
        throw new Error('createRemoteAppComponent: 必须提供 loader 或 component 参数')
      }

      // 返回一个组件，该组件在挂载时渲染远程应用
      return {
        default: (props: any) => {
          const rootRef = React.useRef(null)
          const providerInfoRef = React.useRef(null)

          React.useEffect(() => {
            if (!rootRef.current) return

            // 创建提供者实例
            const providerReturn = providerInfo()
            providerInfoRef.current = providerReturn

            // 渲染远程应用
            providerReturn.render(rootRef.current, props)

            // 清理函数，在组件卸载时销毁远程应用
            return () => {
              if (rootRef.current && providerInfoRef.current) {
                providerInfoRef.current.destroy(rootRef.current)
                providerInfoRef.current = null
              }
            }
          }, [])

          // 返回一个容器div，远程应用将渲染到这个div中
          return React.createElement('div', {
            ref: rootRef,
          })
        },
      }
    } catch (error) {
      // 处理加载错误
      if (options.onError && error instanceof Error) {
        options.onError(error)
      }
      throw error
    }
  })

  // 返回一个包装了Suspense的组件
  return function RemoteAppComponent(props: any) {
    return React.createElement(
      React.Suspense,
      {fallback: options.loading || options.fallback || React.createElement('div', null, 'Loading...')},
      React.createElement(LazyComponent, props),
    )
  }
}

// 导出默认模块
export default {
  createBridgeComponent,
  createRemoteAppComponent,
}
