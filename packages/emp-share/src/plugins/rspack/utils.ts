import type {EMPSHARERuntimeOptions} from './types'
export function getRuntimeLib(host: EMPSHARERuntimeOptions['frameworkLib'], mode: string, entry = 'runtime') {
  if (typeof host === 'string') {
    if (entry === 'runtime') {
      return `${host}/runtime${mode === 'development' ? '.development' : ''}.umd.js`
    } else {
      return `${host}/${entry}.${mode}.umd.js`
    }
  } else if (typeof host === 'object') {
    if (mode === 'development') return host.dev
    else return host.prod
  }
  return ''
}
