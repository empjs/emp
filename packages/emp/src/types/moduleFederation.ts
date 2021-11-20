import {container} from 'webpack'
import {EMPConfig} from 'src/config'
export type MFOptions = ConstructorParameters<typeof container.ModuleFederationPlugin>[0]
type MFFunction = (o: EMPConfig) => MFOptions | Promise<MFOptions>
export type MFExport = MFOptions | MFFunction
