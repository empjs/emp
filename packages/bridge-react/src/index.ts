// 直接导入 classComponent 中的实现
import {createBridgeComponent, createRemoteAppComponent} from './classComponent'
import {
  AsyncBridgeProvider,
  BridgeProvider,
  BridgeProviderReturn,
  ComponentProvider,
  ReactOptions as ReactComponentOptions,
  RemoteComponentOptions,
} from './types'

// 重新导出类型
export {
  BridgeProviderReturn,
  BridgeProvider,
  AsyncBridgeProvider,
  ComponentProvider,
  ReactComponentOptions,
  RemoteComponentOptions,
}

// 直接导出 classComponent 中的实现
export {createBridgeComponent, createRemoteAppComponent}

export default {
  createBridgeComponent,
  createRemoteAppComponent,
}
