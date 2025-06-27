export type {FederationRuntimePlugin} from 'src/helper/moduleFederation'

import type {MFRuntime, MFSDK} from 'src/helper/moduleFederation'
export type Override<What, With> = Omit<What, keyof With> & With
export type EMPShareRuntimeType = {
  MFRuntime: Required<typeof MFRuntime>
  MFSDK: Required<typeof MFSDK>
}
export type EMPShareRuntimeAdapterReactType = {
  React?: any
  ReactDOM?: any
  createRoot?: any
  hydrateRoot?: any
  scope: string
}

//
export type InitOptionsType = Parameters<typeof MFRuntime.init>[0]
export type LoadRemoteType = Parameters<typeof MFRuntime.loadRemote>
export type FrameworkType = 'react' | 'vue' | 'vue2' | 'angular'
export type EmpRuntimeOptions = {
  showLog?: boolean
}
