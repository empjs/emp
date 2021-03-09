import {Configuration, container} from 'webpack/types'
import Config from 'webpack-chain/types'
type MFOptions = ConstructorParameters<typeof container.ModuleFederationPlugin>[0]
declare interface EMPConfig {
  /** webpack config */
  webpack?: (wp: Configuration, empEnv: string, webpackEnv: 'development' | 'production') => Configuration
  /** webpack chain config */
  webpackChain?: (wpc: Config, empEnv: string, webpackEnv: 'development' | 'production') => void
  /** compile replace babel use swc or esbuild */
  compile?: Array<any>
  /** react vue svetle and more */
  framework?: Array<any>
  /** module federation config */
  moduleFederation?: MFOptions
}
