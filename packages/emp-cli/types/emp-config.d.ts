import {Configuration} from 'webpack/types'
import Config from 'webpack-chain/types'
declare interface EMPConfig {
  webpack?: (wp: Configuration, empEnv: string, webpackEnv: 'development' | 'production') => Configuration
  webpackChain?: (wpc: Config, empEnv: string, webpackEnv: 'development' | 'production') => void
  compile?: Array<any>
  framework?: Array<any>
}
