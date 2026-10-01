import type {BridgeProvider, BridgeProviderReturn} from '@empjs/bridge-react'
export type {BridgeProvider, BridgeProviderReturn}
export type FrameworkId = 'react16' | 'react17' | 'react18' | 'react19' | 'vue2' | 'vue3'
export interface DemoEvent {
  runtime: FrameworkId
  instanceId: string
  type: 'mounted' | 'unmounted' | 'countChanged'
  value?: number
}
export interface DemoProps {
  name: string
  step: number
  instanceId: string
  note?: string
  onChange?: (event: DemoEvent) => void
  onLifecycle?: (event: DemoEvent) => void
}
export interface FrameworkRuntime {
  id: FrameworkId
  label: string
  version: string
  bridge: string
  bridgeVersion: string
  provider: BridgeProvider
  host: (
    component: BridgeProvider | (() => Promise<{default: BridgeProvider}>),
    onError: (error: Error) => void,
  ) => BridgeProvider
}
export type CheckStatus = 'pending' | 'running' | 'passed' | 'failed'
export interface CheckResult {
  status: CheckStatus
  detail: string
}
