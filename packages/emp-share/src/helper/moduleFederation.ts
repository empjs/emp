import * as MFRuntime from '@module-federation/runtime'
import * as MFSDK from '@module-federation/sdk'
export {MFRuntime, MFSDK}

// export type FederationRuntimePlugin = MFRuntime.FederationRuntimePlugin
import type {ModuleFederationRuntimePlugin} from '@module-federation/runtime'
export type FederationRuntimePlugin = ModuleFederationRuntimePlugin
export type {ModuleFederationRuntimePlugin}
