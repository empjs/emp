import type {GlobalStore} from '@empjs/cli'
import {EmpShare} from './share'
import type {EMPPluginShareType} from './types'
//
export * from 'src/framework/react/config'
export * from 'src/framework/vue/config'
//
export const pluginRspackEmpShare = (o: EMPPluginShareType = {}) => {
  return {
    name: '@empjs/share',
    async rsConfig(store: GlobalStore) {
      //
      if (o.manifest === true) {
        o.manifest = {
          fileName: 'emp.json',
        }
      } else if (typeof o.manifest === 'object') {
        o.manifest = store.deepAssign({fileName: 'emp.json'}, o.manifest)
      }
      const empShare = new EmpShare(o, store)
      empShare.setup()
    },
  }
}
export default pluginRspackEmpShare
