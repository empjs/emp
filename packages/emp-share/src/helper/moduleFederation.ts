import * as MFRuntime from '@empjs/module-federation/runtime'
import * as MFSDK from '@empjs/module-federation/sdk'
export {MFRuntime, MFSDK}

// export type FederationRuntimePlugin = MFRuntime.FederationRuntimePlugin
import type {ModuleFederationRuntimePlugin} from '@empjs/module-federation/runtime'
export type FederationRuntimePlugin = ModuleFederationRuntimePlugin
