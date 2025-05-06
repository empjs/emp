import type {FederationRuntimePlugin} from 'src/types'

export const catchErrorNextPlugin: (showLog?: boolean) => FederationRuntimePlugin = function (showLog = false) {
  return {
    name: 'catch-error-next-plugin',
    errorLoadRemote(o) {
      if (showLog) {
        console.log('[@emp/share]', o.id, o.lifecycle, o.from)
        console.error('[@emp/share]', o.error)
      }
      return {}
    },
  }
}
