import {EMPShareRuntimeAdapterVueType, InitOptionsType} from 'src/types'

// o['vue'] = `EMP_ADAPTER_VUE.Vue`
// o['vue-router'] = `EMP_ADAPTER_VUE.VueRouter`
// o['pinia'] = `EMP_ADAPTER_VUE.Pinia`
const win: any = window
let globalLib = {}
const {EMPShareGlobalVal} = win || {}
if (EMPShareGlobalVal && EMPShareGlobalVal.frameworkLib) {
  globalLib = win[EMPShareGlobalVal.frameworkLib]
}
const libs: EMPShareRuntimeAdapterVueType = {
  scope: 'default',
  ...globalLib,
}
export const shared = (): InitOptionsType['shared'] => {
  const {Vue, VueRouter, scope} = libs
  return {
    vue: {
      lib: () => Vue,
      version: Vue.version,
      scope,
      shareConfig: {
        singleton: true,
        requiredVersion: `^${Vue.version}`,
      },
    },
    'vue-router': {
      lib: () => VueRouter,
      version: VueRouter.version,
      scope,
      shareConfig: {
        singleton: true,
        requiredVersion: `^${VueRouter.version}`,
      },
    },
  }
}
