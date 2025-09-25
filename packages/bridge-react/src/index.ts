// 导入类型和实现
import {
  createBridgeComponent as createClassBridgeComponent,
  createRemoteAppComponent as createClassRemoteAppComponent,
} from './classComponent'
import {createRemoteAppComponent as createHookRemoteAppComponent} from './hookComponent'
import {
  AsyncBridgeProvider,
  BridgeProvider,
  BridgeProviderReturn,
  ComponentProvider,
  ReactOptions as ReactComponentOptions,
  RemoteComponentOptions,
} from './types'
import {getReactVersion, handleError} from './utils'

// 重新导出类型
export {
  BridgeProviderReturn,
  BridgeProvider,
  AsyncBridgeProvider,
  ComponentProvider,
  ReactComponentOptions,
  RemoteComponentOptions,
}

/**
 * 创建桥接组件 - 用于生产者包装应用级导出模块
 */
export function createBridgeComponent(Component: any, options: ReactComponentOptions) {
  try {
    return createClassBridgeComponent(Component, options)
  } catch (error) {
    handleError(error as Error, 'Failed to create bridge component')
    throw error
  }
}

/**
 * 创建远程应用组件 - 用于消费者加载应用级模块
 */
export function createRemoteAppComponent(
  component: ComponentProvider,
  reactOptions: ReactComponentOptions,
  options: RemoteComponentOptions = {},
) {
  try {
    if (!component) {
      throw new Error('createRemoteAppComponent: component parameter cannot be empty')
    }

    const reactVersion = getReactVersion(reactOptions.React)

    // React 17+ 使用 Hook 实现，否则使用类组件实现
    return reactVersion >= 17
      ? createHookRemoteAppComponent(component, reactOptions, options)
      : createClassRemoteAppComponent(component, reactOptions, options)
  } catch (error) {
    handleError(error as Error, 'Failed to create remote app component', options?.onError)
    throw error
  }
}

export default {
  createBridgeComponent,
  createRemoteAppComponent,
}
