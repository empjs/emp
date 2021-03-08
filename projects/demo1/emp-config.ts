import {EMPConfig} from '@efox/emp-cli/types/emp-config'

const config: EMPConfig = {
  webpack(wp, empEnv, webpackEnv) {
    return wp
  },
}
export default config
