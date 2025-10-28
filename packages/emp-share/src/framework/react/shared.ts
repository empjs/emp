import {EMPShareRuntimeAdapterReactType, InitOptionsType} from 'src/types'

const win: any = window
let globalLib = {}
const {EMPShareGlobalVal} = win || {}
if (EMPShareGlobalVal && EMPShareGlobalVal.frameworkLib) {
  globalLib = win[EMPShareGlobalVal.frameworkLib]
}
const libs: EMPShareRuntimeAdapterReactType = {
  scope: 'default',
  ...globalLib,
}
export const shared = (): InitOptionsType['shared'] => {
  const {React, ReactDOM, scope} = libs
  return {
    react: {
      lib: () => React,
      version: React.version,
      scope,
      shareConfig: {
        singleton: true,
        requiredVersion: `^${React.version}`,
      },
    },
    'react-dom': {
      lib: () => ReactDOM,
      version: ReactDOM.version,
      scope,
      shareConfig: {
        singleton: true,
        requiredVersion: `^${React.version}`,
      },
    },
  }
}
