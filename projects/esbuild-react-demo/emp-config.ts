import {EMPConfig} from '@efox/emp-cli/types/emp-config'
import esbuild from '@efox/emp-esbuild'
const config: EMPConfig = {
  compile: [esbuild],
  moduleFederation: {
    name: 'esbuildReactDemo',
    filename: 'emp.js',
    remotes: {
      '@emp/demo1': 'demo1@http://localhost:8001/emp.js',
    },
    exposes: {},
    shared: {
      react: {eager: true, singleton: true, requiredVersion: '^16.13.1'},
      'react-dom': {eager: true, singleton: true, requiredVersion: '^16.13.1'},
      'react-router-dom': {requiredVersion: '^5.1.2'},
      axios: {requiredVersion: '^0.19.2'},
    },
  },
}
export default config
