import * as mfRuntime from '@module-federation/runtime'

const win: any = window
const mf = win[win.EMPShareGlobalVal.runtimeLib]['MFRuntime']

//
export const getInstance: typeof mfRuntime.getInstance = mf.getInstance
export const createInstance: typeof mfRuntime.createInstance = mf.createInstance
export const init: typeof mfRuntime.init = mf.init
export const registerShared: typeof mfRuntime.registerShared = mf.registerShared
export const registerRemotes: typeof mfRuntime.registerRemotes = mf.registerRemotes
export const registerPlugins: typeof mfRuntime.registerPlugins = mf.registerPlugins
export const loadRemote: typeof mfRuntime.loadRemote = mf.loadRemote
export const preloadRemote: typeof mfRuntime.preloadRemote = mf.preloadRemote
export const loadShare: typeof mfRuntime.loadShare = mf.loadShare

export const getReactShare = () => {
  const {React, ReactDOM, scope = 'default'} = win[win.EMPShareGlobalVal.frameworkLib]
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
