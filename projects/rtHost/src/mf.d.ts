export {
  createInstance,
  getInstance,
  getReactShare,
  init,
  loadShare,
  preloadRemote,
  registerPlugins,
  registerRemotes,
  registerShared,
} from '@empjs/share/sdk'

import {loadRemote} from '@module-federation/runtime'

declare module '@empjs/share/sdk' {
  export type {
    loadRemote,
    createInstance,
    getInstance,
    getReactShare,
    init,
    loadShare,
    preloadRemote,
    registerPlugins,
    registerRemotes,
    registerShared,
  }
}
