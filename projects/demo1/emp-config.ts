import {EMPConfig} from '@efox/emp-cli/types/emp-config'
import mf from './empconfig/mf'
const config: EMPConfig = {
  // webpackChain(config) {
  //   config.devServer.port(8001)
  // },
  webpack({webpackEnv}) {
    console.log('webpack', webpackEnv)
    return {
      devServer: {
        port: 8001,
      },
      // output: {
      //   publicPath: 'http://localhost:8001/',
      // },
    }
  },
  moduleGenerator({webpackEnv}) {
    console.log('moduleGenerator', webpackEnv)
    return webpackEnv === 'development' ? '/' : `http://localhost:8001/`
  },
  async moduleFederation({webpackEnv}) {
    return mf(webpackEnv)
  },
}
export default config
