import * as mfRuntime from '@module-federation/runtime'

const win: any = typeof window !== 'undefined' ? window : undefined
const mf = win[win.EMPShareGlobalVal.runtimeLib]['MFRuntime'] as typeof mfRuntime

let pendingRemotes: any[] = []

const getInstance = (): ReturnType<typeof mfRuntime.getInstance> => {
  const inst = mf.getInstance()
  if (!inst) return inst
  if (inst.options.remotes.length > 0) pendingRemotes = inst.options.remotes
  else if (pendingRemotes.length > 0) {
    inst.registerRemotes(pendingRemotes)
    pendingRemotes = []
  }
  return inst
}

const call = <T>(method: string) => ((...args: any[]) => (getInstance() as any)?.[method]?.(...args)) as T

export {getInstance}
export const createInstance: typeof mfRuntime.createInstance = (...args) => mf.createInstance(...args)
export const init: typeof mfRuntime.init = mf.init
export const registerShared = call<typeof mfRuntime.registerShared>('registerShared')
export const registerRemotes = call<typeof mfRuntime.registerRemotes>('registerRemotes')
export const registerPlugins = call<typeof mfRuntime.registerPlugins>('registerPlugins')
export const loadRemote = call<typeof mfRuntime.loadRemote>('loadRemote')
export const preloadRemote = call<typeof mfRuntime.preloadRemote>('preloadRemote')
export const loadShare = call<typeof mfRuntime.loadShare>('loadShare')

export const getReactShare = () => {
  const {React, ReactDOM, scope = 'default'} = win[win.EMPShareGlobalVal.frameworkLib]
  return {
    react: {
      lib: () => React,
      version: React.version,
      scope,
      shareConfig: {singleton: true, requiredVersion: `^${React.version}`},
    },
    'react-dom': {
      lib: () => ReactDOM,
      version: ReactDOM.version,
      scope,
      shareConfig: {singleton: true, requiredVersion: `^${React.version}`},
    },
  }
}
