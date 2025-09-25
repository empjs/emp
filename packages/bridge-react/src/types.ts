// 统一类型定义
export interface BridgeProviderReturn {
  render: (dom: HTMLElement, props?: Record<string, any>) => void
  destroy: (dom: HTMLElement) => void
}

export type BridgeProvider = () => BridgeProviderReturn
export type AsyncBridgeProvider = () => Promise<{default: BridgeProvider}>
export type ComponentProvider = BridgeProvider | AsyncBridgeProvider

export interface ReactOptions {
  React: any
  ReactDOM?: any
  createRoot?: any
  syncUnmount?: boolean
  errorBoundary?: boolean
}

export interface RemoteComponentOptions {
  onError?: (error: Error) => void
}
